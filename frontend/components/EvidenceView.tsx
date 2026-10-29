import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Eye,
  Camera,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  ZoomIn,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import { Violation } from '../types';

interface EvidenceViewProps {
  violations: Violation[];
  onInspectViolation: (violation: Violation) => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  violations,
  onInspectViolation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [previewViolation, setPreviewViolation] = useState<Violation | null>(null);

  const filtered = violations.filter((v) => {
    const matchesQuery =
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.violationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || v.violationType === selectedType;
    return matchesQuery && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5EAF0]">
        <div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">
            Forensic Evidence Repository
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Tamper-evident photographic & trajectory records linked to automated infraction notices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#1677FF] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
            Indexed Records: <strong>{violations.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E5EAF0] rounded-xl p-4 shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Plate Number, Violation ID, Location..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#D9E1EA] rounded-lg text-xs text-[#172033] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1677FF] transition-colors"
          />
        </div>

        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg">
          {['ALL', 'SPEEDING', 'RED_LIGHT', 'NO_HELMET', 'STOP_LINE'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedType === type
                  ? 'bg-[#1677FF] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              {type === 'ALL' ? 'All Evidences' : type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E5EAF0] hover:border-[#1677FF] rounded-xl overflow-hidden group transition-all flex flex-col shadow-[0_2px_8px_rgba(15,23,42,0.05)] hover:shadow-[0_4px_16px_rgba(22,119,255,0.08)]"
          >
            {/* Image Preview with Bounding Box Overlay */}
            <div
              className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer"
              onClick={() => setPreviewViolation(item)}
            >
              <img
                src={item.evidenceImage}
                alt={item.violationId}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />

              {/* Status & Type Indicators */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 text-[11px] font-mono">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EF4444] text-white font-semibold">
                  {item.violationType}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-black/75 text-cyan-300 border border-slate-700">
                  CONF: {(item.confidence * 100).toFixed(0)}%
                </span>
              </div>

              {/* Plate and Speed banner at bottom */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-black/85 text-amber-300 font-bold border border-amber-500/40">
                  {item.plateNumber}
                </span>
                {item.detectedSpeed ? (
                  <span className="px-2 py-0.5 rounded bg-rose-950/90 text-rose-300 border border-rose-500/50">
                    {item.detectedSpeed} km/h
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-black/75 text-slate-300 border border-slate-700">
                    Stop Line
                  </span>
                )}
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677FF] text-white font-semibold text-xs shadow-md">
                  <ZoomIn className="w-4 h-4" /> Expand Forensic View
                </span>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>ID:</span>
                  <span className="text-[#172033] font-semibold">{item.violationId}</span>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Node:</span>
                  <span className="text-[#172033]">{item.cameraId} ({item.location.split(' ')[0]})</span>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Logged:</span>
                  <span className="text-[#172033]">{item.timestamp}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5EAF0] flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                    item.status === 'CONFIRMED'
                      ? 'text-[#EF4444]'
                      : item.status === 'PAID'
                      ? 'text-[#16A34A]'
                      : 'text-[#D97706]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {item.status.replace('_', ' ')}
                </span>

                <button
                  onClick={() => onInspectViolation(item)}
                  className="px-3 py-1 rounded-lg bg-white hover:bg-blue-50 text-[#1677FF] border border-[#1677FF] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Open Dossier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Forensic Zoom Modal */}
      {previewViolation && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5EAF0] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#E5EAF0] flex items-center justify-between bg-[#F8FAFC]">
              <div>
                <h3 className="font-bold text-[#172033] text-sm">
                  FORENSIC CAPTURE · {previewViolation.violationId}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {previewViolation.location} · {previewViolation.timestamp}
                </p>
              </div>
              <button
                onClick={() => setPreviewViolation(null)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-100 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 flex flex-col items-center">
              <div className="relative max-h-[60vh] rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                <img
                  src={previewViolation.evidenceImage}
                  alt={previewViolation.violationId}
                  className="max-h-[60vh] w-auto object-contain"
                />
                {/* Plate Forensic Callout */}
                <div className="absolute bottom-4 right-4 bg-black/90 p-2.5 rounded-lg border border-amber-500/40 shadow-xl text-xs font-mono">
                  <div className="text-[10px] text-slate-400">EXTRACTED PLATE</div>
                  <div className="text-amber-300 font-bold text-sm">{previewViolation.plateNumber}</div>
                  <div className="text-[10px] text-cyan-400">OCR CONF: {(previewViolation.confidence * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E5EAF0] flex items-center justify-between bg-white">
              <div className="text-xs text-[#64748B]">
                Statutory Evidence Record SHA-256 Verified
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const v = previewViolation;
                    setPreviewViolation(null);
                    onInspectViolation(v);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#1677FF] hover:bg-[#0958d9] text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Review Infraction →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
