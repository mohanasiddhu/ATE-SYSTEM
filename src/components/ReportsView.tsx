import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  FileText,
  BarChart,
  ShieldCheck
} from 'lucide-react';
import { Violation } from '../types';

interface ReportsViewProps {
  violations: Violation[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ violations }) => {
  const [reportType, setReportType] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const totalViolations = violations.length;
  const confirmed = violations.filter((v) => v.status === 'CONFIRMED' || v.status === 'FINE_GENERATED' || v.status === 'PAID').length;
  const paidCount = violations.filter((v) => v.status === 'PAID').length;
  const totalRevenue = violations.filter((v) => v.status === 'PAID').reduce((sum, v) => sum + v.fineAmount, 0) + 142500;

  // Real CSV Download
  const handleExportCSV = () => {
    const headers = [
      'Violation ID',
      'Plate Number',
      'Infraction Type',
      'Camera ID',
      'Location',
      'Recorded Speed (km/h)',
      'Speed Limit',
      'AI Confidence (%)',
      'Status',
      'Fine Amount (INR)',
    ];

    const rows = violations.map((v) => [
      v.violationId,
      v.plateNumber,
      v.violationType,
      v.cameraId,
      `"${v.location}"`,
      v.detectedSpeed || 'N/A',
      v.speedLimit || 'N/A',
      (v.confidence * 100).toFixed(1),
      v.status,
      v.fineAmount,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Traffic_Enforcement_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-[#172033]">
            Official Traffic Enforcement Reports & Export Hub
          </h2>
          <p className="text-xs text-[#64748B]">
            Automated Audit Documentation, Statutory CSV Exports & Printable Department Summaries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803d] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Dataset</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-[#172033] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-[#D9E1EA] shadow-2xs"
          >
            <Printer className="w-4 h-4 text-[#1677FF]" />
            <span>Generate Printable PDF</span>
          </button>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
          <span className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">Total Vehicles Monitored</span>
          <p className="text-2xl font-bold text-[#172033] mt-2">2,841</p>
          <span className="text-xs text-[#16A34A] font-medium mt-1 block">95.0% compliance rate</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
          <span className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">Recorded Infractions</span>
          <p className="text-2xl font-bold text-[#EF4444] mt-2">{totalViolations}</p>
          <span className="text-xs text-[#D97706] font-medium mt-1 block">{confirmed} verified by officers</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
          <span className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">Settled Challans</span>
          <p className="text-2xl font-bold text-[#16A34A] mt-2">{paidCount}</p>
          <span className="text-xs text-[#64748B] font-medium mt-1 block">Electronic settlements</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
          <span className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">Total Demo Revenue</span>
          <p className="text-2xl font-bold text-[#1677FF] mt-2">₹{totalRevenue.toLocaleString()}</p>
          <span className="text-xs text-[#94A3B8] font-medium mt-1 block">Non-binding demo ledger</span>
        </div>
      </div>

      {/* Executive Summary Preview Box */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0]">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#1677FF]" />
            <h3 className="font-bold text-sm text-[#172033] uppercase">
              Executive Daily Audit Summary Preview
            </h3>
          </div>
          <span className="text-[#94A3B8] font-mono">REF: DOC-TRAFFIC-{new Date().getFullYear()}-09</span>
        </div>

        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-3 leading-relaxed text-[#172033]">
          <p>
            <strong>1. Operational Influx:</strong> Over the active 24-hour observation cycle across all 6 surveillance corridors, automated computer vision nodes captured 2,841 vehicle trajectories with an overall road compliance rating of 95.0%.
          </p>
          <p>
            <strong>2. Infraction Breakdown:</strong> 142 total candidates were flagged for statutory infractions. Overspeeding was the predominant hazard (34% of cases), with the highest concentration recorded at Mahatma Gandhi Expressway Pier 42 (Camera CAM-02).
          </p>
          <p>
            <strong>3. Statutory Officer Oversight:</strong> 100% of candidate infractions were routed through the Human-in-the-Loop review queue prior to fine notice generation in adherence with ISO 39001 and ISO 22320 guidelines.
          </p>
        </div>
      </div>

      {/* PRINTABLE REPORT MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl border border-[#E5EAF0] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0]">
              <h3 className="font-bold text-sm text-[#172033] uppercase">
                Departmental Audit Report
              </h3>
              <button onClick={() => setShowPrintModal(false)} className="text-[#64748B] hover:text-[#172033]">
                ✕
              </button>
            </div>

            {/* Document sheet */}
            <div className="p-6 bg-[#F8FAFC] text-[#172033] rounded-xl border border-[#E5EAF0] text-xs space-y-4">
              <div className="border-b-2 border-[#172033] pb-3 text-center">
                <h2 className="font-bold text-base uppercase">STATE TRAFFIC REGULATORY AUTHORITY</h2>
                <h3 className="text-xs text-[#64748B]">INTELLIGENT ENFORCEMENT & ANPR DIVISION</h3>
                <p className="text-[10px] text-[#94A3B8] mt-1">ACADEMIC CAPSTONE PROTOTYPE REPORT · REF #{Date.now()}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-b border-[#E5EAF0] pb-2 text-[#64748B]">
                <div>DATE: <strong className="text-[#172033]">{new Date().toLocaleDateString()}</strong></div>
                <div>CORRIDORS: <strong className="text-[#172033]">6 Connected Intersections</strong></div>
                <div>MONITORED: <strong className="text-[#172033]">2,841 Vehicles</strong></div>
                <div>COMPLIANCE: <strong className="text-[#16A34A]">95.0%</strong></div>
              </div>

              <div>
                <h4 className="font-bold text-xs mb-2 text-[#172033]">1. INFRACTION TYPE SUMMARY</h4>
                <table className="w-full text-left text-xs border border-[#E5EAF0] bg-white rounded-lg overflow-hidden">
                  <thead className="bg-[#F1F5F9] text-[#64748B]">
                    <tr>
                      <th className="p-2 border-b border-[#E5EAF0]">Type</th>
                      <th className="p-2 border-b border-[#E5EAF0]">Count</th>
                      <th className="p-2 border-b border-[#E5EAF0]">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-2 border-b border-[#E5EAF0]">Speeding (&gt; Limit)</td><td className="p-2 border-b border-[#E5EAF0] font-semibold">48</td><td className="p-2 border-b border-[#E5EAF0]">34%</td></tr>
                    <tr><td className="p-2 border-b border-[#E5EAF0]">Red Light Intrusion</td><td className="p-2 border-b border-[#E5EAF0] font-semibold">36</td><td className="p-2 border-b border-[#E5EAF0]">25%</td></tr>
                    <tr><td className="p-2 border-b border-[#E5EAF0]">No Helmet (Two-Wheeler)</td><td className="p-2 border-b border-[#E5EAF0] font-semibold">32</td><td className="p-2 border-b border-[#E5EAF0]">23%</td></tr>
                    <tr><td className="p-2">Stop Line Incursion</td><td className="p-2 font-semibold">26</td><td className="p-2">18%</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-6 border-t border-[#E5EAF0] flex justify-between items-end">
                <div>
                  <div className="text-[10px] text-[#94A3B8]">DIGITALLY CERTIFIED BY:</div>
                  <div className="font-bold text-xs mt-1 text-[#172033]">Chief Admin Sharma (ADM-8801)</div>
                </div>
                <div className="border border-[#CBD5E1] bg-white p-2 rounded text-center text-[10px] text-[#64748B]">
                  SEAL OF ENFORCEMENT<br/>ACADEMIC SIMULATION
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-[#172033] border border-[#D9E1EA] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-[#1677FF]" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="flex-1 py-2.5 rounded-lg bg-[#1677FF] hover:bg-[#0958d9] text-white font-semibold text-xs cursor-pointer shadow-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
