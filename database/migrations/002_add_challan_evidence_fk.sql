-- Migration: 002_add_challan_evidence_fk.sql
-- Description: Adds challans, detection_events, and evidence tables with strict foreign keys

CREATE TABLE IF NOT EXISTS challans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challan_id VARCHAR(50) UNIQUE NOT NULL,
    violation_id INTEGER NOT NULL,
    plate_number VARCHAR(30) NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'UNPAID',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    payment_reference VARCHAR(100),
    payment_method VARCHAR(50),
    paid_at TIMESTAMP,
    receipt_number VARCHAR(50),
    notice_text TEXT DEFAULT 'Official e-Challan issued under the Motor Vehicles Act.',
    FOREIGN KEY (violation_id) REFERENCES violations(id) ON DELETE CASCADE
);

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

CREATE TABLE IF NOT EXISTS evidence (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evidence_id VARCHAR(50) UNIQUE NOT NULL,
    violation_id INTEGER NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(30) NOT NULL,
    file_size_bytes INTEGER,
    sha256_hash VARCHAR(64) NOT NULL,
    crop_coordinates VARCHAR(100),
    watermark_applied BOOLEAN DEFAULT 1,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata_json TEXT,
    FOREIGN KEY (violation_id) REFERENCES violations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_violations_plate ON violations(plate_number);
CREATE INDEX IF NOT EXISTS idx_challans_plate ON challans(plate_number);
CREATE INDEX IF NOT EXISTS idx_detection_events_camera ON detection_events(camera_id);
CREATE INDEX IF NOT EXISTS idx_evidence_violation ON evidence(violation_id);
