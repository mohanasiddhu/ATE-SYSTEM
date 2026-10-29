"""
Fines & Payment Gateway API Endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import Fine, Payment
from app.schemas.violation import FineResponse, DemoPaymentRequest, PaymentResponse
from app.services.payment_service import payment_service

router = APIRouter(prefix="/payments", tags=["Payments & Fines"])

@router.get("/fines", response_model=List[FineResponse])
def get_fines(db: Session = Depends(get_db)):
    return db.query(Fine).order_by(Fine.id.desc()).all()

@router.post("/checkout/demo", response_model=PaymentResponse)
def execute_demo_payment(payload: DemoPaymentRequest, db: Session = Depends(get_db)):
    try:
        payment = payment_service.process_demo_payment(
            db=db,
            fine_id=payload.fine_id,
            method=payload.payment_method
        )
        return PaymentResponse(
            payment_id=payment.payment_id,
            fine_id=payment.fine_id,
            transaction_ref=payment.transaction_ref,
            amount=payment.amount,
            payment_method=payment.payment_method,
            status=payment.status,
            paid_at=payment.paid_at,
            receipt_number=payment.receipt_number
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
