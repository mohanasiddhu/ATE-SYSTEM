# System Architecture Documentation

## 1. System Overview
The **AI-Driven Smart Traffic Enforcement System** is an enterprise-grade intelligent transportation management architecture designed for automated vehicle perception, continuous trajectory tracking, license plate localization (ANPR/ALPR), legal traffic violation classification, cryptographic evidence generation, and automated e-challan issuance.

```
                           +------------------------+
                           |  Surveillance Cameras  |
                           |  (RTSP / Video Streams)|
                           +-----------+------------+
                                       |
                                       v
                     +------------------------------------+
                     |    12-STAGE DETECTION PIPELINE     |
                     |  1. Ingestion                      |
                     |  2. YOLOv8 Vehicle Detection       |
                     |  3. ByteTrack Trajectory Tracking  |
                     |  4. Plate Localization (YOLOv8)    |
                     |  5. Plate Crop (outputs/crops)     |
                     |  6. LPRNet/CRNN Character OCR      |
                     |  7. Spatial Association            |
                     |  8. Violation Classification       |
                     |  9. Confidence Filter (>=0.85)     |
                     | 10. Evidence (outputs/evidence)    |
                     | 11. Relational Database Record     |
                     | 12. Real-Time REST & WS Dispatch   |
                     +-----------------+------------------+
                                       |
                                       v
         +-----------------------------+-----------------------------+
         |                                                           |
         v                                                           v
+-------------------------------+                         +---------------------+
|      Express REST Backend     |                         | Relational Database |
|  - Auth & Role-Based Access   |                         |  - Users            |
|  - Camera Stream Controller   | <---------------------> |  - Vehicles         |
|  - Violation & Challan Engine |                         |  - Cameras          |
|  - Digital Evidence Vault     |                         |  - Violations       |
|  - Reports & Analytics API    |                         |  - Challans         |
+---------------+---------------+                         |  - Evidence Vault   |
                |                                         +---------------------+
                v
+-------------------------------+
|     React Command Center      |
|  - Live 30 FPS HUD Overlay    |
|  - Evidence Inspection Vault  |
|  - e-Challan Payment Gateway  |
|  - Spatial Junction GIS Map   |
|  - Real-Time Fleet Analytics  |
+-------------------------------+
```

## 2. Directory Architecture
```
AI-Traffic-Enforcement-System/
├── frontend/             # React SPA (components, pages, layouts, services, hooks, styles, api)
├── backend/              # REST server (routes, controllers, services, models, middleware, utilities)
├── ai_models/            # YOLOv8 checkpoints, LPRNet weights, model configs, registry
├── datasets/             # Annotated datasets (train/val/test images & labels, data.yaml)
├── database/             # DDL SQL schemas, migrations, seed runners, relational connectors
├── detection/            # 12-stage perception pipeline, ByteTrack tracking, plate cropping, ANPR
├── outputs/              # Generated evidence artifacts, plate crops, exported reports, processed videos
├── config/               # Environment variable templates, system parameters, traffic rules
├── tests/                # Automated validation suite (DB, tracking, detection, REST API)
├── docs/                 # Architecture, API, database, setup, model training, deployment guides
└── scripts/              # Executable runners for frontend, backend, training, db setup
```

## 3. Strict Layer Decoupling
- **Frontend Isolation**: No generated outputs or model weights are placed inside `frontend/`. The UI communicates with backend servers exclusively over REST HTTP and WebSocket streams.
- **Backend Isolation**: No frontend JSX or styling logic exists in `backend/`. The backend exposes stateless JSON endpoints with strict input validation.
- **Storage Isolation**: All generated artifacts reside strictly in `outputs/`:
  - `outputs/evidence/`: Court-admissible SVG/JPEG evidence files with SHA256 watermarks.
  - `outputs/crops/`: Extracted high-resolution license plate crops.
  - `outputs/reports/`: Exported daily and monthly compliance logs.
  - `outputs/videos/`: Processed video streams with bounding box annotations.
- **Tracking & Bounding Box Guarantees**:
  - Vehicles are tracked strictly when present.
  - ByteTrack assigns persistent IDs.
  - Bounding boxes are eliminated immediately upon camera frame exit (0 stale bounding boxes).
  - Sub-threshold classifications are rejected to eliminate false positives.
