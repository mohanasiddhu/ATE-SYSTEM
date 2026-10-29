-- Database Seed Data for AI Traffic Enforcement System
-- Prepopulates realistic users, vehicles, cameras, violations, challans, detection_events, and evidence

-- USERS
INSERT OR IGNORE INTO users (id, username, email, full_name, hashed_password, role, badge_id, department) VALUES
(1, 'officer_sharma', 'rajesh.sharma@traffic.gov.in', 'Insp. Rajesh Sharma', '$2b$12$K8y4rTq7r8s7tQ8w.demo.hash', 'OFFICER', 'DL-TP-4091', 'Traffic Enforcement Unit A'),
(2, 'admin_verma', 'sunita.verma@traffic.gov.in', 'Dr. Sunita Verma', '$2b$12$K8y4rTq7r8s7tQ8w.demo.hash', 'ADMIN', 'DL-HQ-0012', 'Command & Control Operations'),
(3, 'analyst_mehta', 'amit.mehta@traffic.gov.in', 'Amit Mehta', '$2b$12$K8y4rTq7r8s7tQ8w.demo.hash', 'VIEWER', 'DL-AN-8921', 'Traffic Analytics Bureau');

-- CAMERAS
INSERT OR IGNORE INTO cameras (id, camera_id, name, location, latitude, longitude, rtsp_url, status, speed_limit, traffic_signal_state, junction_name) VALUES
(1, 'CAM-01', 'Connaught Place Outer Circle North', 'Connaught Place Outer Circle North Gate, New Delhi', 28.6315, 77.2167, 'rtsp://stream.traffic.gov.in/live/cam01', 'ONLINE', 50, 'GREEN', 'Connaught Place North'),
(2, 'CAM-02', 'AIIMS Flyover Northbound High-Speed Zone', 'AIIMS Flyover Express Lane, Ring Road, New Delhi', 28.5672, 77.2100, 'rtsp://stream.traffic.gov.in/live/cam02', 'ONLINE', 60, 'GREEN', 'Ring Road AIIMS Section'),
(3, 'CAM-03', 'ITO Junction Eastbound Intersection', 'ITO Crossing, Vikas Marg Intercept, New Delhi', 28.6289, 77.2410, 'rtsp://stream.traffic.gov.in/live/cam03', 'ONLINE', 40, 'RED', 'ITO Central Junction'),
(4, 'CAM-04', 'DND Flyway Toll Plaza Sector 15A', 'Delhi-Noida Direct Flyway, Entry Gantry #4', 28.5830, 77.3005, 'rtsp://stream.traffic.gov.in/live/cam04', 'ONLINE', 70, 'GREEN', 'DND Toll Gantry'),
(5, 'CAM-05', 'Karol Bagh Market Crossing', 'Arya Samaj Road Junction, Karol Bagh', 28.6517, 77.1906, 'rtsp://stream.traffic.gov.in/live/cam05', 'OFFLINE', 30, 'YELLOW', 'Karol Bagh Market Intercept');

