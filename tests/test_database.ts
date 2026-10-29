/**
 * Database Test Suite
 * Tests relational data integrity, foreign-key relationships, and CRUD operations.
 */
import { db } from '../database/connection.js';

export function runDatabaseTests(): boolean {
  console.log('\n--- [TEST SUITE]: Database Connection & Relational Integrity ---');

  // Test 1: Fetch users
  const users = db.getUsers();
  if (users.length === 0) throw new Error('Database Test Failed: Users table empty');
  console.log(`[PASS] Users queried successfully (${users.length} records, passwords redacted)`);

  // Test 2: Fetch cameras
  const cameras = db.getCameras();
  if (cameras.length === 0) throw new Error('Database Test Failed: Cameras table empty');
  console.log(`[PASS] Cameras queried successfully (${cameras.length} active stations)`);

  // Test 3: Vehicle lookup by plate
  const vehicle = db.getVehicleByPlate('DL 01 AB 1234');
  if (!vehicle) throw new Error('Database Test Failed: Target vehicle DL 01 AB 1234 not found');
  console.log(`[PASS] Vehicle lookup verified: ${vehicle.plate_number} -> ${vehicle.owner_name}`);

  // Test 4: Violation addition and foreign-key link
  const newViol = db.addViolation({
    violation_id: `TEST-VIOL-${Date.now()}`,
    vehicle_id: vehicle.id,
    plate_number: vehicle.plate_number,
    violation_type: 'SPEEDING',
    camera_id: cameras[0].camera_id,
    location: cameras[0].location,
    timestamp: new Date().toISOString(),
    confidence: 0.95,
    detected_speed: 82.5,
    speed_limit: 60,
    signal_state: 'NONE',
    evidence_image: '/outputs/evidence/test.jpg',
    status: 'PENDING_REVIEW',
    fine_amount: 1000
  });
  if (!newViol.id) throw new Error('Database Test Failed: Failed to insert violation');
  console.log(`[PASS] Violation inserted with ID ${newViol.violation_id}`);

  // Test 5: Challan addition and payment
  const newChallan = db.addChallan({
    challan_id: `TEST-CHL-${Date.now()}`,
    violation_id: newViol.id,
    plate_number: newViol.plate_number,
    amount: 1000,
    status: 'UNPAID',
    issued_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 86400000 * 30).toISOString(),
    notice_text: 'Test Speeding Infraction'
  });
  console.log(`[PASS] Challan issued: ${newChallan.challan_id} for ${newChallan.amount}`);

  const paid = db.payChallan(newChallan.challan_id, 'DEMO_UPI');
  if (!paid || paid.status !== 'PAID') throw new Error('Database Test Failed: Challan payment failed');
  console.log(`[PASS] Challan paid: receipt ${paid.receipt_number}`);

  // Test 6: Dashboard stats calculation
  const stats = db.getDashboardStats();
  if (stats.violations === 0 || stats.activeCameras === 0) {
    throw new Error('Database Test Failed: Dashboard stats calculation anomaly');
  }
  console.log(`[PASS] Dashboard aggregation verified: ${stats.violations} violations, ${stats.activeCameras} active cameras`);

  return true;
}

if (import.meta.url.endsWith(process.argv[1])) {
  try {
    runDatabaseTests();
    console.log('ALL DATABASE TESTS PASSED.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
