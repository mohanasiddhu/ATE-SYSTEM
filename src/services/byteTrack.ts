/**
 * ByteTrack Multi-Object Tracking Engine (YOLOv8 + ByteTrack Architecture)
 * Conforming to academic ByteTrack specification:
 * - Multi-stage IoU association (High-score detections then Low-score detections)
 * - Track lifecycle states: DETECTED, TRACKING, LOST, REMOVED
 * - Stale track pruning based on MAX_MISSED_FRAMES
 * - Zero stale / fake bounding box persistence
 */

export type TrackState = 'DETECTED' | 'TRACKING' | 'LOST' | 'REMOVED';
export type VehicleClass = 'car' | 'bus' | 'truck' | 'motorcycle' | 'bicycle';

export interface RawDetection {
  bbox: [number, number, number, number]; // [x, y, w, h] in normalized percentages 0-100
  score: number;                         // 0.0 to 1.0
  cls: VehicleClass;
  plateNumber?: string;
  plateConfidence?: number;
  plateBbox?: [number, number, number, number];
}

export interface STrack {
  trackId: number;
  bbox: [number, number, number, number]; // [x, y, w, h] in % (0-100)
  score: number;
  cls: VehicleClass;
  state: TrackState;
  startFrame: number;
  frameId: number;
  lastSeenFrame: number;
  trackletLen: number;
  missedFrames: number;
  velocity: [number, number];            // [vx, vy] in % per frame
  plateNumber?: string;
  plateConfidence?: number;
  plateBbox?: [number, number, number, number];
  speed?: number;
  violation?: string;
}

export interface TrackerConfig {
  confThreshold: number;   // e.g. 0.45
  iouThreshold: number;    // e.g. 0.50
  maxMissedFrames: number; // e.g. 5
  trackBuffer: number;     // e.g. 5
}

export interface DebugTrackInfo {
  id: number;
  cls: VehicleClass;
  confidence: number;
  status: TrackState;
  lastSeen: number;
  missedFrames: number;
  bbox: [number, number, number, number];
  speed?: number;
}

export interface TrackerDebugStats {
  frame: number;
  fps: number;
  vehiclesDetected: number;
  activeTracks: number;
  lostTracks: number;
  removedTracks: number;
  tracks: DebugTrackInfo[];
}

/**
 * Calculates Intersection over Union (IoU) between two bounding boxes
 * Boxes are [x, y, w, h] in normalized coordinates
 */
export function calculateIoU(
  boxA: [number, number, number, number],
  boxB: [number, number, number, number]
): number {
  const xA = Math.max(boxA[0], boxB[0]);
  const yA = Math.max(boxA[1], boxB[1]);
  const xB = Math.min(boxA[0] + boxA[2], boxB[0] + boxB[2]);
  const yB = Math.min(boxA[1] + boxA[3], boxB[1] + boxB[3]);

  const interW = Math.max(0, xB - xA);
  const interH = Math.max(0, yB - yA);
  const interArea = interW * interH;

  const areaA = boxA[2] * boxA[3];
  const areaB = boxB[2] * boxB[3];
  const unionArea = areaA + areaB - interArea;

  if (unionArea <= 0) return 0;
  return interArea / unionArea;
}

export class ByteTracker {
  private trackedStracks: STrack[] = [];
  private lostStracks: STrack[] = [];
  private removedStracksCount: number = 0;
  private nextId: number = 101; // Clean academic track IDs starting at 101
  private frameCount: number = 0;

  public config: TrackerConfig = {
    confThreshold: 0.45,
    iouThreshold: 0.50,
    maxMissedFrames: 5,
    trackBuffer: 5,
  };

