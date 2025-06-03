from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Choice, User
from database import get_db
from auth import get_current_user
from schemas import ChoiceCreate

router = APIRouter()

@router.post("/submit")
async def submit_choice(
    choice: ChoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get the first letter of the answer to determine score
    first_letter = choice.selected_answer[0].upper() if choice.selected_answer else "X"
    
    # Assign score based on the first letter of the answer
    ethical_answers = {
        "A": 100.0,  # Best Ethical Decision
        "B": 75.0,   # Balanced Decision
        "C": 50.0,   # Risky Decision
        "D": 10.0    # Immoral Decision
    }
    
    # Default to 0 if the first letter doesn't match any known pattern
    score = ethical_answers.get(first_letter, 0.0)

    # Debug logging
    print(f"Selected answer: {choice.selected_answer}")
    print(f"First letter: {first_letter}")
    print(f"Calculated score: {score}")

    db_choice = Choice(
        user_id=current_user.id,
        period=choice.period,
        question=choice.question,
        selected_answer=choice.selected_answer,
        score=score
    )
    db.add(db_choice)
    db.commit()
    db.refresh(db_choice)

    return {
        "message": "Choice submitted",
        "score": score,
        "explanation": get_score_explanation(score)
    }

def get_score_explanation(score: float) -> str:
    if score >= 100.0:
        return "Best Ethical Decision! You made the most morally sound choice."
    elif score >= 75.0:
        return "Balanced Decision. You considered multiple perspectives."
    elif score >= 50.0:
        return "Risky Decision. This choice could have ethical implications."
    elif score >= 10.0:
        return "Immoral Decision. This choice raises serious ethical concerns."
    else:
        return "Invalid Decision. Please try again."
