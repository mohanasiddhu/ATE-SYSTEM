#!/usr/bin/env bash
# AI Traffic Enforcement System - YOLOv8 Model Training Script
set -e

echo "=== Commencing YOLOv8 Vehicle & Plate Detection Training ==="
echo "Dataset config: datasets/data.yaml"
echo "Model config:   ai_models/configs/yolov8_vehicle.yaml"

if command -v yolo &> /dev/null; then
  yolo detect train \
    data=datasets/data.yaml \
    model=yolov8n.pt \
    epochs=100 \
    imgsz=640 \
    batch=32 \
    workers=8 \
    device=0 \
    project=outputs/training \
    name=yolov8n_traffic_run1
else
  echo "[INFO] Ultralytics CLI not found in local path. To train:"
  echo "pip install ultralytics"
  echo "yolo detect train data=datasets/data.yaml model=yolov8n.pt epochs=100 imgsz=640"
fi
