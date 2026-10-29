/**
 * AI Traffic Enforcement System - AI Model Registry
 * Centralized interface for model checkpoint paths, specs, and status
 */

export interface ModelMetadata {
  id: string;
  name: string;
  version: string;
  task: 'vehicle_detection' | 'plate_localization' | 'ocr_transcription' | 'tracking';
  weightsPath: string;
  configPath: string;
  latencyMs: number;
  accuracyMetric: string;
  status: 'READY' | 'LOADED' | 'SIMULATED';
}

export const MODEL_REGISTRY: Record<string, ModelMetadata> = {
  vehicleDetector: {
    id: 'yolo-v8n-traffic',
    name: 'YOLOv8n Traffic Perception',
    version: '2.4.1',
    task: 'vehicle_detection',
    weightsPath: './ai_models/weights/yolov8n.pt',
    configPath: './ai_models/configs/yolov8_vehicle.yaml',
    latencyMs: 6.8,
    accuracyMetric: 'mAP@0.5: 0.528',
    status: 'READY'
  },
  plateDetector: {
    id: 'yolo-v8n-plate',
    name: 'YOLOv8n License Plate Localizer',
    version: '1.9.0',
    task: 'plate_localization',
    weightsPath: './ai_models/weights/yolov8n-license-plate.pt',
    configPath: './ai_models/configs/yolov8_plate.yaml',
    latencyMs: 4.2,
    accuracyMetric: 'mAP@0.5: 0.984',
    status: 'READY'
  },
  ocrEngine: {
    id: 'lprnet-crnn',
    name: 'LPRNet-CRNN Optical Recognition',
    version: '3.1.0',
    task: 'ocr_transcription',
    weightsPath: './ai_models/weights/lprnet_ocr.pth',
    configPath: './ai_models/configs/anpr_ocr_config.yaml',
    latencyMs: 3.1,
    accuracyMetric: 'Char Accuracy: 97.6%',
    status: 'READY'
  },
  tracker: {
    id: 'bytetrack-kalman',
    name: 'ByteTrack Multi-Object Tracker',
    version: '1.0.5',
    task: 'tracking',
    weightsPath: 'N/A (Parameter-Free Kalman)',
    configPath: './ai_models/configs/bytetrack_config.yaml',
    latencyMs: 1.2,
    accuracyMetric: 'HOTA: 72.4%',
    status: 'READY'
  }
};
