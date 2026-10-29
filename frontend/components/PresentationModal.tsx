import React, { useState } from 'react';
import {
  Play,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  CreditCard,
  MapPin,
  FileText,
  Award
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface PresentationModalProps {
  onClose: () => void;
  onNavigateToTab: (tab: NavTab) => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  onClose,
  onNavigateToTab,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const slides = [
    {
      title: '1. Executive Overview & Problem Statement',
      badge: 'ARCHITECTURE',
      icon: Award,
      content:
        'Traffic congestion, excessive speeding, red-light violations, and rider safety non-compliance contribute to thousands of avoidable road casualties annually. The Smart Traffic Enforcement Hub provides an autonomous, real-time computer vision and telematics command center that eliminates manual roadside inspection and prevents unfair fines via mandatory Human-in-the-Loop review.',
      highlights: [
        'End-to-End Pipeline: Optical Ingestion → YOLOv8 → EasyOCR → Officer Queue → E-Challan',
        'ISO 39001 Road Traffic Safety Management & ISO 22320 Incident protocols',
        'Designed for City Municipalities, Highway Authorities & State Police Hubs',
      ],
      targetTab: 'dashboard' as NavTab,
      targetActionText: 'View Command Dashboard',
    },
    {
      title: '2. Multi-Class Computer Vision & ANPR OCR',
      badge: 'AI & VISION',
      icon: Cpu,
      content:
        'The ingestion layer runs YOLOv8 for vehicle bounding box localization, centroid tracking for velocity calculation, and EasyOCR with image pre-filtering (CLAHE contrast normalization) to recognize high-security registration plates (HSRP) under challenging weather and night conditions.',
      highlights: [
        'Vehicle Classification: Cars, Buses, Trucks, Motorcycles',
        'ANPR License Plate Segmentation: Over 95% character-level accuracy',
        'Stop-Line Intrusion: Virtual calibration lines trigger only during red signal phases',
      ],
      targetTab: 'live-monitoring' as NavTab,
      targetActionText: 'Open Live AI Detection Suite',
    },
    {
      title: '3. Human-in-the-Loop Officer Verification',
      badge: 'ETHICS & SAFEGUARD',
      icon: ShieldCheck,
      content:
        'Statutory legal standards prevent fully automated debiting or fines without human verification. The platform holds all detected infractions in a cryptographic pending queue. Certified officers inspect the high-resolution evidence frame, review AI confidence ratings, and make the definitive legal determination.',
      highlights: [
        'Full Photographic Evidence: Overlaid with speed telemetry and GPS timestamp',
        'AI Summary Generator: Explains the exact rationale and speed delta',
        'Immutable Audit Trail: Logs officer badge ID, timestamp, and decision reason',
      ],
      targetTab: 'violations' as NavTab,
      targetActionText: 'Inspect Violation Verification Queue',
    },
    {
      title: '4. Electronic Challan & Payment Gateway',
      badge: 'FINANCIAL SETTLEMENT',
      icon: CreditCard,
      content:
        'Once approved, the system generates a standardized electronic challan. Citizens can look up their pending citations and clear payments via integrated simulated UPI (GPay, PhonePe) or card checkout, automatically generating a tamper-proof digital payment receipt.',
      highlights: [
        'Non-Binding Academic Watermark: Prevents misinterpretation of simulated penalties',
        'Instant Reconciliation: Generates TXN-DEMO references and printable receipts',
        'Revenue & Compliance Dashboards: Tracks payment recovery rates across corridors',
      ],
      targetTab: 'fines' as NavTab,
      targetActionText: 'Explore E-Challans & Checkout',
    },
    {
      title: '5. Geospatial Radar & Roadside Hardware Sim',
      badge: 'TELEMETRY & IOT',
      icon: MapPin,
      content:
        'Municipal authorities monitor multi-junction infrastructure via interactive geospatial heatmaps. Roadside hardware simulators allow testing Doppler radar guns, inductive road loops, and signal light controllers under fault conditions to verify system resilience.',
      highlights: [
        'Geospatial Leaflet Radar: Visualizes cameras, high-risk corridor buffers, and flow',
        'Hardware State Injection: Toggle Online, Offline, and Fault states with CAN-Bus telemetry',
        'Comprehensive Audit & System Health: Monitored CPU, memory, and database latencies',
      ],
      targetTab: 'traffic-map' as NavTab,
      targetActionText: 'Inspect Geospatial Map',
    },
  ];

  const s = slides[currentSlide];
  const Icon = s.icon;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl border border-[#E5EAF0] p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677FF]">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1677FF]">
                {s.badge} · SLIDE {currentSlide + 1} OF {slides.length}
              </span>
              <h3 className="font-bold text-sm text-[#172033] mt-1">
                {s.title}
              </h3>
            </div>
          </div>

          <button onClick={onClose} className="text-[#64748B] hover:text-[#172033] text-sm font-semibold cursor-pointer">
            ✕ Exit
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-xs">
          <p className="text-[#172033] leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
            {s.content}
          </p>

          <div className="space-y-2">
            <span className="text-[11px] text-[#64748B] uppercase tracking-wider font-bold">
              Key Evaluation Highlights:
            </span>
            <div className="space-y-2">
              {s.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[#172033]">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action button to jump to relevant tab */}
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
          <span className="text-xs text-[#1677FF] font-medium">
            Live interactive demonstration available in app:
          </span>
          <button
            onClick={() => {
              onNavigateToTab(s.targetTab);
              onClose();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[#1677FF] hover:bg-[#0958d9] text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <span>{s.targetActionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E5EAF0]">
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'bg-[#1677FF] w-6' : 'bg-slate-200 hover:bg-slate-300 w-2'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-[#D9E1EA] hover:bg-slate-50 text-[#172033] text-xs font-semibold disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 inline mr-1 text-[#1677FF]" /> Prev
            </button>

            <button
              onClick={handleNext}
              disabled={currentSlide === slides.length - 1}
              className="px-3.5 py-1.5 rounded-lg bg-[#1677FF] hover:bg-[#0958d9] text-white font-semibold text-xs disabled:opacity-40 cursor-pointer shadow-xs"
            >
              Next <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
