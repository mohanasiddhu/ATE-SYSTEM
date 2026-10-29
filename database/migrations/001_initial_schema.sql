-- Migration: 001_initial_schema.sql
-- Description: Core schema creation for users, vehicles, cameras, violations, and challans

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'OFFICER',
    badge_id VARCHAR(50),
    department VARCHAR(100) DEFAULT 'Traffic Management Division',
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plate_number VARCHAR(30) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL DEFAULT 'Car',
    make VARCHAR(50),
    model VARCHAR(50),
    vehicle_color VARCHAR(30) DEFAULT 'White',
    owner_name VARCHAR(100) NOT NULL,
    owner_phone VARCHAR(20),
    owner_email VARCHAR(100),
    registration_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    insurance_status VARCHAR(30) NOT NULL DEFAULT 'VALID',
    pollution_status VARCHAR(30) NOT NULL DEFAULT 'VALID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cameras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    camera_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    rtsp_url VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'ONLINE',
    speed_limit INTEGER NOT NULL DEFAULT 60,
    traffic_signal_state VARCHAR(20) NOT NULL DEFAULT 'GREEN',
    junction_name VARCHAR(100) DEFAULT 'Central Junction',
    fps REAL DEFAULT 30.0,
    resolution VARCHAR(30) DEFAULT '1920x1080',
    model_version VARCHAR(50) DEFAULT 'YOLOv8x-Traffic-2.4',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS violations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    violation_id VARCHAR(50) UNIQUE NOT NULL,
    vehicle_id INTEGER,
    plate_number VARCHAR(30) NOT NULL,
    violation_type VARCHAR(50) NOT NULL,
    camera_id VARCHAR(50) NOT NULL,
    location VARCHAR(200) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confidence REAL NOT NULL DEFAULT 0.90,
    detected_speed REAL,
    speed_limit INTEGER,
    signal_state VARCHAR(20) DEFAULT 'NONE',
    evidence_image VARCHAR(255),
    evidence_video VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_REVIEW',
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP,
    rejection_reason TEXT,
    fine_amount INTEGER NOT NULL DEFAULT 1000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
    FOREIGN KEY (camera_id) REFERENCES cameras(camera_id) ON DELETE CASCADE
);
