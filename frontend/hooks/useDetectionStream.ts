import { useState, useEffect, useRef } from 'react';
import { detectionApi } from '../api/index.js';

export function useDetectionStream(cameraId = 'CAM-01', active = true) {
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [activeVehicles, setActiveVehicles] = useState<any[]>([]);
  const [recentViolations, setRecentViolations] = useState<any[]>([]);
  const [fps, setFps] = useState<number>(30);
  const seedRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      seedRef.current = (seedRef.current + 1) % 1000;
      try {
        const start = performance.now();
        const res = await detectionApi.runLiveStream(cameraId, seedRef.current);
        const elapsed = performance.now() - start;

        if (isMounted && res.success && res.data) {
          setPipelineData(res.data);
          // Only show active, non-stale detections
          setActiveVehicles(res.data.trackedVehicles || []);
          if (res.data.newViolationsDetected && res.data.newViolationsDetected.length > 0) {
            setRecentViolations(prev => [...res.data.newViolationsDetected, ...prev].slice(0, 10));
          }
          setFps(Math.round(1000 / Math.max(elapsed, 33)));
        }
      } catch {
        // network resilience
      }
    }, 1500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [cameraId, active]);

  return { pipelineData, activeVehicles, recentViolations, fps };
}
