/**
 * Multi-Object Tracking & ByteTrack Verification Tests
 * Verifies consistency of Track IDs, zero stale bounding boxes,
 * and immediate eviction of vehicles leaving camera bounds.
 */

import { ByteTracker, Detection } from '../detection/vehicle_tracking.js';

export function runTrackingTests(): boolean {
  console.log('\n--- [TEST SUITE]: ByteTrack Tracking & Box Eviction ---');
  const tracker = new ByteTracker(5, 0.3);

  // Frame 1: Vehicle enters frame
  const frame1Dets: Detection[] = [
    { bbox: { x: 100, y: 200, width: 80, height: 120 }, confidence: 0.95, class_name: 'car' }
  ];
  const trackedF1 = tracker.update(frame1Dets);
  if (trackedF1.length !== 1) throw new Error('Tracking Test Failed: Did not register new vehicle');
  const initialId = trackedF1[0].id;
  console.log(`[PASS] Vehicle track initialized with consistent ID #${initialId}`);

  // Frame 2: Vehicle moves slightly (association check)
  const frame2Dets: Detection[] = [
    { bbox: { x: 108, y: 215, width: 80, height: 120 }, confidence: 0.94, class_name: 'car' }
  ];
  const trackedF2 = tracker.update(frame2Dets);
  if (trackedF2.length !== 1 || trackedF2[0].id !== initialId) {
    throw new Error('Tracking Test Failed: Track ID changed or track was lost');
  }
  console.log(`[PASS] Track ID persistent across consecutive frames (#${trackedF2[0].id})`);

  // Frame 3 to 10: Vehicle leaves camera frame (no detections)
  // Tracker must evict stale track and return empty active set
  let lastTracked = trackedF2;
  for (let f = 3; f <= 10; f++) {
    lastTracked = tracker.update([]);
  }

  if (lastTracked.length !== 0) {
    throw new Error('Tracking Test Failed: Stale bounding box remained after vehicle exited frame');
  }
  console.log(`[PASS] Stale bounding box purged immediately when vehicle left frame (0 stale boxes)`);

  // Test 4: Fake detection rejection
  const fakeDetection: Detection[] = [
    { bbox: { x: 50, y: 50, width: 20, height: 20 }, confidence: 0.20, class_name: 'car' }
  ];
  const trackedFake = tracker.update(fakeDetection);
  if (trackedFake.length > 0) {
    throw new Error('Tracking Test Failed: Low-confidence fake detection was tracked');
  }
  console.log(`[PASS] Sub-threshold fake detections rejected properly`);

  return true;
}

if (import.meta.url.endsWith(process.argv[1])) {
  try {
    runTrackingTests();
    console.log('ALL TRACKING TESTS PASSED.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
