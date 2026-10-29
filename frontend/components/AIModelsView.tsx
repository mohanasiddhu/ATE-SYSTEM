import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Play
} from 'lucide-react';
import { ModelTrainingModal } from './ModelTrainingModal';

export const AIModelsView: React.FC = () => {
  const [vehConf, setVehConf] = useState<number>(0.85);
  const [ocrConf, setOcrConf] = useState<number>(0.90);
  const [speedBuffer, setSpeedBuffer] = useState<number>(5);
  const [helmetGate, setHelmetGate] = useState<number>(0.80);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState<boolean>(false);
  const [isTrained, setIsTrained] = useState<boolean>(false);
  const [activeModelName, setActiveModelName] = useState<string>('YOLOv8-Nano Baseline');
  const [activeMapScore, setActiveMapScore] = useState<number>(0.914);

  const handleDeployTrainedModel = (name: string, mapScore: number) => {
    setIsTrained(true);
    setActiveModelName(name);
    setActiveMapScore(mapScore);
    setVehConf(0.92);
    setOcrConf(0.95);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-[#172033]">
            Computer Vision Models & Inference Parameters
          </h2>
          <p className="text-xs text-[#64748B]">
            Model Weights Registry, Fine-Tuning Studio, Confidence Filters & Multi-Stage Optical Pipelines
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTrainingModalOpen(true)}
            className={`btn-3d px-4 py-2 text-xs font-semibold flex items-center gap-2 ${
              isTrained ? 'btn-3d-success' : 'btn-3d-primary'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isTrained ? `Trained: ${activeModelName}` : '⚡ Train & Fine-Tune Model'}</span>
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#16A34A] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>HYBRID INFERENCE ENGINE ONLINE</span>
          </div>
        </div>
      </div>

      <ModelTrainingModal
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        onDeployTrainedModel={handleDeployTrainedModel}
        isCurrentlyTrained={isTrained}
      />

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Model 1: YOLOv8 */}
        <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1677FF] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              YOLOv8-NANO
            </span>
            <span className="text-[11px] text-[#16A34A] flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-[#172033]">
              Multi-Class Vehicle Classifier
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Classifies Car, Bus, Truck, Motorcycle, Bicycle with bounding box regression.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Weights File:</span>
              <span className="text-[#172033] font-semibold">yolov8n.pt (6.2 MB)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Inference Device:</span>
              <span className="text-[#1677FF] font-semibold">CPU / CUDA Ready</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Observed Latency:</span>
              <span className="text-[#16A34A] font-semibold">18.2 ms</span>
            </div>
          </div>
        </div>

        {/* Model 2: EasyOCR */}
        <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#D97706] bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
              EASYOCR + CRAFT
            </span>
            <span className="text-[11px] text-[#16A34A] flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-[#172033]">
              License Plate OCR Engine
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Grayscale normalization, contrast enhancement, text region segmentation & regex validator.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Supported Syntax:</span>
              <span className="text-[#172033] font-semibold">IND Format (HSRP)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Character Confidence:</span>
              <span className="text-[#16A34A] font-semibold">95.8% avg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Observed Latency:</span>
              <span className="text-[#D97706] font-semibold">22.4 ms</span>
            </div>
          </div>
        </div>

        {/* Model 3: Helmet Classifier */}
        <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#EF4444] bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
              HELMET-NET V2
            </span>
            <span className="text-[11px] text-[#16A34A] flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-[#172033]">
              Two-Wheeler Safety Classifier
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Extracts head-region bounding box of riders to detect protective helmet compliance.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Target Class:</span>
              <span className="text-[#172033] font-semibold">Motorcycle Rider</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Accuracy Benchmark:</span>
              <span className="text-[#16A34A] font-semibold">93.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Observed Latency:</span>
              <span className="text-[#16A34A] font-semibold">12.1 ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Threshold Configuration Sliders */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAF0]">
          <Sliders className="w-4 h-4 text-[#1677FF]" />
          <h3 className="font-bold text-sm text-[#172033] uppercase">
            Inference Sensitivity & Decision Gates
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <div className="flex justify-between text-[#172033] font-semibold">
              <span>Vehicle Detection Confidence Threshold</span>
              <span className="text-[#1677FF] font-bold">{(vehConf * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={0.98}
              step={0.02}
              value={vehConf}
              onChange={(e) => setVehConf(Number(e.target.value))}
              className="w-full accent-[#1677FF] cursor-pointer"
            />
            <p className="text-[11px] text-[#64748B]">
              Detections below this score are discarded as background noise.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[#172033] font-semibold">
              <span>ANPR Plate OCR Confidence Threshold</span>
              <span className="text-[#D97706] font-bold">{(ocrConf * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0.6}
              max={0.99}
              step={0.01}
              value={ocrConf}
              onChange={(e) => setOcrConf(Number(e.target.value))}
              className="w-full accent-[#D97706] cursor-pointer"
            />
            <p className="text-[11px] text-[#64748B]">
              Plates with lower OCR character confidence are tagged for manual plate entry.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[#172033] font-semibold">
              <span>Speed Tolerance Buffer (km/h)</span>
              <span className="text-[#EF4444] font-bold">+{speedBuffer} km/h</span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              step={1}
              value={speedBuffer}
              onChange={(e) => setSpeedBuffer(Number(e.target.value))}
              className="w-full accent-[#EF4444] cursor-pointer"
            />
            <p className="text-[11px] text-[#64748B]">
              Statutory calibration buffer added to speed limit before triggering speeding infraction.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[#172033] font-semibold">
              <span>Helmet Detection Decision Gate</span>
              <span className="text-[#16A34A] font-bold">{(helmetGate * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0.6}
              max={0.95}
              step={0.05}
              value={helmetGate}
              onChange={(e) => setHelmetGate(Number(e.target.value))}
              className="w-full accent-[#16A34A] cursor-pointer"
            />
            <p className="text-[11px] text-[#64748B]">
              Confidence threshold required to classify bare head vs certified helmet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
