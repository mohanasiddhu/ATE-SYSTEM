"""
Traffic Violation Detection & Lifecycle Management Engine
"""
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.database.models import Violation, Fine, Alert, AuditLog
from app.services.evidence_service import evidence_service
from app.core.logging_config import logger

class ViolationService:
    @staticmethod
    def evaluate_speeding(
        db: Session,
        plate_number: str,
        camera_id: str,
        location: str,
        detected_speed: float,
        speed_limit: int,
        confidence: float = 0.94
    ) -> Optional[Violation]:
        if detected_speed > speed_limit:
            vio_id = f"VIO-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}"
            evidence_path = evidence_service.generate_evidence_frame(
                plate_number=plate_number,
                violation_type="SPEEDING",
                camera_id=camera_id,
                location=location,
                speed_est=detected_speed,
                confidence=confidence
            )

            violation = Violation(
                violation_id=vio_id,
                plate_number=plate_number,
                violation_type="SPEEDING",
                camera_id=camera_id,
                location=location,
                confidence=confidence,
                detected_speed=detected_speed,
                speed_limit=speed_limit,
                signal_state="GREEN",
                evidence_image=evidence_path,
                status="PENDING_REVIEW",
                fine_amount=1000
            )
            db.add(violation)

            # Auto-generate high-severity alert
            alert = Alert(
                alert_id=f"ALT-{uuid.uuid4().hex[:4].upper()}",
                title=f"Overspeeding: {plate_number}",
                message=f"Clocked at {detected_speed:.1f} km/h (Limit: {speed_limit} km/h) at {location}.",
                severity="CRITICAL" if detected_speed > speed_limit + 25 else "HIGH",
                source=camera_id
            )
            db.add(alert)
            db.commit()
            db.refresh(violation)
            logger.info(f"Generated candidate violation {vio_id} for {plate_number}")
            return violation
        return None

    @staticmethod
    def review_violation(
        db: Session,
        violation_id: int,
        decision: str,
        reviewer_name: str,
        reason: Optional[str] = None
    ) -> Violation:
        violation = db.query(Violation).filter(Violation.id == violation_id).first()
        if not violation:
            raise ValueError("Violation not found")

        now = datetime.now(timezone.utc)
        violation.reviewed_by = reviewer_name
        violation.reviewed_at = now

        if decision.upper() == "APPROVE":
            violation.status = "CONFIRMED"
            # Auto-generate simulated Fine
            fine_id = f"FINE-{now.year}-{uuid.uuid4().hex[:6].upper()}"
            fine = Fine(
                fine_id=fine_id,
                violation_id=violation.id,
                plate_number=violation.plate_number,
                amount=violation.fine_amount,
                status="UNPAID",
                issued_at=now,
                due_date=now + timedelta(days=15),
                notice_text=f"Demo Fine for {violation.violation_type} at {violation.location}"
            )
            db.add(fine)

            # Audit record
            audit = AuditLog(
                username=reviewer_name,
                action="VIOLATION_APPROVED",
                description=f"Violation {violation.violation_id} approved for {violation.plate_number}. Fine {fine_id} issued.",
                timestamp=now
            )
            db.add(audit)
        else:
            violation.status = "REJECTED"
            violation.rejection_reason = reason or "Rejected after officer video inspection."
            audit = AuditLog(
                username=reviewer_name,
                action="VIOLATION_REJECTED",
                description=f"Violation {violation.violation_id} rejected. Reason: {violation.rejection_reason}",
                timestamp=now
            )
            db.add(audit)

        db.commit()
        db.refresh(violation)
        return violation

violation_service = ViolationService()
