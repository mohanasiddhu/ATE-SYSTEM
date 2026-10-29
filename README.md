# AI-Driven Smart Traffic Enforcement System

An enterprise-grade, production-ready AI perception, tracking, ANPR (Automatic Number Plate Recognition), violation detection, and automated e-challan issuance platform.

---

## 🏛️ Top-Level Project Architecture

```
AI-Traffic-Enforcement-System/
├── frontend/             # All React UI code (components, pages, layouts, services, hooks, api)
├── backend/              # All server-side code (routes, controllers, services, models, middleware)
├── ai_models/            # YOLOv8 weights, model configs, OCR checkpoints, model registry
├── datasets/             # Training datasets (raw, processed, train, val, test, data.yaml)
├── database/             # Relational schema DDL, SQL migrations, seeds, connection layer
├── detection/            # 12-stage perception pipeline (ByteTrack, Plate Localization, ANPR, Evidence)
├── outputs/              # Generated evidence images, plate crops, exported reports, videos
├── config/               # Environment variable examples, system parameters, traffic rules
├── tests/                # Automated validation test suite (database, tracking, detection, API)
├── docs/                 # Architecture, API, database, setup, training, and deployment docs
└── scripts/              # Automation scripts for frontend, backend, fullstack, training, DB
```

---

## ⚡ 12-Stage Detection & Enforcement Pipeline

```
Input Image / Video / Live Camera
       ↓
Stage 1: Input Frame Acquisition
       ↓
Stage 2: YOLOv8 Multi-Class Vehicle Detection
       ↓
Stage 3: ByteTrack Trajectory Tracking (No stale bounding boxes; immediate out-of-frame eviction)
       ↓
Stage 4: YOLOv8 License Plate Localization
       ↓
Stage 5: License Plate Extraction & Crop (saved in outputs/crops/)
       ↓
Stage 6: LPRNet / CRNN Alphanumeric OCR & Indian HSRP regex verification
       ↓
Stage 7: Vehicle & Plate Spatial Association (IoU & Containment)
       ↓
Stage 8: Violation Classification (Speeding, Red Light, Helmet, Stop Line)
       ↓
Stage 9: Confidence Validation (>= 0.85 threshold to prevent false positives)
       ↓
Stage 10: Court-Admissible Evidence Generation (SHA-256 digital watermark in outputs/evidence/)
       ↓
Stage 11: Relational Database Record (Violations, Challans, Evidence, Telemetry)
       ↓
Stage 12: Backend REST & Stream Dispatch → Real-Time Frontend Command Center
```

---

## 🚀 Quickstart Commands

### 1. Run Full-Stack System (Port 3000)
```bash
npm run dev
# OR: bash scripts/run_fullstack.sh
```
Starts Express REST backend with Vite React UI on `http://localhost:3000`.

### 2. Run Automated Verification Tests
```bash
npx tsx tests/run_all_tests.ts
```
Executes complete automated validation across Database, ByteTrack, Detection Pipeline, Evidence Vault, and all REST endpoints.

### 3. Run Frontend Only
```bash
bash scripts/run_frontend.sh
```

### 4. Run Backend Only
```bash
bash scripts/run_backend.sh
```

### 5. Train YOLOv8 Model
```bash
bash scripts/train_yolo.sh
```

### 6. Run AI Sample Inference
```bash
python3 scripts/infer_sample.py
```

### 7. Initialize / Seed Database
```bash
bash scripts/setup_db.sh
```

---

## 📋 Comprehensive Documentation
- [System Architecture](docs/architecture.md)
- [REST API Reference](docs/api_documentation.md)
- [Database Schema & ER Model](docs/database_schema.md)
- [Setup Instructions](docs/setup_instructions.md)
- [Model Training & Dataset Preparation](docs/model_training.md)
- [Testing Instructions](docs/testing_instructions.md)
- [Production Deployment Guide](docs/deployment_instructions.md)
