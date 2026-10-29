"""
YOLO Vehicle & Safety Detection Model Wrapper
Supports real Ultralytics YOLOv8 when weights exist, with realistic simulation fallback.
"""
from typing import List, Dict, Any, Optional
import os
import random

try:
    from ultralytics import YOLO
    HAS_ULTRALYTICS = True
except Exception:
    HAS_ULTRALYTICS = False

from app.core.config import settings
from app.core.logging_config import logger

class YOLOVehicleDetector:
    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path or settings.YOLO_MODEL_PATH
        self.model = None
        self.is_loaded = False
        self._load_model()

    def _load_model(self):
        if HAS_ULTRALYTICS and os.path.exists(self.model_path):
            try:
                self.model = YOLO(self.model_path)
                self.is_loaded = True
                logger.info(f"Loaded YOLO model from {self.model_path}")
            except Exception as e:
                logger.warning(f"Failed to load YOLO model: {e}. Falling back to demo mode.")
                self.is_loaded = False
        else:
            logger.info("YOLO weights not present locally. Demo Simulation Mode active.")
            self.is_loaded = False

    def detect_vehicles(self, frame_or_path: Any, conf_threshold: float = 0.5) -> List[Dict[str, Any]]:
        """
        Detects vehicles in frame. Returns normalized and pixel detections.
        """
        if self.is_loaded and self.model:
            try:
                results = self.model(frame_or_path, conf=conf_threshold, verbose=False)
                detections = []
                for r in results:
                    boxes = r.boxes
                    for box in boxes:
                        cls_id = int(box.cls[0])
                        cls_name = self.model.names[cls_id]
                        # COCO vehicle classes: car, motorcycle, bus, truck, bicycle
                        if cls_name in ["car", "motorcycle", "bus", "truck", "bicycle"]:
                            xyxy = box.xyxy[0].tolist()
                            conf = float(box.conf[0])
                            detections.append({
                                "class": cls_name,
                                "confidence": round(conf, 3),
                                "bbox": [int(x) for x in xyxy],
                                "mode": "YOLOv8_LIVE"
                            })
                return detections
            except Exception as e:
                logger.error(f"Inference error: {e}. Using simulated detection.")

        # Realistic Demo Simulation Detection
        sample_classes = ["car", "motorcycle", "bus", "truck"]
        chosen_class = random.choice(sample_classes)
        return [{
            "class": chosen_class,
            "confidence": round(random.uniform(0.88, 0.98), 2),
            "bbox": [120, 180, 480, 420],
            "mode": "DEMO_SIMULATION"
        }]

yolo_detector = YOLOVehicleDetector()
