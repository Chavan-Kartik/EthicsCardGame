import os
import json
from dotenv import load_dotenv
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session

import google.generativeai as genai

from auth import hash_password, verify_password, create_access_token, decode_token
from database import SessionLocal, Base, engine
from models import User as DBUser
from history import router as history_router
from submit_choice import router as submit_choice_router

# ------------------------------ 🚀 Initialize FastAPI App
app = FastAPI()

# ------------------------------ 🌐 Routers
app.include_router(submit_choice_router, prefix="/api")
app.include_router(history_router)

# ------------------------------ 📦 Auto Create Tables
Base.metadata.create_all(bind=engine)

# ------------------------------ 🔓 Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------ 📦 DB Session Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------------------ 🛡 OAuth2 Scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ------------------------------ 📦 Pydantic Models
class SignupUser(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# ------------------------------ ✅ Signup Route
@app.post("/signup")
def signup(user: SignupUser, db: Session = Depends(get_db)):
    existing_user = db.query(DBUser).filter(
        (DBUser.username == user.username) | (DBUser.email == user.email)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username or Email already exists")

    hashed_pw = hash_password(user.password)
    new_user = DBUser(username=user.username, email=user.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully!"}

# ------------------------------ ✅ Login Route
@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(DBUser).filter(
        (DBUser.username == form_data.username) | (DBUser.email == form_data.username)
    ).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

# ------------------------------ 🔐 Protected Route
@app.get("/me")
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"username": payload["sub"]}

# ------------------------------ 🤖 Gemini AI Integration
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("API Key is missing! Add it to a .env file.")

genai.configure(api_key=API_KEY)

@app.get("/")
def read_root():
    return {"message": "Ethics in AI Backend is running!"}

@app.get("/get-dilemma")
def get_dilemma(period: str):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
        You are an AI assistant for an ethical dilemma game.
        Generate an ethical dilemma set in the {period} period of history.
        Provide ONLY a JSON response in this format:
        {{
          "question": "Your dilemma text here",
          "choices": [
            {{"text": "Choice 1", "score": 100, "explanation": "Why this is ethical or not."}},
            {{"text": "Choice 2", "score": 75, "explanation": "..."}},
            {{"text": "Choice 3", "score": 50, "explanation": "..."}},
            {{"text": "Choice 4", "score": 10, "explanation": "..."}}
          ]
        }}
        Ensure your response ONLY contains JSON (no explanations, no extra text).
        """

        response = model.generate_content(prompt)
        print("🔍 RAW AI Response:", response.text)

        if not response or not response.text:
            raise ValueError("AI returned an empty response.")

        json_str = response.text.strip().strip("```json").strip("```")
        print("🔍 Processed JSON String:", json_str)

        try:
            dilemma_data = json.loads(json_str)
            if "question" not in dilemma_data or "choices" not in dilemma_data:
                raise ValueError("Invalid AI response format.")
            # Validate each choice has text, score, and explanation
            for choice in dilemma_data["choices"]:
                if not all(k in choice for k in ("text", "score", "explanation")):
                    raise ValueError("Each choice must have text, score, and explanation.")
            return dilemma_data

        except json.JSONDecodeError as e:
            print(f"❌ JSON Parsing Failed: {e}")
            raise HTTPException(status_code=500, detail="AI response was not valid JSON.")

    except Exception as e:
        print(f"❌ AI Failed: {e}")
        raise HTTPException(status_code=500, detail=f"AI Failed: {e}")
