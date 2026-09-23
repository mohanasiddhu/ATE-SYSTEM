import React, { useState, useMemo } from 'react';
import {
  Car,
  AlertOctagon,
  Camera as CameraIcon,
  Clock,
  ArrowUpRight,
  MapPin,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Violation, Camera } from '../types';

interface DashboardViewProps {
  violations: Violation[];
  cameras: Camera[];
  onNavigateTab: (tab: any) => void;
  onReviewViolation: (violation: Violation) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  violations,
  cameras,
  onNavigateTab,
  onReviewViolation,
}) => {
  const [activityTimeframe, setActivityTimeframe] = useState<'today' | '7d' | '30d'>('today');
  const [selectedCamId, setSelectedCamId] = useState<string>(cameras[0]?.cameraId || 'CAM-01');
  const [quickInspectViolation, setQuickInspectViolation] = useState<Violation | null>(null);

  // Core KPI Calculations
  const activeCamerasCount = cameras.filter((c) => c.status === 'ONLINE').length;
  const totalVehiclesToday = 12482;
  const violationsToday = violations.length;
  const pendingReviewCount = violations.filter((v) => v.status === 'PENDING_REVIEW').length;

  const currentCam = useMemo(
    () => cameras.find((c) => c.cameraId === selectedCamId) || cameras[0],
    [cameras, selectedCamId]
  );

  // Traffic Activity Chart Data based on tab
  const activityData = useMemo(() => {
    if (activityTimeframe === 'today') {
      return [
        { label: '06:00', vehicles: 450, violations: 12 },
        { label: '08:00', vehicles: 1320, violations: 38 },
        { label: '10:00', vehicles: 1890, violations: 45 },
        { label: '12:00', vehicles: 1420, violations: 22 },
        { label: '14:00', vehicles: 1560, violations: 28 },
        { label: '16:00', vehicles: 2100, violations: 52 },
        { label: '18:00', vehicles: 2380, violations: 61 },
        { label: '20:00', vehicles: 1362, violations: 29 },
      ];
    } else if (activityTimeframe === '7d') {
      return [
        { label: 'Mon', vehicles: 11200, violations: 210 },
        { label: 'Tue', vehicles: 12450, violations: 245 },
        { label: 'Wed', vehicles: 13100, violations: 260 },
        { label: 'Thu', vehicles: 12890, violations: 230 },
        { label: 'Fri', vehicles: 14200, violations: 310 },
        { label: 'Sat', vehicles: 9800, violations: 180 },
        { label: 'Sun', vehicles: 8900, violations: 140 },
      ];
    } else {
      return [
        { label: 'Week 1', vehicles: 84000, violations: 1650 },
        { label: 'Week 2', vehicles: 88500, violations: 1720 },
        { label: 'Week 3', vehicles: 91200, violations: 1840 },
        { label: 'Week 4', vehicles: 87400, violations: 1690 },
      ];
    }
  }, [activityTimeframe]);

  const maxVehicleVal = Math.max(...activityData.map((d) => d.vehicles));

  // Violation Distribution Breakdown
  const violationCounts = useMemo(() => {
    const speeding = violations.filter((v) => v.violationType === 'SPEEDING').length || 62;
    const redLight = violations.filter((v) => v.violationType === 'RED_LIGHT').length || 48;
    const noHelmet = violations.filter((v) => v.violationType === 'NO_HELMET').length || 36;
    const stopLine = violations.filter((v) => v.violationType === 'STOP_LINE').length || 24;
    const total = speeding + redLight + noHelmet + stopLine;
    return {
      speeding,
      redLight,
      noHelmet,
      stopLine,
      total,
      speedingPct: Math.round((speeding / total) * 100),
      redLightPct: Math.round((redLight / total) * 100),
      noHelmetPct: Math.round((noHelmet / total) * 100),
      stopLinePct: Math.round((stopLine / total) * 100),
    };
  }, [violations]);

  // Vehicle Type Breakdown
  const vehicleTypeCounts = [
    { type: 'Cars & Sedans', count: '7,840', pct: 63, color: 'bg-[#1677FF]' },
    { type: 'Two-Wheelers', count: '2,890', pct: 23, color: 'bg-[#3B82F6]' },
    { type: 'Buses & Mass Transit', count: '1,120', pct: 9, color: 'bg-[#16A34A]' },
    { type: 'Heavy Commercial Trucks', count: '632', pct: 5, color: 'bg-[#F59E0B]' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. FOUR CLEAN KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: ACTIVE CAMERAS */}
        <div className="bg-white border border-[#E5EAF0] rounded-xl p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] hover:border-[#1677FF]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Active Cameras
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center">
              <CameraIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-[#172033] tracking-tight">
              {cameras.length || 6}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#16A34A] font-medium mt-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span>100% Online</span>
            </div>
          </div>
        </div>

        {/* Card 2: VEHICLES TODAY */}
        <div className="bg-white border border-[#E5EAF0] rounded-xl p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] hover:border-[#1677FF]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Vehicles Today
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-[#172033] tracking-tight">
              {totalVehiclesToday.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#16A34A] font-medium mt-1.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+8.2% vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Card 3: VIOLATIONS */}
        <div className="bg-white border border-[#E5EAF0] rounded-xl p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] hover:border-[#EF4444]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Violations
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#EF4444] flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-[#EF4444] tracking-tight">
              {violationsToday}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#EF4444] font-medium mt-1.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.4% vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Card 4: PENDING REVIEW */}
        <div className="bg-white border border-[#E5EAF0] rounded-xl p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] hover:border-[#F59E0B]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Pending Review
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-[#F59E0B] tracking-tight">
              {pendingReviewCount}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#F59E0B] font-medium mt-1.5">
              <span>Action required</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD VISUALIZATION & LIVE TRAFFIC CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: TRAFFIC ACTIVITY CHART (Section 7) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E5EAF0] rounded-xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-base font-bold text-[#172033] tracking-tight">
                  Traffic Activity
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Real-time correlation of vehicle volume and safety events.
                </p>
              </div>

              {/* Timeframe Tabs */}
              <div className="flex items-center p-1 bg-[#F5F7FA] border border-[#E5EAF0] rounded-lg self-start sm:self-auto text-xs font-medium">
                {(['today', '7d', '30d'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivityTimeframe(tab)}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activityTimeframe === tab
                        ? 'bg-[#1677FF] text-white font-semibold shadow-xs'
                        : 'text-[#64748B] hover:text-[#172033]'
                    }`}
                  >
                    {tab === 'today' ? 'Today' : tab === '7d' ? '7 Days' : '30 Days'}
                  </button>
                ))}
              </div>
            </div>

            {/* Clean White Custom Bar Visualization with subtle grid lines */}
            <div className="space-y-4">
              <div className="h-56 flex items-end gap-3 sm:gap-5 pt-6 px-2 border-b border-[#E5EAF0] relative">
                {/* Horizontal subtle guide lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="border-b border-dashed border-[#E5EAF0] w-full h-0" />
                  <div className="border-b border-dashed border-[#E5EAF0] w-full h-0" />
                  <div className="border-b border-dashed border-[#E5EAF0] w-full h-0" />
                </div>

                {activityData.map((d, i) => {
                  const vehicleHeightPct = Math.round((d.vehicles / maxVehicleVal) * 85);
                  const violationHeightPct = Math.min(100, Math.round((d.violations / 65) * 55));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
                      <div className="w-full flex items-end justify-center gap-1.5 h-full">
                        {/* Vehicle Bar (Blue) */}
                        <div
                          style={{ height: `${vehicleHeightPct}%` }}
                          className="w-1/2 max-w-[26px] bg-[#1677FF] hover:bg-[#0958d9] rounded-t transition-all relative group-hover:scale-y-105 origin-bottom shadow-xs"
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#172033] text-white px-2 py-0.5 rounded text-[10px] pointer-events-none whitespace-nowrap z-20 shadow-md">
                            {d.vehicles.toLocaleString()} vehicles
                          </div>
                        </div>
                        {/* Violation Bar (Red) */}
                        <div
                          style={{ height: `${violationHeightPct}%` }}
                          className="w-1/2 max-w-[26px] bg-[#EF4444] hover:bg-[#dc2626] rounded-t transition-all relative group-hover:scale-y-105 origin-bottom shadow-xs"
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#172033] text-white px-2 py-0.5 rounded text-[10px] pointer-events-none whitespace-nowrap z-20 shadow-md">
                            {d.violations} violations
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-[#64748B] font-medium mt-2">
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-[#1677FF]" />
                    <span className="font-medium text-[#172033]">Vehicles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-[#EF4444]" />
                    <span className="font-medium text-[#172033]">Violations</span>
                  </div>
                </div>
                <span className="text-xs text-[#94A3B8]">Corridor telemetry updates live</span>
              </div>
            </div>
          </div>

          {/* TWO BALANCED PANELS: VIOLATION DISTRIBUTION & VEHICLE TYPES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Panel 1: Violation Distribution */}
            <div className="bg-white border border-[#E5EAF0] rounded-xl p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-4">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                Violation Distribution
              </h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex items-center justify-between text-[#475569] mb-1.5 font-medium">
                    <span>Speed Limit Exceeded</span>
                    <span className="text-[#EF4444] font-semibold">{violationCounts.speeding} ({violationCounts.speedingPct}%)</span>
                  </div>
                  <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                    <div className="bg-[#EF4444] h-2 rounded-full" style={{ width: `${violationCounts.speedingPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[#475569] mb-1.5 font-medium">
                    <span>Red Light Incursion</span>
                    <span className="text-[#F59E0B] font-semibold">{violationCounts.redLight} ({violationCounts.redLightPct}%)</span>
                  </div>
                  <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                    <div className="bg-[#F59E0B] h-2 rounded-full" style={{ width: `${violationCounts.redLightPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[#475569] mb-1.5 font-medium">
                    <span>Protective Helmet Breach</span>
                    <span className="text-[#1677FF] font-semibold">{violationCounts.noHelmet} ({violationCounts.noHelmetPct}%)</span>
                  </div>
                  <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                    <div className="bg-[#1677FF] h-2 rounded-full" style={{ width: `${violationCounts.noHelmetPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[#475569] mb-1.5 font-medium">
                    <span>Stop-Line Intrusion</span>
                    <span className="text-[#3B82F6] font-semibold">{violationCounts.stopLine} ({violationCounts.stopLinePct}%)</span>
                  </div>
                  <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                    <div className="bg-[#3B82F6] h-2 rounded-full" style={{ width: `${violationCounts.stopLinePct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 2: Traffic by Vehicle Type */}
            <div className="bg-white border border-[#E5EAF0] rounded-xl p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-4">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                Traffic by Vehicle Type
              </h3>

              <div className="space-y-3.5 text-xs">
                {vehicleTypeCounts.map((v, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-[#475569] mb-1.5 font-medium">
                      <span>{v.type}</span>
                      <span className="text-[#172033] font-semibold">{v.count} ({v.pct}%)</span>
                    </div>
                    <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                      <div className={`${v.color} h-2 rounded-full`} style={{ width: `${v.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE TRAFFIC PANEL (Section 8) & HOTSPOTS */}
        <div className="space-y-6">
          {/* Section 8: LIVE TRAFFIC CARD (WHITE CARD, DARK VIDEO FOOTAGE INSIDE) */}
          <div className="bg-white border border-[#E5EAF0] rounded-xl p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold uppercase text-[#172033] tracking-wide">
                  LIVE TRAFFIC
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" /> LIVE
                </span>
              </div>

              {/* Camera Selector */}
              <select
                value={selectedCamId}
                onChange={(e) => setSelectedCamId(e.target.value)}
                className="bg-white border border-[#D9E1EA] text-[#172033] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#1677FF]"
              >
                {cameras.map((c) => (
                  <option key={c.cameraId} value={c.cameraId}>
                    {c.cameraId} - {c.location.split(' ')[0]}
                  </option>
                ))}
              </select>
            </div>

            {/* Video preview: remains naturally dark representing actual camera footage */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col justify-between p-3 group shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80"
                alt="Live Traffic Feed"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />

              {/* Telemetry info top */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-900/90 text-white border border-slate-700">
                  {currentCam?.name || 'Junction North'}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900/90 text-cyan-300 border border-slate-700">
                  30.0 FPS
                </span>
              </div>

              {/* Bounding Box Simulation: Red for violation */}
              <div className="relative z-10 w-44 mx-auto rounded border-2 border-rose-500 bg-rose-500/10 p-1.5 shadow-lg shadow-rose-500/20">
                <div className="flex items-center justify-between text-[9px] font-mono font-bold bg-rose-600 text-white px-1 rounded-sm">
                  <span>CAR #104</span>
                  <span>78 KM/H (OVERSPEED)</span>
                </div>
                <div className="mt-7 bg-black/85 border border-slate-700 rounded px-1.5 py-0.5 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-amber-300 font-bold">AP 09 CD 4921</span>
                  <span className="text-cyan-400">96%</span>
                </div>
              </div>

              {/* Camera overlay stamp */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/70 px-2 py-0.5 rounded">
                <span>RTSP // 1080p</span>
                <span>HD STREAM</span>
              </div>
            </div>

            {/* Below video telemetry (Section 8) */}
            <div className="mt-3.5 p-3 rounded-lg bg-[#F8FAFC] border border-[#E5EAF0] flex items-center justify-between text-xs text-[#475569]">
              <span>Vehicles: <strong className="text-[#172033] font-bold">684</strong></span>
              <span className="h-3 w-px bg-[#E5EAF0]" />
              <span>Density: <strong className="text-[#F59E0B] font-bold">Moderate</strong></span>
            </div>

            {/* Section 8: [Open Full Monitor] button (Blue primary button) */}
            <button
              onClick={() => onNavigateTab('live-monitoring')}
              className="mt-3.5 w-full h-[40px] btn-3d btn-3d-primary text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Open Full Monitor</span>
            </button>
          </div>

          {/* Section 10: TRAFFIC HOTSPOTS MAP (White card) */}
          <div className="bg-white border border-[#E5EAF0] rounded-xl p-5 shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1677FF]" />
                <h3 className="text-sm font-bold text-[#172033] tracking-wide">
                  Traffic Hotspots
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('traffic-map')}
                className="text-xs text-[#1677FF] hover:text-[#0958d9] font-medium flex items-center gap-1"
              >
                <span>View Full Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Clean Light Map Preview */}
            <div
              onClick={() => onNavigateTab('traffic-map')}
              className="relative aspect-[16/9] rounded-xl overflow-hidden border border-[#E5EAF0] bg-[#F1F5F9] cursor-pointer group shadow-inner"
            >
              {/* Light Street Map Background grid */}
              <div className="absolute inset-0 bg-[#F8FAFC] radar-grid-bg opacity-75" />

              {/* Hotspot Markers */}
              <div className="absolute top-1/4 left-1/3 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#EF4444] animate-ping opacity-75" />
                <span className="absolute w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span className="text-[10px] font-medium text-[#172033] bg-white border border-[#E5EAF0] shadow-xs px-1.5 py-0.5 rounded ml-3">
                  Main Junction (Critical)
                </span>
              </div>

              <div className="absolute bottom-1/3 right-1/4 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="text-[10px] font-medium text-[#172033] bg-white border border-[#E5EAF0] shadow-xs px-1.5 py-0.5 rounded ml-3">
                  Ring Pier 12
                </span>
              </div>

              <div className="absolute top-1/2 right-1/3 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1677FF]" />
                <span className="text-[10px] font-medium text-[#172033] bg-white border border-[#E5EAF0] shadow-xs px-1.5 py-0.5 rounded ml-3">
                  Expressway
                </span>
              </div>

              <div className="absolute inset-0 bg-[#1677FF]/5 group-hover:bg-[#1677FF]/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-white text-[#1677FF] text-xs font-semibold border border-[#1677FF]/20 shadow-md">
                  Open Interactive Map →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section 9: RECENT VIOLATIONS (White card & Clean Table) */}
      <div className="bg-white border border-[#E5EAF0] rounded-xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#172033] tracking-tight">
              Recent Violations
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Latest algorithmically captured infractions with photographic evidence and ANPR OCR confidence
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('violations')}
            className="text-xs text-[#1677FF] hover:text-[#0958d9] font-medium flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Infractions ({violations.length})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-semibold">
                <th className="py-3 px-4">EVIDENCE</th>
                <th className="py-3 px-4">VEHICLE</th>
                <th className="py-3 px-4">VIOLATION</th>
                <th className="py-3 px-4">LOCATION</th>
                <th className="py-3 px-4">TIME</th>
                <th className="py-3 px-4">CONFIDENCE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EDF3] text-[#172033]">
              {violations.slice(0, 6).map((v) => (
                <tr
                  key={v.id}
                  onClick={() => setQuickInspectViolation(v)}
                  className="hover:bg-[#F1F6FF] cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4">
                    <img
                      src={v.evidenceImage}
                      alt={v.plateNumber}
                      className="w-12 h-8 object-cover rounded-lg border border-[#E5EAF0] group-hover:border-[#1677FF] transition-colors shadow-2xs"
                    />
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#172033]">
                    {v.plateNumber}
                    <div className="text-[11px] font-normal text-[#64748B]">{v.vehicleType}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#172033]">
                      {v.violationType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#475569]">{v.location}</td>
                  <td className="py-3 px-4 text-[#64748B]">{v.timestamp}</td>
                  <td className="py-3 px-4 font-semibold text-[#1677FF]">
                    {(v.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4">
                    {/* Status badges per Section 9:
                        Pending Review: light orange background
                        Confirmed: light green background
                        Rejected: light red background */}
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        v.status === 'PENDING_REVIEW'
                          ? 'bg-[#FEF3C7] text-[#D97706]'
                          : v.status === 'CONFIRMED'
                          ? 'bg-[#DCFCE7] text-[#16A34A]'
                          : 'bg-[#FEE2E2] text-[#EF4444]'
                      }`}
                    >
                      {v.status === 'PENDING_REVIEW'
                        ? 'Pending Review'
                        : v.status === 'CONFIRMED'
                        ? 'Confirmed'
                        : 'Rejected'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReviewViolation(v);
                      }}
                      className="btn-3d btn-3d-secondary text-xs px-3 py-1 font-semibold"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK DETAIL MODAL (Clean Light Modal) */}
      {quickInspectViolation && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5EAF0] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-100">
            <div className="p-5 border-b border-[#E5EAF0] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#172033] text-base">
                  Violation Dossier · {quickInspectViolation.violationId}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {quickInspectViolation.location} · {quickInspectViolation.timestamp}
                </p>
              </div>
              <button
                onClick={() => setQuickInspectViolation(null)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-100 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200">
                <img
                  src={quickInspectViolation.evidenceImage}
                  alt={quickInspectViolation.violationId}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1 rounded-lg border border-[#E5EAF0] text-[#172033] font-bold text-sm shadow-md">
                  {quickInspectViolation.plateNumber}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 bg-[#F8FAFC] border border-[#E5EAF0] rounded-xl">
                  <span className="text-[#64748B] block font-medium">Infraction Type</span>
                  <span className="font-bold text-[#EF4444] text-sm mt-0.5 block">{quickInspectViolation.violationType}</span>
                </div>
                <div className="p-3.5 bg-[#F8FAFC] border border-[#E5EAF0] rounded-xl">
                  <span className="text-[#64748B] block font-medium">AI Confidence</span>
                  <span className="font-bold text-[#1677FF] text-sm mt-0.5 block">{(quickInspectViolation.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="p-3.5 bg-[#F8FAFC] border border-[#E5EAF0] rounded-xl">
                  <span className="text-[#64748B] block font-medium">Camera ID</span>
                  <span className="font-bold text-[#172033] text-sm mt-0.5 block">{quickInspectViolation.cameraId}</span>
                </div>
                <div className="p-3.5 bg-[#F8FAFC] border border-[#E5EAF0] rounded-xl">
                  <span className="text-[#64748B] block font-medium">Statutory Fine</span>
                  <span className="font-bold text-[#172033] text-sm mt-0.5 block">₹{quickInspectViolation.fineAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E5EAF0] flex items-center justify-between bg-[#F8FAFC]">
              <button
                onClick={() => setQuickInspectViolation(null)}
                className="btn-3d btn-3d-secondary px-4 py-2 text-xs font-semibold"
              >
                Close Drawer
              </button>
              <button
                onClick={() => {
                  const target = quickInspectViolation;
                  setQuickInspectViolation(null);
                  onReviewViolation(target);
                }}
                className="btn-3d btn-3d-primary px-4 py-2 text-xs font-semibold"
              >
                Open Full Review Tool →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
