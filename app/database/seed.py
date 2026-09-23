"""
Database Seeding Script for Demo Data
"""
from datetime import datetime, timedelta, timezone
from app.database.database import Base, engine, SessionLocal
from app.database.models import User, Vehicle, Camera, Violation, Fine, Payment, Alert, TrafficEvent, AuditLog, SystemSetting
from app.core.security import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).count() > 0:
        print("Database already contains data. Skipping initial seeding.")
        db.close()
        return

    print("Seeding Smart Traffic Enforcement demo data...")
    now = datetime.now(timezone.utc)

    # 1. Users
    users = [
        User(
            username="admin",
            email="admin@example.com",
            full_name="Chief Admin Sharma",
            hashed_password=get_password_hash("admin123"),
            role="ADMIN",
            badge_id="ADM-8801"
        ),
        User(
            username="officer",
            email="officer@example.com",
            full_name="Inspector Rajesh Kumar",
            hashed_password=get_password_hash("operator123"),
            role="OFFICER",
            badge_id="ENF-4412"
        ),
        User(
            username="reviewer",
            email="viewer@example.com",
            full_name="Officer Priya Verma",
            hashed_password=get_password_hash("reviewer123"),
            role="VIEWER",
            badge_id="REV-1092"
        )
    ]
    db.add_all(users)
    db.commit()

    # 2. Cameras
    cameras = [
        Camera(
            camera_id="CAM-01",
            name="Ring Road North Junction",
            location="Ring Road Sector 14, High Traffic Corridor",
            latitude=17.4482,
            longitude=78.3742,
            rtsp_url="rtsp://demo-cam-01/stream1",
            status="ONLINE",
            speed_limit=60,
            traffic_signal_state="GREEN",
            junction_name="North Terminal Crossing"
        ),
        Camera(
            camera_id="CAM-02",
            name="MG Road Flyover Exit",
            location="Mahatma Gandhi Expressway Pier 42",
            latitude=17.4399,
            longitude=78.3908,
            rtsp_url="rtsp://demo-cam-02/stream1",
            status="ONLINE",
            speed_limit=50,
            traffic_signal_state="RED",
            junction_name="MG Expressway Ramp"
        ),
        Camera(
            camera_id="CAM-03",
            name="Cyber Towers Signal",
            location="Hitec City Main Intersection",
            latitude=17.4504,
            longitude=78.3809,
            rtsp_url="rtsp://demo-cam-03/stream1",
            status="ONLINE",
            speed_limit=45,
            traffic_signal_state="YELLOW",
            junction_name="Cyber Hub Roundabout"
        ),
        Camera(
            camera_id="CAM-04",
            name="Central Bus Terminal Approach",
            location="Station Avenue East Gate",
            latitude=17.4285,
            longitude=78.4112,
            rtsp_url="rtsp://demo-cam-04/stream1",
            status="ONLINE",
            speed_limit=40,
            traffic_signal_state="GREEN",
            junction_name="Central Bus Terminal"
        ),
        Camera(
            camera_id="CAM-05",
            name="Airport Expressway Toll Gate",
            location="Highway 44 KM Marker 18",
            latitude=17.4011,
            longitude=78.4421,
            rtsp_url="rtsp://demo-cam-05/stream1",
            status="MAINTENANCE",
            speed_limit=80,
            traffic_signal_state="NONE",
            junction_name="Toll Plaza Corridor"
        ),
        Camera(
            camera_id="CAM-06",
            name="Old City Heritage Archway",
            location="Charminar North Boulevard",
            latitude=17.3616,
            longitude=78.4747,
            rtsp_url="rtsp://demo-cam-06/stream1",
            status="ONLINE",
            speed_limit=30,
            traffic_signal_state="RED",
            junction_name="Old City Heritage Ring"
        )
    ]
    db.add_all(cameras)
    db.commit()

    # 3. Vehicles
    vehicles = [
        Vehicle(plate_number="MH-12-DE-4021", vehicle_type="Car", owner_name="Ramesh Chawla", vehicle_color="Silver Gray", registration_date="2023-04-12", status="ACTIVE", insurance_status="VALID", pollution_status="VALID"),
        Vehicle(plate_number="DL-01-AX-9920", vehicle_type="Car", owner_name="Sunita Malhotra", vehicle_color="Midnight Blue", registration_date="2022-08-19", status="ACTIVE", insurance_status="VALID", pollution_status="EXPIRED"),
        Vehicle(plate_number="KA-03-MN-5112", vehicle_type="Motorcycle", owner_name="Vikram Singh", vehicle_color="Matte Black", registration_date="2024-01-05", status="ACTIVE", insurance_status="VALID", pollution_status="VALID"),
        Vehicle(plate_number="AP-09-BC-1234", vehicle_type="Car", owner_name="Aravind Reddy", vehicle_color="Pearl White", registration_date="2021-11-20", status="ACTIVE", insurance_status="VALID", pollution_status="VALID"),
        Vehicle(plate_number="TS-07-JK-8819", vehicle_type="Truck", owner_name="Sri Balaji Freight Logistics", vehicle_color="Yellow Brown", registration_date="2020-03-15", status="ACTIVE", insurance_status="VALID", pollution_status="VALID"),
        Vehicle(plate_number="MH-04-AB-6721", vehicle_type="Bus", owner_name="Deccan Intercity Travels", vehicle_color="Red & White", registration_date="2022-02-10", status="ACTIVE", insurance_status="EXPIRED", pollution_status="VALID"),
        Vehicle(plate_number="KA-01-HG-3344", vehicle_type="Motorcycle", owner_name="Karthik Narayan", vehicle_color="Crimson Red", registration_date="2023-09-28", status="ACTIVE", insurance_status="VALID", pollution_status="VALID"),
        Vehicle(plate_number="DL-05-CD-1100", vehicle_type="Car", owner_name="Meera Kapoor", vehicle_color="Bronze Metallic", registration_date="2024-05-14", status="ACTIVE", insurance_status="VALID", pollution_status="VALID"),
        Vehicle(plate_number="AP-11-EQ-5599", vehicle_type="Auto-Rickshaw", owner_name="Mohammad Ghouse", vehicle_color="Yellow Green", registration_date="2019-07-11", status="ACTIVE", insurance_status="VALID", pollution_status="EXPIRED"),
        Vehicle(plate_number="HR-26-BR-9090", vehicle_type="Car", owner_name="Deepak Joshi", vehicle_color="Charcoal Black", registration_date="2023-12-01", status="ACTIVE", insurance_status="VALID", pollution_status="VALID")
    ]
    db.add_all(vehicles)
    db.commit()

    # 4. Violations
    v1 = Violation(
        violation_id="VIO-2026-001",
        vehicle_id=1,
        plate_number="MH-12-DE-4021",
        violation_type="SPEEDING",
        camera_id="CAM-02",
        location="Mahatma Gandhi Expressway Pier 42",
        timestamp=now - timedelta(minutes=15),
        confidence=0.96,
        detected_speed=84.5,
        speed_limit=50,
        signal_state="GREEN",
        evidence_image="/static/images/evidence_mh12.jpg",
        status="PENDING_REVIEW",
        fine_amount=1000
    )
    v2 = Violation(
        violation_id="VIO-2026-002",
        vehicle_id=2,
        plate_number="DL-01-AX-9920",
        violation_type="RED_LIGHT",
        camera_id="CAM-01",
        location="Ring Road North Junction",
        timestamp=now - timedelta(minutes=42),
        confidence=0.94,
        detected_speed=48.0,
        speed_limit=60,
        signal_state="RED",
        evidence_image="/static/images/evidence_dl01.jpg",
        status="CONFIRMED",
        reviewed_by="Inspector Rajesh Kumar",
        reviewed_at=now - timedelta(minutes=20),
        fine_amount=1000
    )
    v3 = Violation(
        violation_id="VIO-2026-003",
        vehicle_id=3,
        plate_number="KA-03-MN-5112",
        violation_type="NO_HELMET",
        camera_id="CAM-04",
        location="Station Avenue East Gate",
        timestamp=now - timedelta(hours=1, minutes=10),
        confidence=0.91,
        detected_speed=38.0,
        speed_limit=40,
        signal_state="GREEN",
        evidence_image="/static/images/evidence_ka03.jpg",
        status="PENDING_REVIEW",
        fine_amount=500
    )
    v4 = Violation(
        violation_id="VIO-2026-004",
        vehicle_id=4,
        plate_number="AP-09-BC-1234",
        violation_type="STOP_LINE",
        camera_id="CAM-03",
        location="Hitec City Main Intersection",
        timestamp=now - timedelta(hours=2, minutes=5),
        confidence=0.89,
        detected_speed=18.0,
        speed_limit=45,
        signal_state="RED",
        evidence_image="/static/images/evidence_ap09.jpg",
        status="FINE_GENERATED",
        reviewed_by="Inspector Rajesh Kumar",
        reviewed_at=now - timedelta(hours=1, minutes=30),
        fine_amount=500
    )
    v5 = Violation(
        violation_id="VIO-2026-005",
        vehicle_id=5,
        plate_number="TS-07-JK-8819",
        violation_type="WRONG_WAY",
        camera_id="CAM-06",
        location="Charminar North Boulevard",
        timestamp=now - timedelta(hours=3, minutes=20),
        confidence=0.93,
        detected_speed=34.0,
        speed_limit=30,
        signal_state="RED",
        evidence_image="/static/images/evidence_ts07.jpg",
        status="PAID",
        reviewed_by="Chief Admin Sharma",
        reviewed_at=now - timedelta(hours=2, minutes=45),
        fine_amount=1500
    )
    db.add_all([v1, v2, v3, v4, v5])
    db.commit()

    # 5. Fines & Payments
    f1 = Fine(
        fine_id="FINE-2026-8801",
        violation_id=v2.id,
        plate_number="DL-01-AX-9920",
        amount=1000,
        status="UNPAID",
        issued_at=now - timedelta(minutes=18),
        due_date=now + timedelta(days=15),
        payment_reference=None,
        notice_text="Demo Fine - Red Light Crossing at Ring Road Junction"
    )
    f2 = Fine(
        fine_id="FINE-2026-8802",
        violation_id=v4.id,
        plate_number="AP-09-BC-1234",
        amount=500,
        status="UNPAID",
        issued_at=now - timedelta(hours=1, minutes=25),
        due_date=now + timedelta(days=14),
        payment_reference=None,
        notice_text="Demo Fine - Stop Line Violation at Cyber Hub"
    )
    f3 = Fine(
        fine_id="FINE-2026-8803",
        violation_id=v5.id,
        plate_number="TS-07-JK-8819",
        amount=1500,
        status="PAID",
        issued_at=now - timedelta(hours=2, minutes=40),
        due_date=now + timedelta(days=12),
        payment_reference="TXN-DEMO-8F39A2",
        notice_text="Demo Fine - One-Way Entry Violation"
    )
    db.add_all([f1, f2, f3])
    db.commit()

    # Payment for f3
    pay1 = Payment(
        payment_id="PAY-9901",
        fine_id=f3.id,
        transaction_ref="TXN-DEMO-8F39A2",
        amount=1500,
        payment_method="DEMO_UPI",
        status="SUCCESS",
        paid_at=now - timedelta(hours=2),
        receipt_number="RCP-2026-00449"
    )
    db.add(pay1)

    # 6. Alerts
    alerts = [
        Alert(alert_id="ALT-101", title="Severe Overspeeding Flagged", message="Vehicle MH-12-DE-4021 clocked at 84.5 km/h in 50 km/h corridor on MG Road Flyover.", severity="CRITICAL", source="CAM-02", timestamp=now - timedelta(minutes=15)),
        Alert(alert_id="ALT-102", title="Red Light Infraction Recorded", message="Vehicle DL-01-AX-9920 crossed stop line during active red signal phase.", severity="HIGH", source="CAM-01", timestamp=now - timedelta(minutes=42)),
        Alert(alert_id="ALT-103", title="Rider Safety Warning", message="Two-wheeler KA-03-MN-5112 detected with no helmet present on rider.", severity="WARNING", source="CAM-04", timestamp=now - timedelta(hours=1, minutes=10)),
        Alert(alert_id="ALT-104", title="Scheduled Maintenance Notice", message="Camera CAM-05 Toll Gate sensor offline for routine calibration check.", severity="INFO", source="SYSTEM_MONITOR", timestamp=now - timedelta(hours=4))
    ]
    db.add_all(alerts)

    # 7. System Settings
    settings_data = [
        SystemSetting(key="DEFAULT_SPEED_LIMIT", value="60", description="Default corridor speed limit in km/h"),
        SystemSetting(key="FINE_SPEEDING", value="1000", description="Simulated fine for overspeeding (INR)"),
        SystemSetting(key="FINE_RED_LIGHT", value="1000", description="Simulated fine for red light jump (INR)"),
        SystemSetting(key="FINE_NO_HELMET", value="500", description="Simulated fine for rider without helmet (INR)"),
        SystemSetting(key="FINE_WRONG_WAY", value="1500", description="Simulated fine for wrong-way driving (INR)"),
        SystemSetting(key="FINE_STOP_LINE", value="500", description="Simulated fine for stop line violation (INR)"),
        SystemSetting(key="CONFIDENCE_THRESHOLD", value="0.75", description="Minimum AI confidence for violation candidate"),
        SystemSetting(key="DATA_RETENTION_DAYS", value="60", description="Evidence data retention period in days"),
        SystemSetting(key="DEMO_MODE", value="true", description="Academic simulation demo mode flag")
    ]
    db.add_all(settings_data)

    # 8. Audit Logs
    audit = AuditLog(
        username="admin",
        action="SYSTEM_INIT",
        description="Smart Traffic Enforcement System initialized with seed baseline data.",
        ip_address="127.0.0.1",
        timestamp=now
    )
    db.add(audit)

    db.commit()
    db.close()
    print("Seeding complete! Admin, Officer, and Reviewer accounts initialized.")

if __name__ == "__main__":
    seed_database()