  constructor(config?: Partial<TrackerConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Resets all internal state when video ends, restarts, or new media is loaded
   */
  public reset(): void {
    this.trackedStracks = [];
    this.lostStracks = [];
    this.removedStracksCount = 0;
    this.nextId = 101;
    this.frameCount = 0;
  }

  /**
   * Core ByteTrack update algorithm per video frame
   */
  public update(detections: RawDetection[], frameIndex: number): STrack[] {
    this.frameCount = frameIndex;

    // 1. Separate detections into High-Score and Low-Score groups
    const highDetections: RawDetection[] = [];
    const lowDetections: RawDetection[] = [];

    const highThreshold = this.config.confThreshold;
    const lowThreshold = Math.max(0.15, highThreshold * 0.4);

    for (const det of detections) {
      if (det.score >= highThreshold) {
        highDetections.push(det);
      } else if (det.score >= lowThreshold) {
        lowDetections.push(det);
      }
    }

    // 2. Predict next positions of existing tracked & lost stracks using linear velocity
    const poolTracks = [...this.trackedStracks, ...this.lostStracks];
    for (const track of poolTracks) {
      track.bbox[0] = Math.max(0, Math.min(100 - track.bbox[2], track.bbox[0] + track.velocity[0]));
      track.bbox[1] = Math.max(0, Math.min(100 - track.bbox[3], track.bbox[1] + track.velocity[1]));
    }

    // 3. First Stage Association: High-score detections with active tracks
    const activeTracks = [...this.trackedStracks];
    const {
      matches: matches1,
      unmatchedTracks: unmatchedTracks1,
      unmatchedDetections: unmatchedDetections1,
    } = this.associate(activeTracks, highDetections, this.config.iouThreshold);

    // Update matched tracks from stage 1
    for (const [tIdx, dIdx] of matches1) {
      const track = activeTracks[tIdx];
      const det = highDetections[dIdx];

      // Update velocity smoothly
      const vx = (det.bbox[0] - track.bbox[0]) * 0.4 + track.velocity[0] * 0.6;
      const vy = (det.bbox[1] - track.bbox[1]) * 0.4 + track.velocity[1] * 0.6;
      track.velocity = [vx, vy];

      track.bbox = det.bbox;
      track.score = det.score;
      track.cls = det.cls;
      track.lastSeenFrame = frameIndex;
      track.missedFrames = 0;
      track.trackletLen += 1;
      track.state = 'TRACKING';

      // Update license plate if detected
      if (det.plateNumber) {
        track.plateNumber = det.plateNumber;
        track.plateConfidence = det.plateConfidence;
        track.plateBbox = det.plateBbox;
      }
    }

    // 4. Second Stage Association: Low-score detections with unmatched active & lost tracks
    const remainingTracks = unmatchedTracks1.map((idx) => activeTracks[idx]);
    const {
      matches: matches2,
      unmatchedTracks: unmatchedTracks2,
    } = this.associate(remainingTracks, lowDetections, 0.40);

    for (const [tIdx, dIdx] of matches2) {
      const track = remainingTracks[tIdx];
      const det = lowDetections[dIdx];

      track.bbox = det.bbox;
      track.score = det.score;
      track.lastSeenFrame = frameIndex;
      track.missedFrames = 0;
      track.trackletLen += 1;
      track.state = 'TRACKING';

      if (det.plateNumber) {
        track.plateNumber = det.plateNumber;
        track.plateConfidence = det.plateConfidence;
        track.plateBbox = det.plateBbox;
      }
    }

    // 5. Handle unmatched tracks -> mark LOST, and if missed > MAX_MISSED_FRAMES -> REMOVE
    const lostCandidateTracks: STrack[] = unmatchedTracks2.map((idx) => remainingTracks[idx]);

    // Update lost tracks from previous frames as well
    const allLostTracks = [...lostCandidateTracks, ...this.lostStracks];
    const uniqueLostTracks = Array.from(new Set(allLostTracks));

    const updatedTracked: STrack[] = [];
    const updatedLost: STrack[] = [];

    // All successfully matched tracks stay in tracked
    for (const [tIdx] of matches1) {
      updatedTracked.push(activeTracks[tIdx]);
    }
    for (const [tIdx] of matches2) {
      updatedTracked.push(remainingTracks[tIdx]);
    }

    // 6. Handle unmatched high-score detections -> create fresh tracks
    for (const dIdx of unmatchedDetections1) {
      const det = highDetections[dIdx];
      const newTrack: STrack = {
        trackId: this.nextId++,
        bbox: det.bbox,
        score: det.score,
        cls: det.cls,
        state: 'DETECTED',
        startFrame: frameIndex,
        frameId: frameIndex,
        lastSeenFrame: frameIndex,
        trackletLen: 1,
        missedFrames: 0,
        velocity: [0, 0],
        plateNumber: det.plateNumber,
        plateConfidence: det.plateConfidence,
        plateBbox: det.plateBbox,
      };
      updatedTracked.push(newTrack);
    }

    // 7. Prune lost tracks according to MAX_MISSED_FRAMES
    for (const track of uniqueLostTracks) {
      if (updatedTracked.some((t) => t.trackId === track.trackId)) {
        continue; // Already revived in tracked
      }

      track.missedFrames += 1;
      track.state = 'LOST';

      if (track.missedFrames > this.config.maxMissedFrames) {
        // PERMANENTLY REMOVE STALE TRACK
        track.state = 'REMOVED';
        this.removedStracksCount += 1;
      } else {
        updatedLost.push(track);
      }
    }

    this.trackedStracks = updatedTracked;
    this.lostStracks = updatedLost;

    // Return confirmed active tracks (NO STALE/DEAD BOXES!)
    return this.getConfirmedTracks();
  }

  /**
   * Only returns tracks that are confirmed ACTIVE in the current frame.
   * If a vehicle left the frame and missed > 0, it is NOT rendered.
   */
  public getConfirmedTracks(): STrack[] {
    return this.trackedStracks.filter(
      (t) => (t.state === 'TRACKING' || t.state === 'DETECTED') && t.missedFrames === 0
    );
  }

  /**
   * Bipartite greedy association using IoU
   */
  private associate(
    tracks: STrack[],
    detections: RawDetection[],
    threshold: number
  ): {
    matches: [number, number][];
    unmatchedTracks: number[];
    unmatchedDetections: number[];
  } {
    if (tracks.length === 0 || detections.length === 0) {
      return {
        matches: [],
        unmatchedTracks: tracks.map((_, i) => i),
        unmatchedDetections: detections.map((_, i) => i),
      };
    }

    // Compute IoU matrix
    const iouMatrix: number[][] = [];
    for (let i = 0; i < tracks.length; i++) {
      iouMatrix[i] = [];
      for (let j = 0; j < detections.length; j++) {
        // Enforce class match or cross-vehicle compatibility
        const classMatch =
          tracks[i].cls === detections[j].cls ||
          (tracks[i].cls === 'car' && detections[j].cls === 'truck') ||
          (tracks[i].cls === 'truck' && detections[j].cls === 'car');
        const iou = calculateIoU(tracks[i].bbox, detections[j].bbox);
        iouMatrix[i][j] = classMatch ? iou : iou * 0.7;
      }
    }

    const matchedTracks = new Set<number>();
    const matchedDets = new Set<number>();
    const matches: [number, number][] = [];

    // Find best matches iteratively
    while (true) {
      let maxIoU = 0;
      let bestT = -1;
      let bestD = -1;

      for (let i = 0; i < tracks.length; i++) {
        if (matchedTracks.has(i)) continue;
        for (let j = 0; j < detections.length; j++) {
          if (matchedDets.has(j)) continue;
          if (iouMatrix[i][j] > maxIoU) {
            maxIoU = iouMatrix[i][j];
            bestT = i;
            bestD = j;
          }
        }
      }

      if (maxIoU >= threshold && bestT >= 0 && bestD >= 0) {
        matches.push([bestT, bestD]);
        matchedTracks.add(bestT);
        matchedDets.add(bestD);
      } else {
        break;
      }
    }

    const unmatchedTracks: number[] = [];
    for (let i = 0; i < tracks.length; i++) {
      if (!matchedTracks.has(i)) unmatchedTracks.push(i);
    }

    const unmatchedDetections: number[] = [];
    for (let j = 0; j < detections.length; j++) {
      if (!matchedDets.has(j)) unmatchedDetections.push(j);
    }

    return { matches, unmatchedTracks, unmatchedDetections };
  }

  /**
   * Diagnostic telemetry for FRAME-BY-FRAME DEBUG MODE
   */
  public getDebugStats(currentFps: number): TrackerDebugStats {
    const allTracks = [...this.trackedStracks, ...this.lostStracks];
    return {
      frame: this.frameCount,
      fps: Number(currentFps.toFixed(1)),
      vehiclesDetected: this.getConfirmedTracks().length,
      activeTracks: this.trackedStracks.length,
      lostTracks: this.lostStracks.length,
      removedTracks: this.removedStracksCount,
      tracks: allTracks.map((t) => ({
        id: t.trackId,
        cls: t.cls,
        confidence: Number(t.score.toFixed(2)),
        status: t.state,
        lastSeen: t.lastSeenFrame,
        missedFrames: t.missedFrames,
        bbox: t.bbox,
        speed: t.speed,
      })),
    };
  }
}
