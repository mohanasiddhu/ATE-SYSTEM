# Model Training & Fine-Tuning Guide

This guide details dataset preparation, annotation structure, and training execution for YOLOv8 multi-class vehicle perception and license plate localization.

## 1. Dataset Configuration (`datasets/data.yaml`)
Ensure your dataset follows standard YOLOv8 format:
```yaml
path: ../datasets
train: train/images
val: val/images
test: test/images

nc: 8
names:
  0: car
  1: motorcycle
  2: bus
  3: truck
  4: auto_rickshaw
  5: bicycle
  6: license_plate
  7: rider_no_helmet
```

Directory Layout:
```
datasets/
├── data.yaml
├── train/
│   ├── images/ (e.g. frame_0001.jpg)
│   └── labels/ (e.g. frame_0001.txt)
├── val/
│   ├── images/
│   └── labels/
└── test/
    ├── images/
    └── labels/
```

Label File Format:
`<class_id> <x_center> <y_center> <width> <height>` (normalized 0 to 1).

---

## 2. Training Vehicle Detection Model
Run the automated script:
```bash
bash scripts/train_yolo.sh
```

Or execute via the Ultralytics CLI directly:
```bash
yolo detect train \
  data=datasets/data.yaml \
  model=yolov8n.pt \
  epochs=100 \
  imgsz=640 \
  batch=32 \
  device=0 \
  project=outputs/training \
  name=yolov8n_traffic
```

## 3. Training License Plate Localizer
```bash
yolo detect train \
  data=datasets/data.yaml \
  model=yolov8n-license-plate.pt \
  epochs=150 \
  imgsz=640 \
  batch=64 \
  device=0 \
  project=outputs/training \
  name=yolov8n_plate
```

## 4. Exporting to ONNX / TensorRT
For low-latency edge deployment on NVIDIA Jetson or TensorRT runtime:
```bash
yolo export model=outputs/training/yolov8n_traffic/weights/best.pt format=engine device=0 half=true
```
Move final exported weights into `ai_models/weights/`.
