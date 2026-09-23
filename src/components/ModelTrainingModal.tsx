import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Sparkles,
  Layers,
  Sliders,
  CheckCircle2,
  TrendingUp,
  X,
  Play,
  RotateCcw,
  Zap,
  Target,
  Database,
  BarChart3,
  Award
} from 'lucide-react';
import { ModelTrainingConfig, TrainingProgressState } from '../types';

interface ModelTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeployTrainedModel: (modelName: string, mapScore: number) => void;
  isCurrentlyTrained?: boolean;
}

export const ModelTrainingModal: React.FC<ModelTrainingModalProps> = ({
  isOpen,
  onClose,
  onDeployTrainedModel,
  isCurrentlyTrained = false,
}) => {
  // Config State
  const [config, setConfig] = useState<ModelTrainingConfig>({
    dataset: 'CityTraffic-50 Urban Fleet (15,400 frames)',
    backbone: 'yolov8s',
    epochs: 25,
    batchSize: 16,
    learningRate: 0.001,
    imgSize: 640,
    optimizer: 'AdamW',
    autoAnchor: true,
  });

  // Training Execution State
  const [trainingState, setTrainingState] = useState<TrainingProgressState>({
    epoch: 0,
    totalEpochs: 25,
    progress: 0,
    boxLoss: 1.84,
    clsLoss: 2.31,
    dflLoss: 1.45,
    mAP50: 0.914,
    mAP50_95: 0.762,
    precision: 0.892,
    recall: 0.865,
    status: isCurrentlyTrained ? 'COMPLETED' : 'IDLE',
  });

  const [epochLogs, setEpochLogs] = useState<
    Array<{ epoch: number; boxLoss: string; clsLoss: string; mAP: string }>
  >([]);

  // Simulator interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (trainingState.status === 'TRAINING') {
      timer = setInterval(() => {
        setTrainingState((prev) => {
          const nextEpoch = prev.epoch + 1;
          const ratio = nextEpoch / config.epochs;
          const progress = Math.min(100, Math.round(ratio * 100));

          // Loss descent curve simulation
          const newBoxLoss = Math.max(0.18, 1.84 - (1.84 - 0.22) * Math.pow(ratio, 0.7));
          const newClsLoss = Math.max(0.12, 2.31 - (2.31 - 0.16) * Math.pow(ratio, 0.7));
          const newDflLoss = Math.max(0.35, 1.45 - (1.45 - 0.42) * Math.pow(ratio, 0.65));

          // Accuracy ascent curve simulation
          const newMap50 = Math.min(0.988, 0.914 + (0.988 - 0.914) * Math.pow(ratio, 0.6));
          const newMap50_95 = Math.min(0.895, 0.762 + (0.895 - 0.762) * Math.pow(ratio, 0.65));
          const newPrecision = Math.min(0.978, 0.892 + (0.978 - 0.892) * Math.pow(ratio, 0.6));
          const newRecall = Math.min(0.965, 0.865 + (0.965 - 0.865) * Math.pow(ratio, 0.65));

          setEpochLogs((logs) => [
            {
              epoch: nextEpoch,
              boxLoss: newBoxLoss.toFixed(4),
              clsLoss: newClsLoss.toFixed(4),
              mAP: `${(newMap50 * 100).toFixed(1)}%`,
            },
            ...logs.slice(0, 7),
          ]);

          if (nextEpoch >= config.epochs) {
            clearInterval(timer);
            return {
              ...prev,
              epoch: config.epochs,
              progress: 100,
              boxLoss: 0.224,
              clsLoss: 0.158,
              dflLoss: 0.412,
              mAP50: 0.988,
              mAP50_95: 0.895,
              precision: 0.978,
              recall: 0.965,
              status: 'COMPLETED',
            };
          }

          return {
            ...prev,
            epoch: nextEpoch,
            progress,
            boxLoss: newBoxLoss,
            clsLoss: newClsLoss,
            dflLoss: newDflLoss,
            mAP50: newMap50,
            mAP50_95: newMap50_95,
            precision: newPrecision,
            recall: newRecall,
          };
        });
      }, 140);
    }

    return () => clearInterval(timer);
  }, [trainingState.status, config.epochs]);

  if (!isOpen) return null;

  const handleStartTraining = () => {
    setEpochLogs([]);
    setTrainingState({
      epoch: 0,
      totalEpochs: config.epochs,
      progress: 0,
      boxLoss: 1.84,
      clsLoss: 2.31,
      dflLoss: 1.45,
      mAP50: 0.914,
      mAP50_95: 0.762,
      precision: 0.892,
      recall: 0.865,
      status: 'TRAINING',
    });
  };

  const handleDeploy = () => {
    onDeployTrainedModel(
      `YOLOv8-${config.backbone.toUpperCase()}-Trained-CustomTraffic`,
      trainingState.mAP50
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E5EAF0] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E5EAF0] flex items-center justify-between bg-gradient-to-r from-white via-blue-50/20 to-indigo-50/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1677FF] text-white flex items-center justify-center shadow-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#172033]">
                  YOLOv8 Traffic Model Fine-Tuning & Anchor Calibration
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1677FF] border border-blue-200">
                  TRAINING STUDIO
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Train deep neural weights on vehicle classes and micro-level license plate contours for accurate bounding boxes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 1. TRAINING PARAMETERS GRID */}
          <div className="bg-[#F8FAFC] border border-[#E5EAF0] p-4 rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5EAF0]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#1677FF]" />
                <span className="text-xs font-bold text-[#172033] uppercase tracking-wide">
                  Model Architecture & Dataset Configuration
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#64748B]">
                Optimizer: {config.optimizer} · Resolution: {config.imgSize}x{config.imgSize}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Backbone Selector */}
              <div>
                <label className="block text-[#64748B] font-medium mb-1">Architecture Backbone</label>
                <select
                  disabled={trainingState.status === 'TRAINING'}
                  value={config.backbone}
                  onChange={(e) => setConfig({ ...config, backbone: e.target.value as any })}
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-semibold text-[#172033]"
                >
                  <option value="yolov8n">YOLOv8 Nano (Fastest, 3.2M params)</option>
                  <option value="yolov8s">YOLOv8 Small (Optimal, 11.2M params)</option>
                  <option value="yolov8m">YOLOv8 Medium (High Acc, 25.9M params)</option>
                </select>
              </div>

              {/* Dataset Selector */}
              <div>
                <label className="block text-[#64748B] font-medium mb-1">Target Training Dataset</label>
                <select
                  disabled={trainingState.status === 'TRAINING'}
                  value={config.dataset}
                  onChange={(e) => setConfig({ ...config, dataset: e.target.value })}
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-semibold text-[#172033]"
                >
                  <option value="CityTraffic-50 Urban Fleet (15,400 frames)">CityTraffic-50 Fleet (15,400 frames)</option>
                  <option value="Expressway High-Speed Corridor (12,800 frames)">Expressway Corridor (12,800 frames)</option>
                  <option value="Smart ANPR HSRP License Plate Fleet (22,000 plates)">Smart ANPR HSRP (22,000 plates)</option>
                  <option value="Multi-Junction Mixed Traffic Fleet (Current Ingestion)">Current Ingestion Stream Fleet</option>
                </select>
              </div>

              {/* Epochs Selector */}
              <div>
                <label className="block text-[#64748B] font-medium mb-1">Training Epochs</label>
                <select
                  disabled={trainingState.status === 'TRAINING'}
                  value={config.epochs}
                  onChange={(e) => {
                    const ep = Number(e.target.value);
                    setConfig({ ...config, epochs: ep });
                    setTrainingState((prev) => ({ ...prev, totalEpochs: ep }));
                  }}
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-semibold text-[#172033]"
                >
                  <option value={10}>10 Epochs (Quick Test - ~2s)</option>
                  <option value={25}>25 Epochs (Recommended - ~4s)</option>
                  <option value={50}>50 Epochs (High Accuracy - ~7s)</option>
                  <option value={100}>100 Epochs (Full Convergence)</option>
                </select>
              </div>

              {/* Learning Rate & Batch */}
              <div>
                <label className="block text-[#64748B] font-medium mb-1">Batch Size & LR</label>
                <select
                  disabled={trainingState.status === 'TRAINING'}
                  value={config.batchSize}
                  onChange={(e) => setConfig({ ...config, batchSize: Number(e.target.value) })}
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-semibold text-[#172033]"
                >
                  <option value={8}>Batch 8 · LR 0.001</option>
                  <option value={16}>Batch 16 · LR 0.001 (Recommended)</option>
                  <option value={32}>Batch 32 · LR 0.0005</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. REAL-TIME TRAINING PROGRESS & LOSS GAUGES */}
          <div className="bg-white border border-[#E5EAF0] p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1677FF]" />
                <h4 className="font-bold text-sm text-[#172033]">
                  Loss Convergence & Precision Telemetry
                </h4>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {trainingState.status === 'TRAINING' && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1677FF] font-semibold animate-pulse border border-blue-200">
                    <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-ping" />
                    Optimizing Gradient Descending... Epoch [{trainingState.epoch} / {config.epochs}]
                  </span>
                )}
                {trainingState.status === 'COMPLETED' && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#16A34A] font-semibold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Converged at Epoch {config.epochs} · mAP50: {(trainingState.mAP50 * 100).toFixed(1)}%
                  </span>
                )}
                {trainingState.status === 'IDLE' && (
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-[#64748B] font-semibold">
                    Ready to Train
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#172033]">
                <span>Training Progress</span>
                <span>{trainingState.progress}%</span>
              </div>
              <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-150 ${
                    trainingState.status === 'COMPLETED'
                      ? 'bg-[#16A34A]'
                      : 'bg-gradient-to-r from-[#1677FF] to-blue-400'
                  }`}
                  style={{ width: `${trainingState.progress}%` }}
                />
              </div>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0]">
                <span className="text-[#64748B] font-medium block">Bounding Box Loss (box_loss)</span>
                <div className="text-xl font-bold text-[#172033] mt-1 font-mono">
                  {trainingState.boxLoss.toFixed(3)}
                </div>
                <span className="text-[10px] text-[#16A34A] font-semibold block mt-0.5">
                  ↓ {((1.84 - trainingState.boxLoss) / 1.84 * 100).toFixed(0)}% regression error
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0]">
                <span className="text-[#64748B] font-medium block">Classification Loss (cls_loss)</span>
                <div className="text-xl font-bold text-[#172033] mt-1 font-mono">
                  {trainingState.clsLoss.toFixed(3)}
                </div>
                <span className="text-[10px] text-[#16A34A] font-semibold block mt-0.5">
                  ↓ {((2.31 - trainingState.clsLoss) / 2.31 * 100).toFixed(0)}% class error
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0]">
                <span className="text-[#64748B] font-medium block">mAP@0.5 (Mean Avg Precision)</span>
                <div className="text-xl font-bold text-[#1677FF] mt-1 font-mono">
                  {(trainingState.mAP50 * 100).toFixed(1)}%
                </div>
                <span className="text-[10px] text-[#1677FF] font-semibold block mt-0.5">
                  ↑ High precision box detection
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0]">
                <span className="text-[#64748B] font-medium block">ANPR Plate Accuracy</span>
                <div className="text-xl font-bold text-[#16A34A] mt-1 font-mono">
                  {(trainingState.precision * 100).toFixed(1)}%
                </div>
                <span className="text-[10px] text-[#16A34A] font-semibold block mt-0.5">
                  ↑ Enhanced contour anchors
                </span>
              </div>
            </div>

            {/* Epoch Logs Table */}
            {epochLogs.length > 0 && (
              <div className="pt-2 border-t border-[#E5EAF0]">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">
                  Live Epoch Convergence Log
                </span>
                <div className="bg-[#0F172A] rounded-xl p-3 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
                  {epochLogs.map((log) => (
                    <div key={log.epoch} className="flex items-center gap-4">
                      <span className="text-blue-400">Epoch [{log.epoch.toString().padStart(2, '0')}/{config.epochs}]</span>
                      <span>box_loss: <strong className="text-emerald-400">{log.boxLoss}</strong></span>
                      <span>cls_loss: <strong className="text-amber-400">{log.clsLoss}</strong></span>
                      <span>val mAP@0.5: <strong className="text-cyan-400">{log.mAP}</strong></span>
                      <span className="text-slate-500">· lr: 0.001</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. BEFORE vs AFTER TRAINING COMPARISON */}
          <div className="bg-gradient-to-r from-blue-50/50 via-white to-emerald-50/50 border border-[#E5EAF0] p-5 rounded-xl">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#172033] mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#1677FF]" />
              Expected Detection Accuracy Enhancement:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white rounded-lg border border-[#E5EAF0] shadow-2xs">
                <span className="font-bold text-[#172033] block">Tight Bounding Box Contours</span>
                <p className="text-[#64748B] text-[11px] mt-1">
                  Custom auto-anchors reduce background padding by <strong>74%</strong>. Boxes fit exactly to car, truck, and bike edges.
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#E5EAF0] shadow-2xs">
                <span className="font-bold text-[#172033] block">Dedicated Number Plate Sub-Boxes</span>
                <p className="text-[#64748B] text-[11px] mt-1">
                  Trains secondary regression anchor on vehicle bumper plates. Detects number plates even when no violation occurs!
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#E5EAF0] shadow-2xs">
                <span className="font-bold text-[#172033] block">Instant On-Canvas Telemetry</span>
                <p className="text-[#64748B] text-[11px] mt-1">
                  Immediately renders vehicle type, tracking ID, speed, and statutory violation tags right there on the screen.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-[#E5EAF0] flex items-center justify-between bg-[#F8FAFC]">
          <button
            onClick={onClose}
            className="btn-3d btn-3d-secondary px-4 py-2 text-xs font-semibold"
          >
            Close
          </button>

          <div className="flex items-center gap-3">
            {trainingState.status === 'IDLE' && (
              <button
                onClick={handleStartTraining}
                className="btn-3d btn-3d-primary px-5 py-2.5 text-xs font-semibold flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Model Training ({config.epochs} Epochs)</span>
              </button>
            )}

            {trainingState.status === 'TRAINING' && (
              <button
                disabled
                className="btn-3d btn-3d-primary px-5 py-2.5 text-xs font-semibold opacity-60 flex items-center gap-2 cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Training in progress ({trainingState.progress}%)...</span>
              </button>
            )}

            {trainingState.status === 'COMPLETED' && (
              <>
                <button
                  onClick={handleStartTraining}
                  className="btn-3d btn-3d-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-Train</span>
                </button>

                <button
                  onClick={handleDeploy}
                  className="btn-3d btn-3d-success px-5 py-2.5 text-xs font-semibold flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Deploy Trained Weights ({(trainingState.mAP50 * 100).toFixed(1)}% mAP)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
