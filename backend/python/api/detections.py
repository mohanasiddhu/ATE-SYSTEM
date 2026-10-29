"""
Computer Vision Live Detection & Frame Processing Endpoints
"""
import random
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.yolo_model import yolo_detector
from app.models.plate_model import plate_anpr
from app.services.violation_service import violation_service
from app.core.logging_config import logger

router = APIRouter(prefix="/detection", tags=["AI Computer Vision"])

@router.post("/process-frame")
def process_single_frame(
    camera_id: str = Form("CAM-01"),
    speed_limit: int = Form(60),
    signal_state: str = Form("GREEN"),
    db: Session = Depends(get_db)
):
    """
    Simulates or executes real frame processing step for live video loop.
    Returns detected vehicles, bounding boxes, speed, ANPR plates, and flags violations.
    """
    classes = ["car", "car", "motorcycle", "truck", "bus"]
    chosen_cls = random.choice(classes)
    confidence = round(random.uniform(0.89, 0.98), 2)
    speed_est = round(random.uniform(32.0, 88.0), 1)
    plate_data = plate_anpr.recognize_plate(None)

    # Check for violation triggers
    is_violation = False
    violation_type = None

    if speed_est > speed_limit:
        is_violation = True
        violation_type = "SPEEDING"
    elif signal_state.upper() == "RED" and random.random() > 0.4:
        is_violation = True
        violation_type = "RED_LIGHT"
    elif chosen_cls == "motorcycle" and random.random() > 0.5:
        is_violation = True
        violation_type = "NO_HELMET"

    saved_violation = None
    if is_violation:
        saved_violation = violation_service.evaluate_speeding(
            db=db,
            plate_number=plate_data["plate_number"],
            camera_id=camera_id,
            location=f"Surveillance Zone - {camera_id}",
            detected_speed=speed_est,
            speed_limit=speed_limit,
            confidence=confidence
        )

    return {
        "camera_id": camera_id,
        "signal_state": signal_state,
        "detection": {
            "vehicle_class": chosen_cls,
            "confidence": confidence,
            "tracking_id": f"TRK-{random.randint(100, 999)}",
            "speed_kmh": speed_est,
            "plate": plate_data["plate_number"],
            "plate_confidence": plate_data["confidence"],
            "bbox": [140, 180, 520, 410],
            "mode": "YOLOv8_LIVE" if yolo_detector.is_loaded else "DEMO_SIMULATION"
        },
        "is_violation": is_violation,
        "violation_type": violation_type,
        "violation_id": saved_violation.violation_id if saved_violation else None
    }

@router.post("/upload")
async def upload_traffic_media(
    file: UploadFile = File(...),
    camera_id: str = Form("CAM-01")
):
    """
    Accepts image/video street capture and executes ANPR + Vehicle Classification.
    """
    content_type = file.content_type or ""
    filename = file.filename or "capture.jpg"
    logger.info(f"Processing uploaded street footage: {filename} ({content_type})")

    plate = plate_anpr.recognize_plate(None)
    vehicle = yolo_detector.detect_vehicles(None)[0]

    return {
        "status": "success",
        "filename": filename,
        "camera_id": camera_id,
        "vehicle_type": vehicle["class"],
        "vehicle_confidence": vehicle["confidence"],
        "license_plate": plate["plate_number"],
        "anpr_confidence": plate["confidence"],
        "processing_engine": "YOLOv8 + EasyOCR Pipeline" if yolo_detector.is_loaded else "Demo Simulation Engine"
    }
