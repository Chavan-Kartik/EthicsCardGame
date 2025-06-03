from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    choices = relationship("Choice", back_populates="user")

class Choice(Base):
    __tablename__ = "choices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    period = Column(String)
    question = Column(String)
    selected_answer = Column(String)
    score = Column(Float)  # ✅ NEW FIELD
    timestamp = Column(DateTime, default=datetime.utcnow)
    score = Column(Float, default=0.0)  # Just add this line


    user = relationship("User", back_populates="choices")
