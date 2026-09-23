"""
Reports Generation & CSV Export API
"""
import io
import csv
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import Violation, Fine, Vehicle

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/summary")
def get_reports_summary(db: Session = Depends(get_db)):
    total_violations = db.query(Violation).count()
    confirmed = db.query(Violation).filter(Violation.status.in_(["CONFIRMED", "FINE_GENERATED", "PAID"])).count()
    paid_fines = db.query(Fine).filter(Fine.status == "PAID").count()
    unpaid_fines = db.query(Fine).filter(Fine.status == "UNPAID").count()
    total_revenue = sum(f.amount for f in db.query(Fine).filter(Fine.status == "PAID").all())

    return {
        "report_id": f"REP-{datetime.now().strftime('%Y%m%d')}",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_violations": total_violations,
        "confirmed_infractions": confirmed,
        "paid_fines_count": paid_fines,
        "unpaid_fines_count": unpaid_fines,
        "total_revenue_collected_inr": total_revenue,
        "system_status": "OPERATIONAL"
    }

@router.get("/export/csv")
def export_violations_csv(db: Session = Depends(get_db)):
    violations = db.query(Violation).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Violation ID", "Plate Number", "Violation Type", "Camera ID",
        "Location", "Detected Speed (km/h)", "Speed Limit", "Confidence",
        "Status", "Reviewed By", "Timestamp"
    ])

    for v in violations:
        writer.writerow([
            v.violation_id, v.plate_number, v.violation_type, v.camera_id,
            v.location, v.detected_speed or "N/A", v.speed_limit or "N/A",
            f"{int(v.confidence*100)}%", v.status, v.reviewed_by or "Pending",
            v.timestamp.isoformat()
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=traffic_violations_{datetime.now().strftime('%Y%m%d')}.csv"}
    )
