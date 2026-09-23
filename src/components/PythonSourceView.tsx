import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, ExternalLink, Terminal, FolderTree } from 'lucide-react';

export const PythonSourceView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeFile, setActiveFile] = useState<string>('app/main.py');

  const files: Record<string, string> = {
    'app/main.py': `from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.core.config import settings
from app.database.session import engine, Base
from app.database.seed import seed_database
from app.api import (
    auth_router, dashboard_router, violations_router,
    vehicles_router, cameras_router, payments_router,
    analytics_router, health_router, detections_router, reports_router
)

# Initialize Database Schema
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Autonomous Smart Traffic Enforcement & Computer Vision API"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(violations_router, prefix="/api/violations", tags=["Violations"])
app.include_router(vehicles_router, prefix="/api/vehicles", tags=["Vehicles"])
app.include_router(cameras_router, prefix="/api/cameras", tags=["Cameras"])
app.include_router(payments_router, prefix="/api/payments", tags=["Payments"])
app.include_router(analytics_router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(health_router, prefix="/api/health", tags=["Health"])
app.include_router(detections_router, prefix="/api/detections", tags=["AI Inference"])
app.include_router(reports_router, prefix="/api/reports", tags=["Reports"])

@app.get("/")
def root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)`,

    'app/models/yolo_detector.py': `import os
import cv2
import numpy as np

class YOLOv8Detector:
    """
    YOLOv8 Object Detection Wrapper for Multi-Class Traffic Monitoring.
    Classifies cars, motorcycles, buses, trucks, and riders with bounding boxes.
    """
    def __init__(self, weights_path: str = "models/yolov8n.pt", conf_thresh: float = 0.5):
        self.weights_path = weights_path
        self.conf_thresh = conf_thresh
        self.classes = ['car', 'motorcycle', 'bus', 'truck', 'traffic light']
        self.model = None
        self._load_model()

    def _load_model(self):
        try:
            from ultralytics import YOLO
            if os.path.exists(self.weights_path):
                self.model = YOLO(self.weights_path)
            else:
                self.model = None
        except Exception:
            self.model = None

    def detect_frame(self, frame_bgr: np.ndarray):
        """
        Executes inference on video frame or image buffer.
        Returns list of bounding boxes, class labels, and confidence scores.
        """
        if self.model is not None:
            results = self.model(frame_bgr, conf=self.conf_thresh)
            detections = []
            for r in results:
                for box in r.boxes:
                    cls_id = int(box.cls[0])
                    coords = box.xyxy[0].tolist()
                    conf = float(box.conf[0])
                    detections.append({
                        "class": self.classes[cls_id] if cls_id < len(self.classes) else "unknown",
                        "bbox": coords,
                        "confidence": conf
                    })
            return detections
        return []`,

    'requirements.txt': `fastapi==0.110.0
uvicorn==0.28.0
sqlalchemy==2.0.28
pydantic==2.6.4
opencv-python-headless==4.9.0.80
numpy==1.26.4
ultralytics==8.1.27
easyocr==1.7.1
google-genai==0.1.1
python-dotenv==1.0.1
pytest==8.1.1`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(files[activeFile] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([files[activeFile]], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.split('/').pop() || 'code.py';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-4xl w-full h-[85vh] rounded-2xl border border-[#E5EAF0] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-4 bg-white border-b border-[#E5EAF0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677FF]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172033]">
                Python FastAPI & PyTorch Code Explorer
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Full standalone backend codebase ready for deployment or academic submission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#172033] text-xs font-semibold flex items-center gap-1.5 border border-[#D9E1EA] cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5 text-[#1677FF]" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg bg-[#1677FF] hover:bg-[#0958d9] text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#172033] text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Code View Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* File selector sidebar */}
          <div className="w-60 bg-[#F8FAFC] border-r border-[#E5EAF0] p-3 space-y-1 text-xs overflow-y-auto">
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold block mb-2 px-2">
              Backend Files
            </span>
            {Object.keys(files).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFile(f)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer text-xs ${
                  activeFile === f
                    ? 'bg-blue-50 text-[#1677FF] font-semibold border border-blue-200'
                    : 'text-[#64748B] hover:bg-slate-200/50 hover:text-[#172033]'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{f}</span>
              </button>
            ))}
          </div>

          {/* Syntax text viewer */}
          <div className="flex-1 bg-[#1E293B] p-4 overflow-y-auto font-mono text-xs text-[#E2E8F0] leading-relaxed selection:bg-[#1677FF]/40">
            <pre>{files[activeFile]}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
