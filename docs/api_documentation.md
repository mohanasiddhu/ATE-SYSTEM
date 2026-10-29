# REST API Documentation

Base URL: `http://localhost:3000/api`

## Authentication & Authorization
All authenticated routes require a Bearer token:
`Authorization: Bearer <JWT_TOKEN>`

---

### 1. Authentication
#### `POST /api/auth/login`
- **Request Body**:
  ```json
  { "username": "officer_sharma", "password": "optional_secure_password" }
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": 1,
      "username": "officer_sharma",
      "full_name": "Insp. Rajesh Sharma",
      "role": "OFFICER",
      "badge_id": "DL-TP-4091"
    }
  }
  ```

#### `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200)**: Current user profile.

---

### 2. Detection & Perception Pipeline
#### `POST /api/live-detection`
Runs the 12-stage perception pipeline on active camera streams.
- **Request Body**:
  ```json
  { "cameraId": "CAM-01", "seed": 42 }
  ```
- **Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "frameId": "FRM-1790388675-65",
      "cameraId": "CAM-01",
      "trackedVehicles": [
        {
          "id": 101,
          "bbox": { "x": 210, "y": 340, "width": 320, "height": 240 },
          "class_name": "car",
          "speed_kmh": 78.4,
          "license_plate": "DL 01 AB 1234"
        }
      ],
      "newViolationsDetected": [...],
      "cropsGenerated": [...],
      "auditTrail": [...]
    }
  }
  ```

#### `POST /api/image-detection`
Processes static image upload or frame snapshots.

#### `POST /api/video-detection`
Processes pre-recorded video sequences.

#### `POST /api/anpr`
Direct OCR recognition endpoint.
- **Request Body**: `{ "plateHint": "DL 01 AB 1234" }`

---

### 3. Violations
#### `GET /api/violations`
Retrieves all recorded violations with vehicle and camera relationships.
#### `GET /api/violations/:id`
Retrieves single violation details.
#### `PATCH /api/violations/:id/status`
Updates status (`CONFIRMED`, `REJECTED`, `FINE_GENERATED`, `PAID`).
- **Request Body**: `{ "status": "CONFIRMED", "reviewer": "Insp. Rajesh Sharma" }`

---

### 4. Challans (e-Fines)
#### `GET /api/challans`
Retrieves all e-challans.
#### `GET /api/challans/:id`
Retrieves single challan details.
#### `POST /api/challans/:id/pay`
Processes simulated legal penalty settlement.
- **Request Body**: `{ "paymentMethod": "DEMO_UPI" }`

---

### 5. Cameras & Junctions
#### `GET /api/cameras`
Lists all surveillance camera nodes and current statuses.
#### `PATCH /api/cameras/:id/status`
Updates camera state (`ONLINE`, `OFFLINE`, `MAINTENANCE`).

---

### 6. Evidence Vault
#### `GET /api/evidence`
Lists all court-admissible digital evidence records with SHA256 hashes.

---

### 7. Dashboard & Analytics
#### `GET /api/dashboard/stats`
Aggregated overview metrics:
- Total vehicles detected
- Active cameras
- Detected license plates
- Total violations & challans
- Unpaid fines & total collection revenue
- Accuracy rate & system status

---

### 8. Compliance Reports
#### `GET /api/reports` / `POST /api/reports/generate`
Generates daily enforcement audit report stored in `outputs/reports/`.
