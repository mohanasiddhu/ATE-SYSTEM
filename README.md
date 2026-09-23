# AI-Driven Smart Traffic Enforcement System

An enterprise-grade, computer-vision powered traffic monitoring, Automated Number Plate Recognition (ANPR), and violation enforcement platform designed as a comprehensive academic final-year capstone project.

---

## 1. System Overview

The **AI-Driven Smart Traffic Enforcement System** automates the end-to-end statutory traffic monitoring workflow:
1. **Live Camera Ingestion**: Processes video feeds from roadside CCTV, IP/RTSP streams, or sample traffic recordings.
2. **YOLO Vehicle Detection**: Detects and classifies multi-class vehicles (`car`, `bus`, `truck`, `motorcycle`, `bicycle`) with spatial bounding boxes and confidence intervals.
3. **Vehicle Tracking & Speed Estimation**: Calculates continuous vehicle trajectories across frames to compute calibrated prototype speeds and detect overspeeding.
4. **Traffic Signal & Stop-Line Enforcement**: Detects virtual stop-line crossings during RED signal phases.
5. **Rider Safety (Helmet Detection)**: Classifies two-wheeler motorcycle operators for helmet compliance.
6. **Automatic Number Plate Recognition (ANPR)**: Crops license plate regions, executes noise reduction/contrast preprocessing, and performs character recognition via OCR.
7. **Human-in-the-Loop Review**: All AI detections start as `PENDING_REVIEW`. Authorized enforcement officers inspect cryptographic evidence cards before approving (`CONFIRMED`) or rejecting (`REJECTED`).
8. **Simulated E-Challan & Payment Gateway**: Generates digital demo fines and simulates citizen online payment workflows with verifiable transaction IDs and receipts.
9. **Interactive Geospatial Dashboard**: Displays real-time camera statuses, corridor traffic density, and High-Risk Zones with Leaflet maps.

---

## 2. Real-World Limitation & Academic Ethics Disclaimer

> **IMPORTANT**: This is an academic simulation prototype. It does **NOT** connect to actual government law enforcement databases (such as VAHAN/Sarathi/Parivahan) nor issue legally binding fines. All payment transactions (`TXN-DEMO-XXXX`) and penalty challans are strictly simulated demonstrations. The system strictly enforces human officer review before any candidate violation is marked confirmed.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend Framework** | Python 3.10+, FastAPI, Uvicorn (ASGI) |
| **Database & ORM** | SQLite 3, SQLAlchemy 2.0 ORM |
| **Data Validation** | Pydantic V2, Pydantic-Settings |
| **Authentication** | JWT (JSON Web Tokens), OAuth2 Password Bearer, bcrypt / salted SHA-256 |
| **Computer Vision** | OpenCV (cv2), Ultralytics YOLOv8, NumPy, Pillow (PIL) |
| **ANPR / OCR** | EasyOCR / regex normalization pipeline |
| **Frontend UI** | HTML5, Tailwind CSS, Vanilla JS / React SPA, Lucide Icons |
| **Data Visualization** | Chart.js, HTML5 Canvas radar & vehicle tracker |
| **Mapping Engine** | Leaflet.js, OpenStreetMap |
| **AI Insights (Optional)**| Google Gemini 3.8 Flash SDK for natural language summaries |

---

## 4. Architecture Diagram

```text
  Surveillance Camera / Video Feed / RTSP
                   ↓
      OpenCV Video Stream Ingestion
                   ↓
    YOLOv8 Multi-Class Object Detection
                   ↓
        Centroid / Trajectory Tracker
                   ↓
    Violation Inference Engine:
    ├─ Speed Threshold Comparator
    ├─ Virtual Stop-Line Collision
    ├─ Signal Phase Correlator (RED/GREEN)
    └─ Rider Helmet Classifier
                   ↓
    License Plate Region Cropper + Preprocessing
                   ↓
         EasyOCR / ANPR Engine
                   ↓
      Cryptographic Evidence Card Generator
                   ↓
     SQLite Database (Status: PENDING_REVIEW)
                   ↓
       Human Review by Traffic Officer
      ┌────────────┴────────────┐
      ▼                         ▼
   REJECTED                 CONFIRMED
                                ↓
                      Mock E-Challan Generated
                                ↓
                      Citizen Demo Payment Gateway
                                ↓
                      Real-time Analytics & Audit Trail
```

