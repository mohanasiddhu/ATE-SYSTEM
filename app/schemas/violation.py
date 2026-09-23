"""
Vehicle, Violation, Payment & Analytics Schemas
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

# Vehicle Schemas
class VehicleBase(BaseModel):
    plate_number: str
    vehicle_type: str = "Car"
    owner_name: str
    vehicle_color: str = "White"
    registration_date: Optional[str] = None
    status: str = "ACTIVE"
    insurance_status: str = "VALID"
    pollution_status: str = "VALID"

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Violation Schemas
class ViolationBase(BaseModel):
    plate_number: str
    violation_type: str
    camera_id: str
    location: str
    confidence: float = 0.90
    detected_speed: Optional[float] = None
    speed_limit: Optional[int] = None
    signal_state: Optional[str] = "NONE"
    evidence_image: Optional[str] = None
    fine_amount: int = 1000

class ViolationCreate(ViolationBase):
    pass

class ViolationReviewRequest(BaseModel):
    decision: str  # APPROVE, REJECT
    reviewer_name: str
    rejection_reason: Optional[str] = None

class ViolationResponse(ViolationBase):
    id: int
    violation_id: str
    timestamp: datetime
    status: str
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Fine & Payment Schemas
class FineResponse(BaseModel):
    id: int
    fine_id: str
    violation_id: int
    plate_number: str
    amount: int
    status: str
    issued_at: datetime
    due_date: datetime
    payment_reference: Optional[str] = None
    notice_text: str

    class Config:
        from_attributes = True

class DemoPaymentRequest(BaseModel):
    fine_id: int
    payment_method: str = "DEMO_UPI"

class PaymentResponse(BaseModel):
    payment_id: str
    fine_id: int
    transaction_ref: str
    amount: int
    payment_method: str
    status: str
    paid_at: datetime
    receipt_number: str

# Camera Schemas
class CameraBase(BaseModel):
    camera_id: str
    name: str
    location: str
    latitude: float
    longitude: float
    rtsp_url: Optional[str] = None
    status: str = "ONLINE"
    speed_limit: int = 60
    traffic_signal_state: str = "GREEN"
    junction_name: str = "Central Crossing"

class CameraCreate(CameraBase):
    pass

class CameraResponse(CameraBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Dashboard Stats Schemas
class DashboardStats(BaseModel):
    total_vehicles_today: int
    total_violations_today: int
    confirmed_violations: int
    pending_reviews: int
    paid_fines: int
    unpaid_fines: int
    active_cameras: int
    total_cameras: int
    average_speed: float
    traffic_density: str
    high_risk_zones: int
