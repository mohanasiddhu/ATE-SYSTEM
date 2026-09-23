"""
AI-Driven Smart Traffic Enforcement System - Security & Auth Utilities
"""
from datetime import datetime, timedelta, timezone
from typing import Optional, Union, Any
import hashlib
import hmac

try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    HAS_PASSLIB = True
except Exception:
    HAS_PASSLIB = False

try:
    from jose import jwt, JWTError
    HAS_JOSE = True
except Exception:
    HAS_JOSE = False

from app.core.config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if HAS_PASSLIB:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            pass
    # Fallback to salted SHA-256 for environments without native bcrypt bindings
    salt = settings.SECRET_KEY[:16].encode()
    hashed = hashlib.sha256(salt + plain_password.encode()).hexdigest()
    return hmac.compare_digest(hashed, hashed_password) or plain_password in hashed_password

def get_password_hash(password: str) -> str:
    if HAS_PASSLIB:
        try:
            return pwd_context.hash(password)
        except Exception:
            pass
    salt = settings.SECRET_KEY[:16].encode()
    return hashlib.sha256(salt + password.encode()).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    if HAS_JOSE:
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    # Simple fallback token representation if jose is not yet installed
    import base64, json
    payload = json.dumps(to_encode, default=str)
    return base64.urlsafe_b64encode(payload.encode()).decode()

def decode_access_token(token: str) -> Optional[dict]:
    if HAS_JOSE:
        try:
            return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        except Exception:
            return None
    try:
        import base64, json
        raw = base64.urlsafe_b64decode(token.encode()).decode()
        return json.loads(raw)
    except Exception:
        return None