---

## 5. Folder Structure

```text
smart_traffic_enforcement/
├── app/
│   ├── main.py                  # FastAPI Application Entry Point
│   ├── core/
│   │   ├── config.py            # Pydantic Settings & Environment
│   │   ├── security.py          # Password Hashing & JWT Handlers
│   │   └── logging_config.py    # Structured Logging Engine
│   ├── database/
│   │   ├── database.py          # SQLAlchemy Session Factory
│   │   ├── models.py            # User, Vehicle, Camera, Violation, Fine Models
│   │   └── seed.py              # Baseline Demo Data Seeder
│   ├── schemas/
│   │   ├── auth.py              # Authentication Schemas
│   │   └── violation.py         # Request/Response DTOs
│   ├── api/
│   │   ├── auth.py              # Login & Session Routes
│   │   ├── dashboard.py         # KPI & Real-time Aggregation
│   │   ├── violations.py        # Violation Query & Human Review Endpoints
│   │   ├── vehicles.py          # ANPR Registry Search
│   │   ├── cameras.py           # Camera Inventory CRUD
│   │   ├── payments.py          # Simulated Fine Checkout & Receipts
│   │   ├── analytics.py         # Hourly Volume & Risk Hotspots
│   │   ├── reports.py           # CSV Export & Summaries
│   │   ├── detections.py        # Computer Vision Live Ingestion
│   │   └── health.py            # psutil Hardware & Memory Telemetry
│   ├── services/
│   │   ├── violation_service.py # Lifecycle & Review Logic
│   │   ├── evidence_service.py  # PIL Watermarked Evidence Frames
│   │   ├── payment_service.py   # Fake Payment Transaction Generator
│   │   └── gemini_service.py    # Natural Language AI Explanations
│   └── models/
│       ├── yolo_model.py        # Ultralytics Wrapper with Simulation Fallback
│       └── plate_model.py       # EasyOCR Wrapper with Synthetic ANPR
├── data/
│   ├── evidence/                # Generated timestamped evidence captures
│   └── traffic_enforcement.db   # Local SQLite Database
├── tests/
│   └── test_api.py              # Pytest End-to-End Suite
├── run.py                       # Root launcher script
├── requirements.txt             # Python dependencies
├── .env.example                 # Configuration template
└── README.md                    # Documentation
```

---

## 6. Installation & Execution Guide

### Step 1: Create and Activate Virtual Environment
```bash
# macOS / Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment
```bash
cp .env.example .env
```

### Step 4: Seed Initial Database
```bash
python -m app.database.seed
```

### Step 5: Start the Enforcement Server
```bash
python run.py
# Or directly via Uvicorn:
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive OpenAPI Swagger UI is available at:
👉 `http://localhost:8000/docs`

---

## 7. Demo Access Credentials

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Chief Admin** | `admin` | `admin123` | Full administrative control, cameras CRUD, audit logs, system parameters |
| **Traffic Officer** | `officer` | `operator123` | Live monitoring, review violations, approve/reject, generate fines |
| **Reviewer / Viewer** | `reviewer` | `reviewer123` | Read-only inspection of dashboard metrics, analytics, and reports |

---

## 8. Standards & Compliance References

- **ISO 39001**: Road Traffic Safety (RTS) management systems guidance.
- **ISO 22320**: Emergency management guidelines for incident prevention and response.
- **GDPR / DPDP Principles**: Role-based access control, cryptographic password hashing, data retention policies, and immutable audit logging.
