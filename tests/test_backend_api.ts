/**
 * Backend API Endpoints Test Suite
 * Tests all REST endpoints exposed by backend/routes/index.ts
 */

import { createServer } from '../backend/server.js';
import http from 'http';

export async function runApiTests(): Promise<boolean> {
  console.log('\n--- [TEST SUITE]: Backend REST API Endpoints ---');
  const app = createServer();
  const server = http.createServer(app);

  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}/api`;

  try {
    // 1. Health Endpoint
    const resHealth = await fetch(`${baseUrl}/health`).then(r => r.json());
    if (resHealth.status !== 'HEALTHY') throw new Error('API Test Failed: /api/health');
    console.log('[PASS] GET /api/health -> OPERATIONAL');

    // 2. Auth Login
    const resLogin = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'officer_sharma' })
    }).then(r => r.json());
    if (!resLogin.token) throw new Error('API Test Failed: /api/auth/login');
    console.log(`[PASS] POST /api/auth/login -> Token issued for ${resLogin.user.username}`);

    const authHeaders = {
      'Authorization': `Bearer ${resLogin.token}`,
      'Content-Type': 'application/json'
    };

    // 3. Current User
    const resMe = await fetch(`${baseUrl}/auth/me`, { headers: authHeaders }).then(r => r.json());
    if (!resMe.user) throw new Error('API Test Failed: /api/auth/me');
    console.log(`[PASS] GET /api/auth/me -> Authenticated: ${resMe.user.full_name}`);

    // 4. Users
    const resUsers = await fetch(`${baseUrl}/users`, { headers: authHeaders }).then(r => r.json());
    if (!resUsers.data || resUsers.data.length === 0) throw new Error('API Test Failed: /api/users');
    console.log(`[PASS] GET /api/users -> Returned ${resUsers.data.length} registered officers`);

    // 5. Vehicles
    const resVehicles = await fetch(`${baseUrl}/vehicles`, { headers: authHeaders }).then(r => r.json());
    if (!resVehicles.data) throw new Error('API Test Failed: /api/vehicles');
    console.log(`[PASS] GET /api/vehicles -> Returned ${resVehicles.data.length} registered vehicles`);

    // 6. Cameras
    const resCameras = await fetch(`${baseUrl}/cameras`).then(r => r.json());
    if (!resCameras.data) throw new Error('API Test Failed: /api/cameras');
    console.log(`[PASS] GET /api/cameras -> ${resCameras.data.length} camera stations`);

    // 7. Live Detection
    const resLive = await fetch(`${baseUrl}/live-detection`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ cameraId: 'CAM-01', seed: 12 })
    }).then(r => r.json());
    if (!resLive.data?.frameId) throw new Error('API Test Failed: /api/live-detection');
    console.log(`[PASS] POST /api/live-detection -> Active frame ${resLive.data.frameId}`);

    // 8. Image Detection
    const resImg = await fetch(`${baseUrl}/image-detection`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ cameraId: 'CAM-02', width: 1920, height: 1080 })
    }).then(r => r.json());
    if (!resImg.data) throw new Error('API Test Failed: /api/image-detection');
    console.log(`[PASS] POST /api/image-detection -> Processed frame`);

    // 9. Video Detection
    const resVid = await fetch(`${baseUrl}/video-detection`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ cameraId: 'CAM-01' })
    }).then(r => r.json());
    if (!resVid.data) throw new Error('API Test Failed: /api/video-detection');
    console.log(`[PASS] POST /api/video-detection -> Processed video sequence`);

    // 10. ANPR Endpoint
    const resAnpr = await fetch(`${baseUrl}/anpr`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ plateHint: 'DL 01 AB 1234' })
    }).then(r => r.json());
    if (!resAnpr.data?.plate) throw new Error('API Test Failed: /api/anpr');
    console.log(`[PASS] POST /api/anpr -> Recognized plate: ${resAnpr.data.plate.normalizedText}`);

    // 11. Violations
    const resViol = await fetch(`${baseUrl}/violations`).then(r => r.json());
    if (!resViol.data) throw new Error('API Test Failed: /api/violations');
    console.log(`[PASS] GET /api/violations -> ${resViol.data.length} records`);

    // 12. Challans
    const resChl = await fetch(`${baseUrl}/challans`).then(r => r.json());
    if (!resChl.data) throw new Error('API Test Failed: /api/challans');
    console.log(`[PASS] GET /api/challans -> ${resChl.data.length} records`);

    // 13. Evidence
    const resEv = await fetch(`${baseUrl}/evidence`).then(r => r.json());
    if (!resEv.data) throw new Error('API Test Failed: /api/evidence');
    console.log(`[PASS] GET /api/evidence -> ${resEv.data.length} evidence artifacts`);

    // 14. Dashboard Statistics
    const resStats = await fetch(`${baseUrl}/dashboard/stats`).then(r => r.json());
    if (!resStats.data?.totalVehiclesDetected) throw new Error('API Test Failed: /api/dashboard/stats');
    console.log(`[PASS] GET /api/dashboard/stats -> Total detected: ${resStats.data.totalVehiclesDetected}`);

    // 15. Reports
    const resRep = await fetch(`${baseUrl}/reports`).then(r => r.json());
    if (!resRep.data?.reportData) throw new Error('API Test Failed: /api/reports');
    console.log(`[PASS] GET /api/reports -> Generated report ${resRep.data.reportData.reportId}`);

    return true;
  } finally {
    server.close();
  }
}

if (import.meta.url.endsWith(process.argv[1])) {
  runApiTests()
    .then(() => console.log('ALL API TESTS PASSED.'))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
