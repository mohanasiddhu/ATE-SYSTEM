import { Request, Response } from 'express';
import { detectionService } from '../services/detectionService.js';

export async function liveDetectionHandler(req: Request, res: Response): Promise<void> {
  try {
    const { cameraId, seed } = req.body;
    const output = await detectionService.processLiveStream(cameraId || 'CAM-01', seed);
    res.json({ success: true, data: output });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function imageDetectionHandler(req: Request, res: Response): Promise<void> {
  try {
    const { cameraId, width, height, seed } = req.body;
    const output = await detectionService.processImage({
      cameraId: cameraId || 'CAM-01',
      frameWidth: width,
      frameHeight: height,
      seedIndex: seed
    });
    res.json({ success: true, data: output });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function videoDetectionHandler(req: Request, res: Response): Promise<void> {
  try {
    const { cameraId, videoUrl, seed } = req.body;
    const output = await detectionService.processVideo({
      cameraId: cameraId || 'CAM-01',
      seedIndex: seed
    });
    res.json({ success: true, videoUrl: videoUrl || '/assets/car-detection.mp4', data: output });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function anprHandler(req: Request, res: Response): Promise<void> {
  try {
    const { plateHint } = req.body;
    const result = await detectionService.performAnpr(plateHint);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
