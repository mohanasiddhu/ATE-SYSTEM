"""
SQLAlchemy Database Models for Smart Traffic Enforcement System
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="OFFICER", nullable=False)  # ADMIN, OFFICER, VIEWER
    badge_id = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)

    # Relationships
    audit_logs = relationship("AuditLog", back_populates="user")

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String(30), unique=True, index=True, nullable=False)
    vehicle_type = Column(String(50), default="Car")  # Car, Bus, Truck, Motorcycle, Auto-Rickshaw
    owner_name = Column(String(100), nullable=False)
    vehicle_color = Column(String(30), default="White")
    registration_date = Column(String(30), nullable=True)
    status = Column(String(30), default="ACTIVE")  # ACTIVE, SUSPENDED, STOLEN
    insurance_status = Column(String(30), default="VALID")  # VALID, EXPIRED
    pollution_status = Column(String(30), default="VALID")  # VALID, EXPIRED
    created_at = Column(DateTime, default=utcnow)

    violations = relationship("Violation", back_populates="vehicle")

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    location = Column(String(200), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    rtsp_url = Column(String(255), nullable=True)
    status = Column(String(30), default="ONLINE")  # ONLINE, OFFLINE, MAINTENANCE
    speed_limit = Column(Integer, default=60)
    traffic_signal_state = Column(String(20), default="GREEN")  # RED, YELLOW, GREEN
    junction_name = Column(String(100), default="Central Junction")
    created_at = Column(DateTime, default=utcnow)

    violations = relationship("Violation", back_populates="camera")

class Violation(Base):
    __tablename__ = "violations"

    id = Column(Integer, primary_key=True, index=True)
    violation_id = Column(String(50), unique=True, index=True, nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    plate_number = Column(String(30), index=True, nullable=False)
    violation_type = Column(String(50), nullable=False)  # SPEEDING, RED_LIGHT, NO_HELMET, WRONG_WAY, STOP_LINE
    camera_id = Column(String(50), ForeignKey("cameras.camera_id"), nullable=False)
    location = Column(String(200), nullable=False)
    timestamp = Column(DateTime, default=utcnow, index=True)
    confidence = Column(Float, default=0.90)  # AI Confidence score
    detected_speed = Column(Float, nullable=True)
    speed_limit = Column(Integer, nullable=True)
    signal_state = Column(String(20), default="NONE")
    evidence_image = Column(String(255), nullable=True)
    evidence_video = Column(String(255), nullable=True)
    status = Column(String(30), default="PENDING_REVIEW")  # PENDING_REVIEW, CONFIRMED, REJECTED, FINE_GENERATED, PAID
    reviewed_by = Column(String(100), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    fine_amount = Column(Integer, default=1000)
    created_at = Column(DateTime, default=utcnow)

    # Relationships
    vehicle = relationship("Vehicle", back_populates="violations")
    camera = relationship("Camera", back_populates="violations")
    fine = relationship("Fine", back_populates="violation", uselist=False)

class Fine(Base):
    __tablename__ = "fines"

    id = Column(Integer, primary_key=True, index=True)
    fine_id = Column(String(50), unique=True, index=True, nullable=False)
    violation_id = Column(Integer, ForeignKey("violations.id"), nullable=False)
    plate_number = Column(String(30), index=True, nullable=False)
    amount = Column(Integer, nullable=False)
    status = Column(String(30), default="UNPAID")  # UNPAID, PAID, OVERDUE, CANCELLED
    issued_at = Column(DateTime, default=utcnow)
    due_date = Column(DateTime, nullable=False)
    payment_reference = Column(String(100), nullable=True)
    notice_text = Column(String(255), default="Demo Fine Notice - Non-binding academic prototype")

    # Relationships
    violation = relationship("Violation", back_populates="fine")
    payments = relationship("Payment", back_populates="fine")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(String(50), unique=True, index=True, nullable=False)
    fine_id = Column(Integer, ForeignKey("fines.id"), nullable=False)
    transaction_ref = Column(String(100), unique=True, nullable=False)
    amount = Column(Integer, nullable=False)
    payment_method = Column(String(50), default="DEMO_UPI")  # DEMO_UPI, DEMO_CARD, DEMO_NETBANKING
    status = Column(String(30), default="SUCCESS")
    paid_at = Column(DateTime, default=utcnow)
    receipt_number = Column(String(50), nullable=False)

    fine = relationship("Fine", back_populates="payments")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(20), default="INFO")  # INFO, WARNING, HIGH, CRITICAL
    source = Column(String(50), default="DETECTION_ENGINE")
    is_read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=utcnow)

class TrafficEvent(Base):
    __tablename__ = "traffic_events"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String(50), nullable=False)
    vehicle_class = Column(String(30), default="car")
    speed_est = Column(Float, default=45.0)
    confidence = Column(Float, default=0.92)
    timestamp = Column(DateTime, default=utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    username = Column(String(50), nullable=True)
    action = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    ip_address = Column(String(50), default="127.0.0.1")
    timestamp = Column(DateTime, default=utcnow)

    user = relationship("User", back_populates="audit_logs")

class SystemSetting(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(50), unique=True, index=True, nullable=False)
    value = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=utcnow)
