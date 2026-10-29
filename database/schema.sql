-- AI-Driven Smart Traffic Enforcement System
-- Production Database Schema DDL
-- Compatible with SQLite, PostgreSQL, and MySQL

PRAGMA foreign_keys = ON;

-- 1. USERS & OPERATORS
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'OFFICER' CHECK (role IN ('ADMIN', 'SUPER_ADMIN', 'OFFICER', 'VIEWER', 'AUDITOR')),
    badge_id VARCHAR(50),
    department VARCHAR(100) DEFAULT 'Traffic Management Division',
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. VEHICLE REGISTRY
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plate_number VARCHAR(30) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL DEFAULT 'Car' CHECK (vehicle_type IN ('Car', 'Motorcycle', 'Bus', 'Truck', 'Auto-Rickshaw', 'EV')),
    make VARCHAR(50),
    model VARCHAR(50),
    vehicle_color VARCHAR(30) DEFAULT 'White',
    owner_name VARCHAR(100) NOT NULL,
    owner_phone VARCHAR(20),
    owner_email VARCHAR(100),
    registration_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'STOLEN', 'IMPOUNDED')),
    insurance_status VARCHAR(30) NOT NULL DEFAULT 'VALID' CHECK (insurance_status IN ('VALID', 'EXPIRED', 'PENDING')),
    pollution_status VARCHAR(30) NOT NULL DEFAULT 'VALID' CHECK (pollution_status IN ('VALID', 'EXPIRED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CAMERAS & SMART SENSORS
CREATE TABLE IF NOT EXISTS cameras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    camera_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    rtsp_url VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'ONLINE' CHECK (status IN ('ONLINE', 'OFFLINE', 'MAINTENANCE', 'STREAM_ERROR')),
    speed_limit INTEGER NOT NULL DEFAULT 60,
    traffic_signal_state VARCHAR(20) NOT NULL DEFAULT 'GREEN' CHECK (traffic_signal_state IN ('RED', 'YELLOW', 'GREEN', 'FLASHING')),
    junction_name VARCHAR(100) DEFAULT 'Central Junction',
    fps REAL DEFAULT 30.0,
    resolution VARCHAR(30) DEFAULT '1920x1080',
    model_version VARCHAR(50) DEFAULT 'YOLOv8x-Traffic-2.4',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. VIOLATIONS
CREATE TABLE IF NOT EXISTS violations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    violation_id VARCHAR(50) UNIQUE NOT NULL,
    vehicle_id INTEGER,
    plate_number VARCHAR(30) NOT NULL,
    violation_type VARCHAR(50) NOT NULL CHECK (violation_type IN ('SPEEDING', 'RED_LIGHT', 'NO_HELMET', 'WRONG_WAY', 'STOP_LINE', 'TRIPLE_RIDING', 'BUS_LANE_INTRUSION')),
    camera_id VARCHAR(50) NOT NULL,
    location VARCHAR(200) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confidence REAL NOT NULL DEFAULT 0.90,
    detected_speed REAL,
    speed_limit INTEGER,
    signal_state VARCHAR(20) DEFAULT 'NONE',
    evidence_image VARCHAR(255),
    evidence_video VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'CONFIRMED', 'REJECTED', 'FINE_GENERATED', 'PAID', 'DISPUTED')),
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP,
    rejection_reason TEXT,
    fine_amount INTEGER NOT NULL DEFAULT 1000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
    FOREIGN KEY (camera_id) REFERENCES cameras(camera_id) ON DELETE CASCADE
);

-- 5. CHALLANS (E-FINES)
CREATE TABLE IF NOT EXISTS challans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challan_id VARCHAR(50) UNIQUE NOT NULL,
    violation_id INTEGER NOT NULL,
    plate_number VARCHAR(30) NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'UNPAID' CHECK (status IN ('UNPAID', 'PAID', 'OVERDUE', 'CANCELLED', 'CONTESTED')),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    payment_reference VARCHAR(100),
    payment_method VARCHAR(50),
    paid_at TIMESTAMP,
    receipt_number VARCHAR(50),
    notice_text TEXT DEFAULT 'Official e-Challan issued under the Motor Vehicles Act.',
    FOREIGN KEY (violation_id) REFERENCES violations(id) ON DELETE CASCADE
);

-- 6. DETECTION EVENTS (REAL-TIME TELEMETRY)
CREATE TABLE IF NOT EXISTS detection_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id VARCHAR(50) UNIQUE NOT NULL,
    camera_id VARCHAR(50) NOT NULL,
    vehicle_class VARCHAR(30) NOT NULL DEFAULT 'car',
    track_id INTEGER NOT NULL,
    speed_est REAL DEFAULT 45.0,
    confidence REAL NOT NULL DEFAULT 0.92,
    bbox_x1 REAL NOT NULL,
    bbox_y1 REAL NOT NULL,
    bbox_x2 REAL NOT NULL,
    bbox_y2 REAL NOT NULL,
    plate_detected VARCHAR(30),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (camera_id) REFERENCES cameras(camera_id) ON DELETE CASCADE
);

-- 7. EVIDENCE DIGITAL VAULT
CREATE TABLE IF NOT EXISTS evidence (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evidence_id VARCHAR(50) UNIQUE NOT NULL,
    violation_id INTEGER NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(30) NOT NULL CHECK (file_type IN ('IMAGE', 'VIDEO', 'PLATE_CROP', 'METADATA_JSON')),
    file_size_bytes INTEGER,
    sha256_hash VARCHAR(64) NOT NULL,
    crop_coordinates VARCHAR(100),
    watermark_applied BOOLEAN DEFAULT 1,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata_json TEXT,
    FOREIGN KEY (violation_id) REFERENCES violations(id) ON DELETE CASCADE
);

-- 8. SYSTEM AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    username VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- INDEXES FOR HIGH-THROUGHPUT ANPR QUERYING
CREATE INDEX IF NOT EXISTS idx_violations_plate ON violations(plate_number);
CREATE INDEX IF NOT EXISTS idx_violations_timestamp ON violations(timestamp);
CREATE INDEX IF NOT EXISTS idx_violations_status ON violations(status);
CREATE INDEX IF NOT EXISTS idx_challans_plate ON challans(plate_number);
CREATE INDEX IF NOT EXISTS idx_challans_status ON challans(status);
CREATE INDEX IF NOT EXISTS idx_detection_events_camera ON detection_events(camera_id);
CREATE INDEX IF NOT EXISTS idx_detection_events_track ON detection_events(track_id);
CREATE INDEX IF NOT EXISTS idx_evidence_violation ON evidence(violation_id);
