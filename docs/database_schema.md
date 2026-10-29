# Database Schema & Relational Model Documentation

The database is built on relational principles with strict foreign keys, indexing, and cascade rules. Schema definitions reside in `database/schema.sql` and `database/migrations/`.

## Entity Relationship Overview
```
+---------------+        1:N         +---------------+
|     USERS     | -----------------> |  AUDIT_LOGS   |
+---------------+                    +---------------+

+---------------+        1:N         +---------------+
|   VEHICLES    | -----------------> |  VIOLATIONS   |
+---------------+                    +-------+-------+
                                             | 1:1
+---------------+        1:N                 v
|    CAMERAS    | -----------------> +---------------+
+---------------+                    |   CHALLANS    |
        | 1:N                        +---------------+
        v                                    | 1:1
+-------------------+                        v
| DETECTION_EVENTS  |                +---------------+
+-------------------+                |   EVIDENCE    |
                                     +---------------+
```

## Table Specifications

### 1. `users`
- `id` (INTEGER, PK, Auto-increment)
- `username` (VARCHAR(50), Unique, Not Null)
- `email` (VARCHAR(100), Unique, Not Null)
- `full_name` (VARCHAR(100), Not Null)
- `hashed_password` (VARCHAR(255), Not Null)
- `role` (VARCHAR(20), Enum: ADMIN, SUPER_ADMIN, OFFICER, VIEWER, AUDITOR)
- `badge_id` (VARCHAR(50))
- `department` (VARCHAR(100))
- `is_active` (BOOLEAN, Default 1)
- `created_at` (TIMESTAMP)

### 2. `vehicles`
- `id` (INTEGER, PK)
- `plate_number` (VARCHAR(30), Unique, Indexed)
- `vehicle_type` (VARCHAR(50), Enum: Car, Motorcycle, Bus, Truck, Auto-Rickshaw, EV)
- `make` (VARCHAR(50)), `model` (VARCHAR(50)), `vehicle_color` (VARCHAR(30))
- `owner_name` (VARCHAR(100), Not Null), `owner_phone`, `owner_email`
- `status` (VARCHAR(30), Enum: ACTIVE, SUSPENDED, STOLEN, IMPOUNDED)
- `insurance_status`, `pollution_status`

### 3. `cameras`
- `id` (INTEGER, PK)
- `camera_id` (VARCHAR(50), Unique, Indexed)
- `name` (VARCHAR(100)), `location` (VARCHAR(200)), `latitude` (REAL), `longitude` (REAL)
- `rtsp_url` (VARCHAR(255))
- `status` (VARCHAR(30), Enum: ONLINE, OFFLINE, MAINTENANCE, STREAM_ERROR)
- `speed_limit` (INTEGER, Default 60)
- `traffic_signal_state` (VARCHAR(20), Enum: RED, YELLOW, GREEN, FLASHING)
- `fps` (REAL), `resolution` (VARCHAR(30))

### 4. `violations`
- `id` (INTEGER, PK)
- `violation_id` (VARCHAR(50), Unique, Indexed)
- `vehicle_id` (INTEGER, FK -> vehicles.id)
- `camera_id` (VARCHAR(50), FK -> cameras.camera_id)
- `plate_number` (VARCHAR(30), Indexed)
- `violation_type` (Enum: SPEEDING, RED_LIGHT, NO_HELMET, WRONG_WAY, STOP_LINE, TRIPLE_RIDING)
- `location`, `timestamp` (Indexed), `confidence`, `detected_speed`, `speed_limit`
- `evidence_image`, `status` (Enum: PENDING_REVIEW, CONFIRMED, REJECTED, FINE_GENERATED, PAID)
- `fine_amount` (INTEGER)

### 5. `challans`
- `id` (INTEGER, PK)
- `challan_id` (VARCHAR(50), Unique, Indexed)
- `violation_id` (INTEGER, FK -> violations.id, Cascade Delete)
- `plate_number` (VARCHAR(30), Indexed)
- `amount` (INTEGER)
- `status` (Enum: UNPAID, PAID, OVERDUE, CANCELLED, CONTESTED)
- `issued_at`, `due_date`, `payment_reference`, `paid_at`, `receipt_number`

### 6. `detection_events`
- `id` (INTEGER, PK)
- `event_id` (VARCHAR(50), Unique)
- `camera_id` (VARCHAR(50), FK -> cameras.camera_id)
- `vehicle_class`, `track_id` (INTEGER), `speed_est` (REAL), `confidence` (REAL)
- `bbox_x1`, `bbox_y1`, `bbox_x2`, `bbox_y2`, `plate_detected`, `timestamp`

### 7. `evidence`
- `id` (INTEGER, PK)
- `evidence_id` (VARCHAR(50), Unique)
- `violation_id` (INTEGER, FK -> violations.id, Cascade Delete)
- `file_path` (VARCHAR(255), Not Null)
- `file_type` (Enum: IMAGE, VIDEO, PLATE_CROP, METADATA_JSON)
- `sha256_hash` (VARCHAR(64), Cryptographic integrity hash)
- `crop_coordinates`, `watermark_applied`, `timestamp`, `metadata_json`
