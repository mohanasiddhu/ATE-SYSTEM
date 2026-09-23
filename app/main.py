"""
AI-Driven Smart Traffic Enforcement System
Main FastAPI Application Entrypoint
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.logging_config import logger
from app.database.database import Base, engine
from app.database.seed import seed_database

# Routers
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.violations import router as violations_router
from app.api.vehicles import router as vehicles_router
from app.api.cameras import router as cameras_router
from app.api.payments import router as payments_router
from app.api.analytics import router as analytics_router
from app.api.health import router as health_router
from app.api.detections import router as detections_router
from app.api.reports import router as reports_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing SQLite database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Verifying seed demo datasets...")
    seed_database()
    yield
    logger.info("Shutting down Smart Traffic Enforcement Service.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise-grade AI-powered traffic monitoring, ANPR vehicle tracking, violation detection, and smart city command center.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static and Evidence directories
os.makedirs("./data/evidence", exist_ok=True)
app.mount("/data/evidence", StaticFiles(directory="./data/evidence"), name="evidence")

# Include Routers under /api
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(dashboard_router, prefix=settings.API_PREFIX)
app.include_router(violations_router, prefix=settings.API_PREFIX)
app.include_router(vehicles_router, prefix=settings.API_PREFIX)
app.include_router(cameras_router, prefix=settings.API_PREFIX)
app.include_router(payments_router, prefix=settings.API_PREFIX)
app.include_router(analytics_router, prefix=settings.API_PREFIX)
app.include_router(health_router, prefix=settings.API_PREFIX)
app.include_router(detections_router, prefix=settings.API_PREFIX)
app.include_router(reports_router, prefix=settings.API_PREFIX)

@app.get("/")
def root_status():
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "documentation": "/docs",
        "demo_mode": settings.DEMO_MODE,
        "yolo_inference": "Available" if settings.MODEL_AVAILABLE else "Simulation Fallback Active"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
