"""
Simulated Payment Gateway Service
Provides mock checkout, payment verification, and receipt generation.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.database.models import Fine, Payment, Violation, AuditLog
from app.core.logging_config import logger

class PaymentService:
    @staticmethod
    def process_demo_payment(db: Session, fine_id: int, method: str = "DEMO_UPI") -> Payment:
        fine = db.query(Fine).filter(Fine.id == fine_id).first()
        if not fine:
            raise ValueError("Fine record not found")
        if fine.status == "PAID":
            raise ValueError("Fine has already been settled.")

        now = datetime.now(timezone.utc)
        txn_ref = f"TXN-DEMO-{uuid.uuid4().hex[:8].upper()}"
        receipt_no = f"RCP-{now.year}-{uuid.uuid4().hex[:6].upper()}"

        payment = Payment(
            payment_id=f"PAY-{uuid.uuid4().hex[:6].upper()}",
            fine_id=fine.id,
            transaction_ref=txn_ref,
            amount=fine.amount,
            payment_method=method,
            status="SUCCESS",
            paid_at=now,
            receipt_number=receipt_no
        )
        db.add(payment)

        # Update Fine and Violation status
        fine.status = "PAID"
        fine.payment_reference = txn_ref
        
        if fine.violation:
            fine.violation.status = "PAID"

        # Log audit trail
        audit = AuditLog(
            username="DEMO_PAYMENT_GATEWAY",
            action="FINE_PAID",
            description=f"Fine {fine.fine_id} of ₹{fine.amount} settled for {fine.plate_number}. Ref: {txn_ref}",
            timestamp=now
        )
        db.add(audit)

        db.commit()
        db.refresh(payment)
        logger.info(f"Settled fine {fine.fine_id} via {method}. Txn: {txn_ref}")
        return payment

payment_service = PaymentService()
