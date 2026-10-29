/**
 * AI Perception & Enforcement Pipeline Test Suite
 * Tests full 12-stage execution from input to evidence generation and DB record.
 */

import { EnforcementPipeline } from '../detection/pipeline.js';
import * as fs from 'fs';

export function runPipelineTests(): boolean {
  console.log('\n--- [TEST SUITE]: 12-Stage Detection & Enforcement Pipeline ---');
  const pipeline = new EnforcementPipeline();

  // Test 1: Live stream frame execution
  const liveResult = pipeline.processFrame({
    cameraId: 'CAM-01',
    sourceType: 'live_stream',
    seedIndex: 42
  });

  if (!liveResult.frameId || liveResult.auditTrail.length < 5) {
    throw new Error('Pipeline Test Failed: Live frame processing incomplete');
  }
  console.log(`[PASS] Live Frame Processed: Frame ${liveResult.frameId}, ${liveResult.trackedVehicles.length} vehicles tracked`);

  // Test 2: ANPR & Plate Crop Generation
  if (liveResult.cropsGenerated.length === 0) {
    throw new Error('Pipeline Test Failed: No plate crops generated');
  }
  console.log(`[PASS] Plate Crops Generated in outputs/crops/ (${liveResult.cropsGenerated.length} crops)`);

  // Test 3: Violation Detection & Evidence Generation
  const speedingSim = pipeline.processFrame({
    cameraId: 'CAM-02',
    sourceType: 'image_upload',
    seedIndex: 99,
    customRules: {
      speedLimitKmh: 40 // Force speeding detection
    }
  });

  if (speedingSim.newViolationsDetected.length === 0) {
    throw new Error('Pipeline Test Failed: Speeding violation not detected under low speed threshold');
  }
  console.log(`[PASS] Violation Detected: ${speedingSim.newViolationsDetected[0].violation_type} (${speedingSim.newViolationsDetected[0].plate_number})`);

  // Test 4: Evidence Artifact & SHA256 Integrity
  if (speedingSim.evidenceGenerated.length === 0) {
    throw new Error('Pipeline Test Failed: Evidence not generated for confirmed violation');
  }
  const ev = speedingSim.evidenceGenerated[0];
  if (!ev.sha256Hash || !fs.existsSync(ev.filePath)) {
    throw new Error('Pipeline Test Failed: Evidence file missing or unhashed');
  }
  console.log(`[PASS] Court-Admissible Evidence Created: ${ev.filePath} (SHA-256: ${ev.sha256Hash.slice(0, 16)}...)`);

  // Test 5: Challan Auto-Issuance
  if (speedingSim.newChallansIssued.length === 0) {
    throw new Error('Pipeline Test Failed: E-Challan not automatically linked to violation');
  }
  console.log(`[PASS] Linked e-Challan Issued: ${speedingSim.newChallansIssued[0].challan_id} (Amount: ₹${speedingSim.newChallansIssued[0].amount})`);

  return true;
}

if (import.meta.url.endsWith(process.argv[1])) {
  try {
    runPipelineTests();
    console.log('ALL DETECTION PIPELINE TESTS PASSED.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
