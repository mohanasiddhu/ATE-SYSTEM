# Testing Instructions

The AI Traffic Enforcement System includes an automated end-to-end testing suite validating every tier:
1. Relational Database & Foreign Keys
2. ByteTrack Multi-Object Tracking & Stale Bounding Box Purging
3. 12-Stage AI Perception & Enforcement Pipeline
4. Court-Admissible Digital Evidence Generation & SHA-256 Hashing
5. Backend REST API Endpoints

---

## 1. Run All Tests
Execute the master automated test runner:
```bash
npx tsx tests/run_all_tests.ts
```

Expected Output:
```
===============================================================
 AI Traffic Enforcement System - Automated Validation Suite
===============================================================
--- [TEST SUITE]: Database Connection & Relational Integrity ---
[PASS] Users queried successfully
[PASS] Cameras queried successfully
[PASS] Vehicle lookup verified
[PASS] Violation inserted with ID TEST-VIOL-...
[PASS] Challan issued & paid

--- [TEST SUITE]: ByteTrack Tracking & Box Eviction ---
[PASS] Vehicle track initialized with consistent ID #100
[PASS] Track ID persistent across consecutive frames (#100)
[PASS] Stale bounding box purged immediately when vehicle left frame (0 stale boxes)
[PASS] Sub-threshold fake detections rejected properly

--- [TEST SUITE]: 12-Stage Detection & Enforcement Pipeline ---
[PASS] Live Frame Processed
[PASS] Plate Crops Generated in outputs/crops/
[PASS] Violation Detected: SPEEDING
[PASS] Court-Admissible Evidence Created with SHA-256
[PASS] Linked e-Challan Issued

--- [TEST SUITE]: Backend REST API Endpoints ---
[PASS] GET /api/health -> OPERATIONAL
[PASS] POST /api/auth/login -> Token issued
[PASS] GET /api/auth/me
[PASS] GET /api/users
[PASS] GET /api/vehicles
[PASS] GET /api/cameras
[PASS] POST /api/live-detection
[PASS] POST /api/image-detection
[PASS] POST /api/video-detection
[PASS] POST /api/anpr
[PASS] GET /api/violations
[PASS] GET /api/challans
[PASS] GET /api/evidence
[PASS] GET /api/dashboard/stats
[PASS] GET /api/reports

===============================================================
 ✅ ALL TESTS PASSED SUCCESSFULLY
===============================================================
```

---

## 2. Individual Component Tests
- **Database Test**: `npx tsx tests/test_database.ts`
- **Tracking Test**: `npx tsx tests/test_tracking.ts`
- **Detection Pipeline Test**: `npx tsx tests/test_detection_pipeline.ts`
- **REST API Test**: `npx tsx tests/test_backend_api.ts`
- **Python Inference Test**: `python3 scripts/infer_sample.py`
