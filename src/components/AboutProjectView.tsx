import React from 'react';
import {
  HelpCircle,
  ShieldCheck,
  Cpu,
  Layers,
  Award,
  BookOpen,
  CheckCircle2,
  Terminal,
  FileCode2,
  ExternalLink
} from 'lucide-react';

interface AboutProjectViewProps {
  onOpenPythonCode: () => void;
}

export const AboutProjectView: React.FC<AboutProjectViewProps> = ({ onOpenPythonCode }) => {
  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677FF]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-[#172033] tracking-tight">
              Smart Traffic Enforcement & Intelligent ANPR System
            </h2>
            <p className="text-xs text-[#1677FF] font-medium">
              Autonomous Multimodal Computer Vision, Road Safety Telemetry & Digital Challan Command Center
            </p>
          </div>
        </div>

        <p className="text-xs text-[#64748B] leading-relaxed pt-2 border-t border-[#E5EAF0]">
          This system represents a comprehensive smart city platform designed to enforce traffic regulations, automate Automatic Number Plate Recognition (ANPR), quantify corridor velocity risks, and streamline statutory human review before digital penalty notice issuance.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] p-5 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677FF]">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-[#172033]">
            Computer Vision Architecture
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Real-time multi-class object detection using YOLOv8, high-accuracy license plate character segmentation using EasyOCR, and spatial stop-line trajectory calibration.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] p-5 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-[#172033]">
            Human-in-the-Loop Safeguard
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            AI models generate candidate infraction packets with photographic evidence, requiring certified enforcement officers to inspect and approve before statutory digital dispatch.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] p-5 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#16A34A]">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-[#172033]">
            Full-Stack Engineering
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            FastAPI RESTful backend in Python with SQLAlchemy ORM, cryptographic audit logging, mock payment gateway reconciliation, and a React TypeScript dashboard.
          </p>
        </div>
      </div>

      {/* Viva / Defense Talking Points */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#1677FF]" />
            <h3 className="font-bold text-sm text-[#172033] uppercase">
              Academic Presentation & Project Defense Guide
            </h3>
          </div>

          <button
            onClick={onOpenPythonCode}
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#1677FF] border border-[#1677FF] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Inspect Python Backend Files</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-2">
            <h4 className="font-bold text-[#172033] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              1. Optical Character Recognition (OCR) Robustness
            </h4>
            <p className="text-[#64748B] leading-relaxed">
              Demonstrates CLAHE (Contrast Limited Adaptive Histogram Equalization) and perspective transforms to read Indian HSRP plates under uneven highway illumination and angles.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-2">
            <h4 className="font-bold text-[#172033] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              2. Trajectory Calibration & False Positive Mitigation
            </h4>
            <p className="text-[#64748B] leading-relaxed">
              Virtual bounding lines compute frame-to-frame pixel displacement against physical road landmarks to avoid false triggers caused by shadows or pedestrian crossings.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-2">
            <h4 className="font-bold text-[#172033] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              3. Standards Compliance (ISO 39001 & ISO 22320)
            </h4>
            <p className="text-[#64748B] leading-relaxed">
              Designed according to international road traffic safety management standards and incident response protocols, ensuring data integrity and chain-of-custody for court evidence.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-2">
            <h4 className="font-bold text-[#172033] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              4. Payment Reconciliation & Non-Binding Notice Notice
            </h4>
            <p className="text-[#64748B] leading-relaxed">
              Integrates simulated UPI and card settlement webhooks, generating cryptographic transaction receipts while maintaining academic transparency that notices are non-binding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
