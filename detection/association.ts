/**
 * Vehicle - License Plate Association Module
 * Spatially matches localized plates to vehicle bounding boxes using IoU and containment
 */

import { BoundingBox, TrackedVehicle } from './vehicle_tracking.js';
import { OCRResult } from './ocr_anpr.js';

export interface AssociatedVehiclePlate {
  vehicle: TrackedVehicle;
  plateBbox: BoundingBox;
  ocrResult: OCRResult;
  associationScore: number;
}

export class AssociationEngine {
  /**
   * Associate OCR result and plate box with the most probable tracked vehicle
   */
  public associate(
    plateBox: BoundingBox,
    ocr: OCRResult,
    vehicles: TrackedVehicle[]
  ): AssociatedVehiclePlate | null {
    if (vehicles.length === 0) return null;

    let bestVehicle: TrackedVehicle | null = null;
    let highestScore = -1;

    for (const vehicle of vehicles) {
      // Check if plate center is inside or near the vehicle bounding box
      const plateCenterX = plateBox.x + plateBox.width / 2;
      const plateCenterY = plateBox.y + plateBox.height / 2;

      const isInside =
        plateCenterX >= vehicle.bbox.x - 20 &&
        plateCenterX <= vehicle.bbox.x + vehicle.bbox.width + 20 &&
        plateCenterY >= vehicle.bbox.y - 20 &&
        plateCenterY <= vehicle.bbox.y + vehicle.bbox.height + 20;

      if (isInside) {
        // Preference for bottom half of the vehicle
        const verticalRatio = (plateCenterY - vehicle.bbox.y) / vehicle.bbox.height;
        const score = verticalRatio > 0.5 ? 0.95 : 0.70;

        if (score > highestScore) {
          highestScore = score;
          bestVehicle = vehicle;
        }
      }
    }

    if (bestVehicle) {
      bestVehicle.license_plate = ocr.normalizedText;
      bestVehicle.plate_confidence = ocr.confidence;

      return {
        vehicle: bestVehicle,
        plateBbox: plateBox,
        ocrResult: ocr,
        associationScore: highestScore
      };
    }

    return null;
  }
}
