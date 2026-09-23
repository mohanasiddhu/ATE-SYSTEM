"""
AI-Driven Smart Traffic Enforcement System - Configuration
"""
from typing import Optional
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Driven Smart Traffic Enforcement System"
    VERSION: str = "4.2.0"
    API_PREFIX: str = "/api"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./data/traffic_enforcement.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "smart-traffic-enforcement-jwt-super-secret-key-2026-academic")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Demo & AI Settings
    DEMO_MODE: bool = True
    MODEL_AVAILABLE: bool = False
    YOLO_MODEL_PATH: str = "./data/models/yolov8n.pt"
    VEHICLE_CONF_THRESHOLD: float = 0.50
    PLATE_CONF_THRESHOLD: float = 0.60
    SPEED_LIMIT_DEFAULT: int = 60
    PROCESS_EVERY_N_FRAMES: int = 3
    
    # Storage
    EVIDENCE_DIR: str = "./data/evidence"
    DATA_RETENTION_DAYS: int = 60
    
    # Optional Gemini AI for report summaries
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Ensure directories exist
os.makedirs("./data/evidence", exist_ok=True)
os.makedirs("./data/models", exist_ok=True)
os.makedirs("./data/exports", exist_ok=True)