-- VEHICLES
INSERT OR IGNORE INTO vehicles (id, plate_number, vehicle_type, make, model, vehicle_color, owner_name, owner_phone, owner_email, registration_date, status, insurance_status, pollution_status) VALUES
(1, 'DL 01 AB 1234', 'Car', 'Hyundai', 'Creta SX', 'Polar White', 'Aarav Malhotra', '+91 98112 34567', 'aarav.m@example.com', '2022-04-15', 'ACTIVE', 'VALID', 'VALID'),
(2, 'MH 12 CD 5678', 'Car', 'Tata', 'Nexon EV', 'Daytona Grey', 'Priya Deshmukh', '+91 98223 45678', 'priya.d@example.com', '2023-01-20', 'ACTIVE', 'VALID', 'VALID'),
(3, 'KA 05 MC 4589', 'Motorcycle', 'Royal Enfield', 'Classic 350', 'Stealth Black', 'Karthik Raman', '+91 98450 12345', 'karthik.r@example.com', '2021-08-10', 'ACTIVE', 'EXPIRED', 'VALID'),
(4, 'HR 26 DQ 5555', 'Car', 'BMW', '330i M Sport', 'Portimao Blue', 'Vikramaditya Rao', '+91 99100 99999', 'vikram.rao@example.com', '2023-11-05', 'ACTIVE', 'VALID', 'VALID'),
(5, 'UP 16 Z 9999', 'Car', 'Toyota', 'Fortuner 4x4', 'Super White', 'Raghvendra Yadav', '+91 98188 77777', 'raghav.y@example.com', '2020-03-12', 'ACTIVE', 'VALID', 'EXPIRED'),
(6, 'TN 07 BE 3456', 'Bus', 'Ashok Leyland', 'Viking City Bus', 'Green-White', 'Metropolitan Transport Corp', '+91 44 2345 6789', 'fleet@mtc.gov.in', '2019-06-22', 'ACTIVE', 'VALID', 'VALID');

-- VIOLATIONS
INSERT OR IGNORE INTO violations (id, violation_id, vehicle_id, plate_number, violation_type, camera_id, location, timestamp, confidence, detected_speed, speed_limit, signal_state, evidence_image, status, reviewed_by, fine_amount) VALUES
(1, 'VIOL-2026-0081', 1, 'DL 01 AB 1234', 'SPEEDING', 'CAM-02', 'AIIMS Flyover Northbound High-Speed Zone', '2026-09-25 14:22:10', 0.96, 78.4, 60, 'NONE', '/outputs/evidence/evidence_VIOL-2026-0081.jpg', 'PENDING_REVIEW', NULL, 1000),
(2, 'VIOL-2026-0082', 3, 'KA 05 MC 4589', 'NO_HELMET', 'CAM-01', 'Connaught Place Outer Circle North', '2026-09-25 14:35:45', 0.94, 38.0, 50, 'NONE', '/outputs/evidence/evidence_VIOL-2026-0082.jpg', 'CONFIRMED', 'Insp. Rajesh Sharma', 1000),
(3, 'VIOL-2026-0083', 2, 'MH 12 CD 5678', 'RED_LIGHT', 'CAM-03', 'ITO Junction Eastbound Intersection', '2026-09-25 15:10:02', 0.98, 42.5, 40, 'RED', '/outputs/evidence/evidence_VIOL-2026-0083.jpg', 'CONFIRMED', 'Insp. Rajesh Sharma', 1500),
(4, 'VIOL-2026-0084', 4, 'HR 26 DQ 5555', 'SPEEDING', 'CAM-04', 'DND Flyway Toll Plaza Sector 15A', '2026-09-25 15:45:20', 0.97, 94.2, 70, 'NONE', '/outputs/evidence/evidence_VIOL-2026-0084.jpg', 'FINE_GENERATED', 'Insp. Rajesh Sharma', 2000),
(5, 'VIOL-2026-0085', 5, 'UP 16 Z 9999', 'STOP_LINE', 'CAM-03', 'ITO Junction Eastbound Intersection', '2026-09-25 16:02:15', 0.91, 15.0, 40, 'RED', '/outputs/evidence/evidence_VIOL-2026-0085.jpg', 'PAID', 'Dr. Sunita Verma', 500);

