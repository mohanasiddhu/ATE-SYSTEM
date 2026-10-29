"""
AI Traffic Enforcement System - Python Model Registry
"""
from dataclasses import dataclass
from typing import Dict

@dataclass
class ModelMetadata:
    id: str
    name: str
    version: str
    task: str
    weights_path: str
    config_path: str
    latency_ms: float
    accuracy_metric: str

MODEL_REGISTRY: Dict[str, ModelMetadata] = {
    "vehicle_detector": ModelMetadata(
        id="yolo-v8n-traffic",
        name="YOLOv8n Traffic Perception",
        version="2.4.1",
        task="vehicle_detection",
        weights_path="./ai_models/weights/yolov8n.pt",
        config_path="./ai_models/configs/yolov8_vehicle.yaml",
        latency_ms=6.8,
        accuracy_metric="mAP@0.5: 0.528"
    ),
    "plate_detector": ModelMetadata(
        id="yolo-v8n-plate",
        name="YOLOv8n License Plate Localizer",
        version="1.9.0",
        task="plate_localization",
        weights_path="./ai_models/weights/yolov8n-license-plate.pt",
        config_path="./ai_models/configs/yolov8_plate.yaml",
        latency_ms=4.2,
        accuracy_metric="mAP@0.5: 0.984"
    ),
    "ocr_engine": ModelMetadata(
        id="lprnet-crnn",
        name="LPRNet-CRNN Optical Recognition",
        version="3.1.0",
        task="ocr_transcription",
        weights_path="./ai_models/weights/lprnet_ocr.pth",
        config_path="./ai_models/configs/anpr_ocr_config.yaml",
        latency_ms=3.1,
        accuracy_metric="Char Accuracy: 97.6%"
    )
}
