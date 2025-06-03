from pydantic import BaseModel

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True

from pydantic import BaseModel
from datetime import datetime

# Schema for submitting a choice
class ChoiceCreate(BaseModel):
    period: str
    question: str
    selected_answer: str

# Schema for returning stored choices
class ChoiceResponse(BaseModel):
    period: str
    question: str
    selected_answer: str
    timestamp: datetime

    class Config:
        orm_mode = True
