"""
Vehicle & Registry Search API
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import Vehicle, Violation
from app.schemas.violation import VehicleResponse

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

@router.get("", response_model=List[VehicleResponse])
def get_vehicles(query: Optional[str] = None, limit: int = 50, db: Session = Depends(get_db)):
    q = db.query(Vehicle)
    if query:
        clean_q = query.replace("-", "").replace(" ", "").upper()
        # Search by plate number or owner
        q = q.filter(
            (Vehicle.plate_number.like(f"%{query}%")) | 
            (Vehicle.owner_name.ilike(f"%{query}%"))
        )
    return q.limit(limit).all()

@router.get("/{plate}")
def get_vehicle_dossier(plate: str, db: Session = Depends(get_db)):
    veh = db.query(Vehicle).filter(Vehicle.plate_number == plate).first()
    if not veh:
        # Generate dynamic demo record if not found
        return {
            "vehicle": {
                "plate_number": plate,
                "vehicle_type": "Sedan Car",
                "owner_name": "Demo Vehicle Owner",
                "vehicle_color": "Gloss Black",
                "registration_date": "2023-01-15",
                "status": "ACTIVE",
                "insurance_status": "VALID",
                "pollution_status": "VALID"
            },
            "violations_history": [],
            "total_fines": 0,
            "unpaid_fines": 0
        }

    violations = db.query(Violation).filter(Violation.plate_number == plate).all()
    total_fines = sum(v.fine_amount for v in violations if v.status in ["CONFIRMED", "FINE_GENERATED", "PAID"])
    unpaid = sum(v.fine_amount for v in violations if v.status in ["CONFIRMED", "FINE_GENERATED"])

    return {
        "vehicle": veh,
        "violations_history": violations,
        "total_fines": total_fines,
        "unpaid_fines": unpaid
    }
