"""
Violation Management & Human Review API Endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import Violation
from app.schemas.violation import ViolationResponse, ViolationReviewRequest, ViolationCreate
from app.services.violation_service import violation_service
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/violations", tags=["Violations"])

@router.get("", response_model=List[ViolationResponse])
def get_violations(
    status: Optional[str] = Query(None, description="Filter by status: PENDING_REVIEW, CONFIRMED, REJECTED, PAID"),
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Violation)
    if status:
        query = query.filter(Violation.status == status.upper())
    return query.order_by(Violation.id.desc()).limit(limit).all()

@router.get("/{id}", response_model=ViolationResponse)
def get_violation_detail(id: int, db: Session = Depends(get_db)):
    v = db.query(Violation).filter(Violation.id == id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Violation record not found")
    return v

@router.post("/{id}/review", response_model=ViolationResponse)
def review_violation(id: int, payload: ViolationReviewRequest, db: Session = Depends(get_db)):
    try:
        updated = violation_service.review_violation(
            db=db,
            violation_id=id,
            decision=payload.decision,
            reviewer_name=payload.reviewer_name,
            reason=payload.rejection_reason
        )
        return updated
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{id}/explain")
def get_ai_explanation(id: int, db: Session = Depends(get_db)):
    v = db.query(Violation).filter(Violation.id == id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Violation record not found")
    
    explanation = gemini_service.explain_violation({
        "violation_type": v.violation_type,
        "detected_speed": v.detected_speed,
        "speed_limit": v.speed_limit,
        "signal_state": v.signal_state,
        "plate_number": v.plate_number,
        "confidence": v.confidence
    })
    return {
        "violation_id": v.violation_id,
        "plate_number": v.plate_number,
        "explanation": explanation,
        "generated_by": "Gemini AI" if gemini_service.client else "Rule-Engine Logic Analyzer"
    }

@router.post("", response_model=ViolationResponse)
def create_violation(payload: ViolationCreate, db: Session = Depends(get_db)):
    import uuid
    from datetime import datetime, timezone
    vio = Violation(
        violation_id=f"VIO-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}",
        plate_number=payload.plate_number,
        violation_type=payload.violation_type,
        camera_id=payload.camera_id,
        location=payload.location,
        confidence=payload.confidence,
        detected_speed=payload.detected_speed,
        speed_limit=payload.speed_limit,
        signal_state=payload.signal_state or "NONE",
        evidence_image=payload.evidence_image,
        fine_amount=payload.fine_amount,
        status="PENDING_REVIEW"
    )
    db.add(vio)
    db.commit()
    db.refresh(vio)
    return vio
