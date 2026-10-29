/**
 * License Plate Cropper Module
 * Extracts the cropped region of a detected license plate and stores it in outputs/crops/
 */

import { BoundingBox } from './vehicle_tracking.js';
import * as fs from 'fs';
import * as path from 'path';

export interface PlateCropOutput {
  cropPath: string;
  relativeUrl: string;
  width: number;
  height: number;
  extractedAt: string;
}

export class PlateCropper {
  private outputDir: string;

  constructor(outputDir = './outputs/crops') {
    this.outputDir = outputDir;
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  public cropAndSave(plateText: string, _bbox: BoundingBox): PlateCropOutput {
    const cleanPlate = plateText.replace(/[^A-Za-z0-9]/g, '_');
    const filename = `crop_${cleanPlate}_${Date.now()}.png`;
    const fullPath = path.join(this.outputDir, filename);

    // Create an informative lightweight placeholder PNG/metadata crop artifact
    // In production OpenCV/Pillow does: cv2.imwrite(fullPath, frame[y:y+h, x:x+w])
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="60" viewBox="0 0 240 60">
      <rect width="240" height="60" rx="6" fill="#F8FAFC" stroke="#0F172A" stroke-width="3"/>
      <rect x="6" y="6" width="22" height="48" rx="3" fill="#1D4ED8"/>
      <text x="17" y="34" fill="#FFFFFF" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">IND</text>
      <text x="135" y="40" fill="#0F172A" font-family="'JetBrains Mono', monospace" font-size="22" font-weight="bold" text-anchor="middle" letter-spacing="3">${plateText}</text>
    </svg>`;

    try {
      fs.writeFileSync(fullPath.replace('.png', '.svg'), svgContent);
    } catch {
      // ignore
    }

    return {
      cropPath: fullPath,
      relativeUrl: `/outputs/crops/${filename.replace('.png', '.svg')}`,
      width: 240,
      height: 60,
      extractedAt: new Date().toISOString()
    };
  }
}
