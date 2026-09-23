"""
Traffic Analytics, Risk Scores & Summary API
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.database.models import Violation, Vehicle, Camera
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_analytics_overview(db: Session = Depends(get_db)):
    # Hourly traffic volume mockup with realistic peak hours (8-10 AM and 5-8 PM)
    hourly_volume = [
        {"hour": "00:00", "vehicles": 45, "violations": 2},
        {"hour": "02:00", "vehicles": 22, "violations": 1},
        {"hour": "04:00", "vehicles": 35, "violations": 1},
        {"hour": "06:00", "vehicles": 140, "violations": 6},
        {"hour": "08:00", "vehicles": 480, "violations": 24},
        {"hour": "10:00", "vehicles": 520, "violations": 29},
        {"hour": "12:00", "vehicles": 390, "violations": 16},
        {"hour": "14:00", "vehicles": 360, "violations": 14},
        {"hour": "16:00", "vehicles": 490, "violations": 21},
        {"hour": "18:00", "vehicles": 610, "violations": 35},
        {"hour": "20:00", "vehicles": 430, "violations": 18},
        {"hour": "22:00", "vehicles": 190, "violations": 7},
    ]

    # Violation type breakdown
    type_distribution = [
        {"type": "Speeding", "count": 48, "percentage": 34},
        {"type": "Red Light", "count": 36, "percentage": 25},
        {"type": "No Helmet / Seatbelt", "count": 32, "percentage": 23},
        {"type": "Stop Line / Wrong Way", "count": 26, "percentage": 18},
    ]

    # High-Risk Zones with Prototype Risk Score (0-100)
    risk_hotspots = [
        {
            "id": 1,
            "junction": "Mahatma Gandhi Expressway Pier 42",
            "camera_id": "CAM-02",
            "risk_score": 86,
            "level": "Critical",
            "total_incidents": 42,
            "primary_hazard": "Overspeeding (85+ km/h) & Merge Clashes"
        },
        {
            "id": 2,
            "junction": "Ring Road North Junction",
            "camera_id": "CAM-01",
            "risk_score": 74,
            "level": "High",
            "total_incidents": 31,
            "primary_hazard": "Signal Overrunning & Pedestrian Conflict"
        },
        {
            "id": 3,
            "junction": "Hitec City Main Intersection",
            "camera_id": "CAM-03",
            "risk_score": 62,
            "level": "Medium",
            "total_incidents": 23,
            "primary_hazard": "Stop Line Incursion & Lane Blockage"
        },
        {
            "id": 4,
            "junction": "Old City Charminar Boulevard",
            "camera_id": "CAM-06",
            "risk_score": 58,
            "level": "Medium",
            "total_incidents": 19,
            "primary_hazard": "Wrong-Way Navigation & Two-Wheeler Density"
        }
    ]

    return {
        "hourly_volume": hourly_volume,
        "type_distribution": type_distribution,
        "risk_hotspots": risk_hotspots,
        "average_speed_kmh": 52.4,
        "peak_hour_window": "17:30 - 19:30"
    }

@router.get("/ai-summary")
def get_ai_traffic_summary(db: Session = Depends(get_db)):
    stats = {
        "total_vehicles": 2841,
        "total_violations": 142,
        "top_violation": "Speeding (34%)",
        "highest_risk_corridor": "MG Road Expressway (Risk 86/100)"
    }
    summary = gemini_service.summarize_traffic_report(stats)
    return {
        "summary": summary,
        "powered_by": "Gemini 3.8 Flash (or Rule-Engine Hybrid)"
    }