-- CHALLANS
INSERT OR IGNORE INTO challans (id, challan_id, violation_id, plate_number, amount, status, issued_at, due_date, payment_reference, payment_method, paid_at, receipt_number, notice_text) VALUES
(1, 'CHALLAN-2026-0041', 2, 'KA 05 MC 4589', 1000, 'UNPAID', '2026-09-25 14:40:00', '2026-10-25 23:59:59', NULL, NULL, NULL, NULL, 'Violation of Section 129 Motor Vehicles Act: Riding two-wheeler without protective headgear.'),
(2, 'CHALLAN-2026-0042', 3, 'MH 12 CD 5678', 1500, 'UNPAID', '2026-09-25 15:15:00', '2026-10-25 23:59:59', NULL, NULL, NULL, NULL, 'Violation of Section 184 Motor Vehicles Act: Disobeying mandatory red traffic signal.'),
(3, 'CHALLAN-2026-0043', 4, 'HR 26 DQ 5555', 2000, 'UNPAID', '2026-09-25 15:50:00', '2026-10-25 23:59:59', NULL, NULL, NULL, NULL, 'Violation of Section 183(2) Motor Vehicles Act: Driving vehicle in excess of designated speed limit (94.2 km/h in 70 km/h zone).'),
(4, 'CHALLAN-2026-0044', 5, 'UP 16 Z 9999', 500, 'PAID', '2026-09-25 16:05:00', '2026-10-25 23:59:59', 'UPI/20260925/892104812', 'DEMO_UPI', '2026-09-25 16:20:10', 'REC-2026-89210', 'Violation of Stop Line regulations at signalized intersection.');

-- DETECTION EVENTS
INSERT OR IGNORE INTO detection_events (id, event_id, camera_id, vehicle_class, track_id, speed_est, confidence, bbox_x1, bbox_y1, bbox_x2, bbox_y2, plate_detected, timestamp) VALUES
(1, 'EVT-00101', 'CAM-02', 'car', 101, 78.4, 0.96, 210.0, 340.0, 480.0, 560.0, 'DL 01 AB 1234', '2026-09-25 14:22:10'),
(2, 'EVT-00102', 'CAM-01', 'motorcycle', 102, 38.0, 0.94, 520.0, 280.0, 640.0, 450.0, 'KA 05 MC 4589', '2026-09-25 14:35:45'),
(3, 'EVT-00103', 'CAM-03', 'car', 103, 42.5, 0.98, 180.0, 410.0, 420.0, 620.0, 'MH 12 CD 5678', '2026-09-25 15:10:02'),
(4, 'EVT-00104', 'CAM-04', 'car', 104, 94.2, 0.97, 330.0, 290.0, 600.0, 510.0, 'HR 26 DQ 5555', '2026-09-25 15:45:20');

-- EVIDENCE
INSERT OR IGNORE INTO evidence (id, evidence_id, violation_id, file_path, file_type, file_size_bytes, sha256_hash, crop_coordinates, watermark_applied, metadata_json) VALUES
(1, 'EVD-2026-0081', 1, '/outputs/evidence/evidence_VIOL-2026-0081.jpg', 'IMAGE', 245100, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '210,340,480,560', 1, '{"camera_id":"CAM-02","speed_kmh":78.4,"limit_kmh":60,"plate":"DL 01 AB 1234"}'),
(2, 'EVD-2026-0082', 2, '/outputs/evidence/evidence_VIOL-2026-0082.jpg', 'IMAGE', 198450, 'f7fbba6e0636f890e56fbbf3283e524c6fa3204ae298382d624748f837c48380', '520,280,640,450', 1, '{"camera_id":"CAM-01","violation":"NO_HELMET","plate":"KA 05 MC 4589"}'),
(3, 'EVD-2026-0083', 3, '/outputs/evidence/evidence_VIOL-2026-0083.jpg', 'IMAGE', 265890, '8274a441e8da22cf640eb24beafbc1c4d92209772f9be7b71f98bc19d36371cb', '180,410,420,620', 1, '{"camera_id":"CAM-03","violation":"RED_LIGHT","signal_duration_sec":4.2,"plate":"MH 12 CD 5678"}'),
(4, 'EVD-2026-0084', 4, '/outputs/evidence/evidence_VIOL-2026-0084.jpg', 'IMAGE', 312780, '12c61527b703dae2993820466bee8fdb3a1d4e42fa502f7469e5dca5c8dc620f', '330,290,600,510', 1, '{"camera_id":"CAM-04","speed_kmh":94.2,"limit_kmh":70,"plate":"HR 26 DQ 5555"}');
