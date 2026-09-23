"""
Camera Management API Endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import Camera, AuditLog
from app.schemas.violation import CameraResponse, CameraCreate

router = APIRouter(prefix="/cameras", tags=["Cameras"])

@router.get("", response_model=List[CameraResponse])
def get_cameras(db: Session = Depends(get_db)):
    return db.query(Camera).all()

@router.post("", response_model=CameraResponse)
def add_camera(payload: CameraCreate, db: Session = Depends(get_db)):
    existing = db.query(Camera).filter(Camera.camera_id == payload.camera_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Camera ID already registered")
    
    camera = Camera(**payload.model_dump())
    db.add(camera)
    db.commit()
    db.refresh(camera)
    return camera

@router.put("/{camera_id}", response_model=CameraResponse)
def update_camera(camera_id: str, payload: CameraCreate, db: Session = Depends(get_db)):
    camera = db.query(Camera).filter(Camera.camera_id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    for key, value in payload.model_dump().items():
        setattr(camera, key, value)
    
    db.commit()
    db.refresh(camera)
    return camera

@router.delete("/{camera_id}")
def delete_camera(camera_id: str, db: Session = Depends(get_db)):
    camera = db.query(Camera).filter(Camera.camera_id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    db.delete(camera)
    db.commit()
    return {"status": "success", "message": f"Camera {camera_id} removed"}
