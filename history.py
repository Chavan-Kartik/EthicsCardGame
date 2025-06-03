from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Choice
from database import get_db
from auth import get_current_user
from schemas import UserResponse

router = APIRouter()

@router.get("/history")
def get_user_history(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    choices = db.query(Choice).filter(Choice.user_id == current_user.id).order_by(Choice.timestamp).all()
    games = []
    for i in range(0, len(choices), 5):
        game_choices = choices[i:i+5]
        if len(game_choices) == 5:
            total_score = sum(c.score or 0 for c in game_choices)
            periods = set(c.period for c in game_choices)
            period = periods.pop() if len(periods) == 1 else "Multiple"
            timestamp = game_choices[-1].timestamp
            games.append({
                "period": period,
                "total_score": total_score,
                "timestamp": timestamp
            })
    return {
        "username": current_user.username,
        "games": games
    }
