"""
Authentication & Current User API Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User, AuditLog
from app.schemas.auth import LoginRequest, Token, UserResponse
from app.core.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. For demo access, use admin/admin123 or operator/operator123."
        )

    # Record login audit
    audit = AuditLog(
        user_id=user.id,
        username=user.username,
        action="USER_LOGIN",
        description=f"User {user.username} ({user.role}) authenticated successfully."
    )
    db.add(audit)
    db.commit()

    token = create_access_token({"sub": user.username, "role": user.role})
    return Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        username=user.username,
        full_name=user.full_name
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_demo(username: str = "admin", db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
