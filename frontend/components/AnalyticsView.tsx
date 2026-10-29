import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  Car,
  Layers,
  ArrowUpRight,
  MapPin,
  Clock,
  Zap
} from 'lucide-react';
import { Violation } from '../types';

interface AnalyticsViewProps {
  violations: Violation[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ violations }) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Peak Traffic Hours Data
  const hourlyTraffic = [
    { hour: '06:00', volume: 620, violations: 14 },
    { hour: '08:00', volume: 1850, violations: 48 },
    { hour: '10:00', volume: 2420, violations: 62 },
    { hour: '12:00', volume: 1650, violations: 28 },
    { hour: '14:00', volume: 1780, violations: 31 },
    { hour: '16:00', volume: 2240, violations: 58 },
    { hour: '18:00', volume: 2890, violations: 84 },
    { hour: '20:00', volume: 1950, violations: 45 },
    { hour: '22:00', volume: 1100, violations: 21 },
  ];

  const maxVolume = Math.max(...hourlyTraffic.map((h) => h.volume));

  // Hotspot Analysis Data
  const hotspots = [
    { location: 'Cyber Towers Junction North', violations: 68, riskLevel: 'HIGH', avgSpeed: '72 km/h' },
    { location: 'Aero Expressway KM 14', violations: 54, riskLevel: 'HIGH', avgSpeed: '88 km/h' },
    { location: 'Ring Road Pier 18', violations: 41, riskLevel: 'MEDIUM', avgSpeed: '64 km/h' },
    { location: 'Financial District Gate 2', violations: 26, riskLevel: 'LOW', avgSpeed: '52 km/h' },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Time,Traffic Volume,Violations Recorded\n' +
      hourlyTraffic.map((e) => `${e.hour},${e.volume},${e.violations}`).join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `traffic_intelligence_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadNotice('CSV Report generated and downloaded.');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handleExportPDF = () => {
    window.print();
    setDownloadNotice('Print dialog invoked for PDF export.');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5EAF0]">
        <div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">
            Traffic Analytics & Intelligence
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Spatial-temporal corridor aggregation, hourly density curves, and predictive congestion indexes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex items-center p-1 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-xs">
            {(['24h', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  timeRange === r
                    ? 'bg-[#1677FF] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                {r === '24h' ? '24 Hours' : r === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>

          {/* Export Buttons */}
          <button
            onClick={handleExportCSV}
            className="btn-3d btn-3d-secondary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#1677FF]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="btn-3d btn-3d-primary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[#1677FF] text-xs font-semibold">
          ✓ {downloadNotice}
        </div>
      )}

      {/* SECTION 1: TRAFFIC VOLUME TRENDS & PEAK TRAFFIC HOURS */}
      <div className="bg-white border border-[#E5EAF0] rounded-xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#172033] uppercase tracking-wide">
              Peak Traffic Hours & Volume Trends
            </h2>
            <p className="text-xs text-[#64748B]">Correlated vehicle flow and rule infractions across standard operating hours</p>
          </div>
          <div className="text-xs text-[#64748B] flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 bg-[#1677FF] rounded-xs" /> Vehicles (Thousands)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 bg-[#EF4444] rounded-xs" /> Infractions
            </span>
          </div>
        </div>

        {/* Clean Bar Visualization */}
        <div className="h-64 flex items-end gap-2 sm:gap-4 pt-6 px-2 border-b border-[#E5EAF0]">
          {hourlyTraffic.map((d, i) => {
            const barHeightPct = Math.round((d.volume / maxVolume) * 90);
            const violationHeightPct = Math.min(100, Math.round((d.violations / 90) * 60));
            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  <div
                    style={{ height: `${barHeightPct}%` }}
                    className="w-1/2 max-w-[24px] bg-[#1677FF]/75 group-hover:bg-[#1677FF] rounded-t transition-all relative"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#172033] text-white px-2 py-0.5 rounded text-[10px] pointer-events-none whitespace-nowrap z-20 shadow-md">
                      {d.volume} cars
                    </div>
                  </div>
                  <div
                    style={{ height: `${violationHeightPct}%` }}
                    className="w-1/2 max-w-[24px] bg-[#EF4444]/75 group-hover:bg-[#EF4444] rounded-t transition-all relative"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#172033] text-white px-2 py-0.5 rounded text-[10px] pointer-events-none whitespace-nowrap z-20 shadow-md">
                      {d.violations} violations
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-[#64748B] mt-2">{d.hour}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2 & 3: VIOLATION BREAKDOWN & HOTSPOT ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotspot Analysis */}
        <div className="bg-white border border-[#E5EAF0] rounded-xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172033] uppercase tracking-wide">
              Corridor Hotspot Analysis
            </h3>
            <span className="text-xs text-[#64748B]">Ranked by Criticality</span>
          </div>

          <div className="space-y-3 text-xs">
            {hotspots.map((h, i) => (
              <div
                key={i}
                className="p-3.5 bg-[#F8FAFC] border border-[#E5EAF0] rounded-xl flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-[#172033] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1677FF]" />
                    {h.location}
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-1">
                    Avg Corridor Speed: <strong className="text-[#172033]">{h.avgSpeed}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#EF4444] text-sm">{h.violations} Incidents</div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      h.riskLevel === 'HIGH'
                        ? 'bg-[#FEE2E2] text-[#EF4444]'
                        : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}
                  >
                    {h.riskLevel} RISK
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Type Breakdown */}
        <div className="bg-white border border-[#E5EAF0] rounded-xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172033] uppercase tracking-wide">
              Vehicle Type & Class Breakdown
            </h3>
            <span className="text-xs text-[#1677FF] font-semibold">Total: 12,482</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-[#172033] mb-1.5">
                <span className="font-medium">Passenger Sedans & Hatchbacks</span>
                <span className="font-bold">7,840 (63%)</span>
              </div>
              <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                <div className="bg-[#1677FF] h-2 rounded-full" style={{ width: '63%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#172033] mb-1.5">
                <span className="font-medium">Motorcycles & Scooters</span>
                <span className="font-bold">2,890 (23%)</span>
              </div>
              <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                <div className="bg-[#8B5CF6] h-2 rounded-full" style={{ width: '23%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#172033] mb-1.5">
                <span className="font-medium">Heavy Buses & Mass Transit</span>
                <span className="font-bold">1,120 (9%)</span>
              </div>
              <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                <div className="bg-[#10B981] h-2 rounded-full" style={{ width: '9%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#172033] mb-1.5">
                <span className="font-medium">Multi-Axle Commercial Trucks</span>
                <span className="font-bold">632 (5%)</span>
              </div>
              <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                <div className="bg-[#F59E0B] h-2 rounded-full" style={{ width: '5%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
