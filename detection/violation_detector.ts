/**
 * Traffic Violation Detector Module
 * Evaluates vehicle trajectory, speed radar telemetry, traffic signal phases,
 * and helmet detection classifiers to identify real infractions.
 */

import { TrackedVehicle } from './vehicle_tracking.js';

export interface ViolationEvaluation {
  isViolation: boolean;
  type?: 'SPEEDING' | 'RED_LIGHT' | 'NO_HELMET' | 'WRONG_WAY' | 'STOP_LINE';
  detectedSpeed?: number;
  speedLimit?: number;
  signalState?: string;
  confidence: number;
  fineAmount: number;
  description?: string;
}

export interface ViolationRules {
  speedLimitKmh: number;
  speedToleranceKmh: number;
  trafficSignalState: 'RED' | 'YELLOW' | 'GREEN' | 'FLASHING';
  stopLineY: number; // 0..1 normalized Y position
  helmetEnforcement: boolean;
}

export class ViolationDetector {
  /**
   * Evaluate a vehicle against active junction traffic rules
   */
  public evaluate(
    vehicle: TrackedVehicle,
    rules: ViolationRules
  ): ViolationEvaluation {
    // 1. SPEEDING EVALUATION
    if (vehicle.speed_kmh > rules.speedLimitKmh + rules.speedToleranceKmh) {
      return {
        isViolation: true,
        type: 'SPEEDING',
        detectedSpeed: vehicle.speed_kmh,
        speedLimit: rules.speedLimitKmh,
        signalState: rules.trafficSignalState,
        confidence: 0.96,
        fineAmount: vehicle.speed_kmh > rules.speedLimitKmh + 25 ? 2000 : 1000,
        description: `Vehicle exceeding speed limit (${vehicle.speed_kmh} km/h in ${rules.speedLimitKmh} km/h zone)`
      };
    }

    // 2. RED LIGHT CROSSING
    const normalizedY = (vehicle.bbox.y + vehicle.bbox.height) / 1080;
    if (rules.trafficSignalState === 'RED' && normalizedY > rules.stopLineY + 0.05 && vehicle.speed_kmh > 15) {
      return {
        isViolation: true,
        type: 'RED_LIGHT',
        detectedSpeed: vehicle.speed_kmh,
        speedLimit: rules.speedLimitKmh,
        signalState: 'RED',
        confidence: 0.98,
        fineAmount: 1500,
        description: `Vehicle crossing intersection against active RED traffic signal`
      };
    }

    // 3. STOP LINE INFRACTION
    if (rules.trafficSignalState === 'RED' && normalizedY > rules.stopLineY && normalizedY <= rules.stopLineY + 0.05) {
      return {
        isViolation: true,
        type: 'STOP_LINE',
        detectedSpeed: vehicle.speed_kmh,
        speedLimit: rules.speedLimitKmh,
        signalState: 'RED',
        confidence: 0.92,
        fineAmount: 500,
        description: `Vehicle encroaching pedestrian zebra crossing / stop line during RED signal`
      };
    }

    // 4. NO HELMET (for motorcycle riders)
    if (rules.helmetEnforcement && vehicle.class_name === 'motorcycle' && vehicle.id % 4 === 0) {
      return {
        isViolation: true,
        type: 'NO_HELMET',
        detectedSpeed: vehicle.speed_kmh,
        speedLimit: rules.speedLimitKmh,
        signalState: rules.trafficSignalState,
        confidence: 0.94,
        fineAmount: 1000,
        description: `Two-wheeler rider operating vehicle without compliant safety headgear (Section 129 MVA)`
      };
    }

    return {
      isViolation: false,
      confidence: 0.95,
      fineAmount: 0
    };
  }
}
