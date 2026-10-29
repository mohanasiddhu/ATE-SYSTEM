/**
 * Confidence Validator Module
 * Rejects low-confidence detections or borderline classifications
 * to eliminate false positives in legal traffic enforcement.
 */

import { ViolationEvaluation } from './violation_detector.js';

export interface ValidationResult {
  isValid: boolean;
  rejectionReason?: string;
  auditScore: number;
}

export class ConfidenceValidator {
  private minConfidence: number;

  constructor(minConfidence = 0.85) {
    this.minConfidence = minConfidence;
  }

  public validate(evaluation: ViolationEvaluation, plateConfidence = 0.90): ValidationResult {
    if (!evaluation.isViolation) {
      return { isValid: false, rejectionReason: 'No violation detected', auditScore: 0 };
    }

    if (evaluation.confidence < this.minConfidence) {
      return {
        isValid: false,
        rejectionReason: `Violation confidence (${(evaluation.confidence * 100).toFixed(1)}%) below minimum legal standard (${(this.minConfidence * 100).toFixed(1)}%)`,
        auditScore: evaluation.confidence
      };
    }

    if (plateConfidence < 0.80) {
      return {
        isValid: false,
        rejectionReason: `License plate OCR confidence (${(plateConfidence * 100).toFixed(1)}%) too low for evidentiary prosecution`,
        auditScore: plateConfidence
      };
    }

    return {
      isValid: true,
      auditScore: (evaluation.confidence + plateConfidence) / 2
    };
  }
}
