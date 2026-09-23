"""
Authentication & User Schemas
"""
from typing import Optional
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    username: str
    full_name: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    badge_id: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True
