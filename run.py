#!/usr/bin/env python3
"""
Smart Traffic Enforcement System - Main Runner Script
Execute this script to start the FastAPI enforcement backend.
Usage:
    python run.py
"""
import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    print("=" * 65)
    print(" AI-DRIVEN SMART TRAFFIC ENFORCEMENT SYSTEM")
    print(" Command Center Node V4.2 - Academic Final-Year Prototype")
    print(f" Listening on http://{settings.HOST}:{settings.PORT}")
    print(f" Swagger UI: http://{settings.HOST}:{settings.PORT}/docs")
    print("=" * 65)
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
