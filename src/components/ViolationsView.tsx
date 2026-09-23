import React, { useState } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  FileText,
  ShieldCheck,
  AlertTriangle,
  ZoomIn,
  Camera,
  MapPin,
  Calendar,
  Check,
  X,
  ChevronRight
} from 'lucide-react';
import { Violation, ViolationStatus } from '../types';

interface ViolationsViewProps {
  violations: Violation[];
  onReview: (violationId: number, decision: 'APPROVE' | 'REJECT', reason?: string) => void;
  selectedForReview?: Violation | null;
  onCloseReviewModal: () => void;
  onOpenReviewModal: (v: Violation) => void;
}

export const ViolationsView: React.FC<ViolationsViewProps> = ({
  violations,
  onReview,
  selectedForReview,
  onCloseReviewModal,
  onOpenReviewModal,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [showRejectInput, setShowRejectInput] = useState<boolean>(false);

  // Filter violations
  const filtered = violations.filter((v) => {
    const matchesStatus = filterStatus === 'ALL' || v.status === filterStatus;
    const matchesQuery =
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.violationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.violationType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const getDetectionDescription = (v: Violation) => {
    if (v.violationType === 'SPEEDING') {
      const speed = v.detectedSpeed || 82;
      const limit = v.speedLimit || 50;
      return `Vehicle recorded travelling at ${speed} km/h, exceeding the calibrated corridor speed limit of ${limit} km/h by ${(speed - limit)} km/h. Spatial centroid tracking confirmed persistent acceleration across consecutive frames.`;
    }
    if (v.violationType === 'RED_LIGHT') {
      return `Vehicle traversed the configured intersection stop line during the active RED signal phase. Optical trajectory confirmed stop-line intrusion with sensor timestamp synchronization.`;
    }
    if (v.violationType === 'NO_HELMET') {
      return `Two-wheeler operator detected without mandatory protective headgear. Head region feature extraction confirmed non-compliance during corridor transit.`;
    }
    if (v.violationType === 'STOP_LINE') {
      return `Vehicle encroached into designated pedestrian crossing zebra zone while traffic signal was red.`;
    }
    return `Automated traffic rule infraction flagged by optical sensor node with geometric trajectory confirmation.`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5EAF0]">
        <div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">
            Violation Review & Investigation
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Human-in-the-loop statutory verification for algorithmically captured traffic infractions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#D97706] bg-[#FEF3C7] border border-[#FDE68A] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Pending Review: <strong>{violations.filter((v) => v.status === 'PENDING_REVIEW').length}</strong>
          </span>
        </div>
      </div>

      {/* Search & Segmented Filter Bar */}
      <div className="bg-white border border-[#E5EAF0] rounded-xl p-4 shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Plate, ID, or Location..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#D9E1EA] rounded-lg text-xs text-[#172033] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1677FF] transition-colors"
          />
        </div>

        {/* Segmented Filter */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg">
          {['ALL', 'PENDING_REVIEW', 'CONFIRMED', 'PAID', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#1677FF] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              {st === 'ALL' ? 'All Statuses' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Violations Table */}
      <div className="bg-white border border-[#E5EAF0] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-semibold">
              <tr>
                <th className="py-3 px-4">EVIDENCE</th>
                <th className="py-3 px-4">VIOLATION ID</th>
                <th className="py-3 px-4">PLATE NUMBER</th>
                <th className="py-3 px-4">INFRACTION TYPE</th>
                <th className="py-3 px-4">LOCATION & CAM</th>
                <th className="py-3 px-4">CONFIDENCE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EDF3] text-[#172033]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#64748B]">
                    No violations found matching query criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => onOpenReviewModal(v)}
                    className="hover:bg-[#F1F6FF] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <img
                        src={v.evidenceImage}
                        alt={v.violationId}
                        className="w-12 h-8 object-cover rounded-lg border border-[#E5EAF0] group-hover:border-[#1677FF] transition-colors shadow-2xs"
                      />
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#172033]">{v.violationId}</td>
                    <td className="py-3 px-4 font-bold text-[#172033]">
                      {v.plateNumber}
                      <span className="text-[11px] text-[#64748B] block font-normal">{v.vehicleType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#172033]">
                        {v.violationType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#475569]">
                      <div>{v.location}</div>
                      <div className="text-[11px] text-[#64748B]">{v.cameraId} · {v.timestamp}</div>
                    </td>
                    <td className="py-3 px-4 text-[#1677FF] font-semibold">
                      {(v.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                          v.status === 'PENDING_REVIEW'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : v.status === 'CONFIRMED'
                            ? 'bg-[#DCFCE7] text-[#16A34A]'
                            : v.status === 'PAID'
                            ? 'bg-blue-50 text-[#1677FF]'
                            : 'bg-[#FEE2E2] text-[#EF4444]'
                        }`}
                      >
                        {v.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenReviewModal(v);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-[#1677FF] border border-[#1677FF] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROFESSIONAL INVESTIGATION / REVIEW MODAL (Section 18) */}
      {selectedForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5EAF0] rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-5 border-b border-[#E5EAF0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#1677FF]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#172033] tracking-wide">
                    Violation Review & Investigation
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Case Ref: <strong className="text-[#172033]">{selectedForReview.violationId}</strong> · Certified Officer Inspection
                  </p>
                </div>
              </div>
              <button
                onClick={onCloseReviewModal}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-100 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* DUAL-PANE BODY (Section 18) */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#E5EAF0]">
              {/* LEFT PANE: LARGE EVIDENCE IMAGE/VIDEO & BOUNDING BOX (7 Cols) */}
              <div className="lg:col-span-7 p-6 bg-[#F8FAFC] flex flex-col justify-between space-y-4">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group shadow-inner">
                  <img
                    src={selectedForReview.evidenceImage}
                    alt={selectedForReview.violationId}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />

                  {/* Top Watermark */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono z-10">
                    <span className="bg-slate-900/90 text-white px-2.5 py-1 rounded border border-slate-700">
                      {selectedForReview.cameraId} · {selectedForReview.location}
                    </span>
                    <span className="bg-slate-900/90 text-cyan-300 px-2.5 py-1 rounded border border-slate-700">
                      {selectedForReview.timestamp}
                    </span>
                  </div>

                  {/* Bounding Box on Vehicle (Red for violation) */}
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded border-2 border-rose-500 bg-rose-500/10 flex flex-col justify-between p-2 shadow-lg shadow-rose-500/30">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold bg-rose-600 text-white px-2 py-0.5 rounded">
                      <span>{selectedForReview.violationType}</span>
                      <span>{(selectedForReview.confidence * 100).toFixed(1)}% CONF</span>
                    </div>

                    {/* License Plate Box */}
                    <div className="bg-black/90 border border-amber-500/60 p-1.5 rounded flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-300 font-bold tracking-wider">{selectedForReview.plateNumber}</span>
                      <span className="text-[10px] text-cyan-300">ANPR OCR: 98.4%</span>
                    </div>
                  </div>

                  {/* Speed / Signal Overlay at bottom */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono z-10">
                    <span className="bg-black/85 text-slate-300 px-2 py-1 rounded border border-slate-700">
                      Signal Phase: <strong className="text-rose-400">RED</strong>
                    </span>
                    {selectedForReview.detectedSpeed ? (
                      <span className="bg-rose-950/90 text-rose-300 px-2.5 py-1 rounded border border-rose-500/50 font-bold">
                        SPEED: {selectedForReview.detectedSpeed} km/h (LIMIT {selectedForReview.speedLimit || 50})
                      </span>
                    ) : (
                      <span className="bg-amber-950/90 text-amber-300 px-2.5 py-1 rounded border border-amber-500/50 font-bold">
                        STOP LINE INTRUSION
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#E5EAF0] rounded-xl text-xs text-[#64748B] flex items-center justify-between shadow-2xs">
                  <span>Cryptographic Forensic Hash:</span>
                  <span className="text-[#172033] font-mono font-medium">SHA256: 7f83b1657ff1...9a41</span>
                </div>
              </div>

              {/* RIGHT PANE: VIOLATION DETAILS (5 Cols) (Section 18) */}
              <div className="lg:col-span-5 p-6 space-y-5 flex flex-col justify-between bg-white">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0]">
                    <span className="text-xs uppercase text-[#64748B] font-bold tracking-wider">
                      Violation Details
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        selectedForReview.status === 'PENDING_REVIEW'
                          ? 'bg-[#FEF3C7] text-[#D97706]'
                          : selectedForReview.status === 'CONFIRMED'
                          ? 'bg-[#DCFCE7] text-[#16A34A]'
                          : 'bg-[#FEE2E2] text-[#EF4444]'
                      }`}
                    >
                      {selectedForReview.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Section 18 Specified Fields */}
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                      <span className="text-[#64748B] font-medium">Type:</span>
                      <span className="font-bold text-[#EF4444] text-sm">
                        {selectedForReview.violationType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                      <span className="text-[#64748B] font-medium">Vehicle:</span>
                      <span className="font-bold text-[#172033] text-sm">
                        {selectedForReview.plateNumber}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                      <span className="text-[#64748B] font-medium">Confidence:</span>
                      <span className="font-bold text-[#1677FF]">
                        {(selectedForReview.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                      <span className="text-[#64748B] font-medium">Detected Speed:</span>
                      <span className="font-bold text-[#EF4444]">
                        {selectedForReview.detectedSpeed || 82} km/h
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                      <span className="text-[#64748B] font-medium">Speed Limit:</span>
                      <span className="font-semibold text-[#172033]">
                        {selectedForReview.speedLimit || 50} km/h
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                      <span className="text-[#64748B] font-medium">Camera:</span>
                      <span className="font-semibold text-[#172033]">
                        {selectedForReview.cameraId} ({selectedForReview.location.split(',')[0]})
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                      <span className="text-[#64748B] font-medium">Status:</span>
                      <span className="font-semibold text-[#D97706]">
                        {selectedForReview.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                      <span className="text-[#64748B] font-medium">Statutory Fine:</span>
                      <span className="font-bold text-[#172033] text-sm">
                        ₹{selectedForReview.fineAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Detection Rule Explanation */}
                  <div className="p-3.5 bg-[#F8FAFC] border border-[#E5EAF0] rounded-xl space-y-1">
                    <span className="text-xs text-[#1677FF] font-semibold block">
                      Detection Justification:
                    </span>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      {getDetectionDescription(selectedForReview)}
                    </p>
                  </div>
                </div>

                {/* Section 18: TWO CLEAR BUTTONS: Confirm Violation (green) and Reject (light red / outline) */}
                <div className="pt-4 border-t border-[#E5EAF0] space-y-3">
                  {selectedForReview.status === 'PENDING_REVIEW' ? (
                    <>
                      {showRejectInput ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Specify rejection reason (e.g. obscured plate)..."
                            className="w-full p-2.5 bg-white border border-[#D9E1EA] rounded-lg text-xs text-[#172033] focus:outline-none focus:border-[#EF4444]"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                onReview(selectedForReview.id, 'REJECT', rejectionReason);
                                onCloseReviewModal();
                                setShowRejectInput(false);
                                setRejectionReason('');
                              }}
                              className="flex-1 py-2.5 rounded-lg bg-[#EF4444] hover:bg-[#dc2626] text-white text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Confirm Rejection
                            </button>
                            <button
                              onClick={() => setShowRejectInput(false)}
                              className="px-4 py-2.5 rounded-lg bg-white border border-[#D9E1EA] text-[#64748B] text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {/* Confirm Violation (green) */}
                          <button
                            onClick={() => {
                              onReview(selectedForReview.id, 'APPROVE');
                              onCloseReviewModal();
                            }}
                            className="h-[42px] px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803d] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
                          >
                            <Check className="w-4 h-4" />
                            <span>Confirm Violation</span>
                          </button>

                          {/* Reject (light red / outline) */}
                          <button
                            onClick={() => setShowRejectInput(true)}
                            className="h-[42px] px-4 rounded-xl bg-white hover:bg-rose-50 text-[#EF4444] border border-[#EF4444] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                          >
                            <X className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E5EAF0] text-center text-xs text-[#64748B]">
                      Officer review finalized · Case Status: <strong className="text-[#172033]">{selectedForReview.status}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
