import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Radio, 
  Lock, 
  User as UserIcon, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Play,
  Activity,
  Wifi,
  Cpu,
  Compass,
  Zap,
  Car
} from 'lucide-react';
import { User } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface RadarLoginProps {
  onLogin: (user: User) => void;
  onPresentationMode: () => void;
}

export const RadarLogin: React.FC<RadarLoginProps> = ({ onLogin, onPresentationMode }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'operator' | 'reviewer'>('admin');
  const [error, setError] = useState('');
  const [azimuth, setAzimuth] = useState<number>(142.4);

  // Azimuth scanner animation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAzimuth((prev) => parseFloat(((prev + 1.2) % 360).toFixed(1)));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSelect = (roleKey: 'admin' | 'operator' | 'reviewer') => {
    setSelectedRole(roleKey);
    if (roleKey === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (roleKey === 'operator') {
      setUsername('operator');
      setPassword('operator123');
    } else {
      setUsername('reviewer');
      setPassword('reviewer123');
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = INITIAL_USERS[username.toLowerCase().trim()];
    if (foundUser) {
      onLogin(foundUser);
    } else {
      onLogin({
        username: username || 'officer',
        fullName: 'Traffic Officer (Field Unit)',
        role: 'OFFICER',
        badgeId: 'FLD-9011',
        email: `${username}@traffic-enforce.gov.in`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-[#172033] flex flex-col justify-between relative overflow-x-hidden selection:bg-[#1677FF] selection:text-white">
      {/* Subtle Background Radial Aura */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/60 to-transparent pointer-events-none" />

      {/* TOP HEADER: Clean full-width lineup */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3 z-10">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#E2E8F0] shadow-xs px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1677FF] to-[#38BDF8] flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-[#0F172A]">
                  AI Smart Traffic Enforcement
                </span>
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                  SYSTEM ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] flex items-center gap-2 font-mono">
                <span>ANPR + 77GHz DOPPLER RADAR</span>
                <span className="text-slate-300">|</span>
                <span className="text-[#1677FF] font-semibold">SYS-NODE-01</span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-600 font-semibold">24 SENSORS SYNCED</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-[#64748B]">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>RADAR CARRIER: 77.25 GHz</span>
            </div>

            <button
              onClick={onPresentationMode}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#2563EB] hover:from-[#0958D9] hover:to-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              title="Launch College Review Automated Demonstration"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>PRESENTATION MODE</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT STAGE: Balanced, Neat 2-Column Lineup */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 my-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: THE COLORFUL DOPPLER RADAR COMMAND CONSOLE (7 cols) */}
          <section className="lg:col-span-7 bg-[#0A101D] text-slate-100 rounded-3xl border border-[#1E293B] shadow-[0_12px_40px_rgba(15,23,42,0.18)] p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden">
            {/* Cyber background matrix grid */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#38BDF8 1px, transparent 1px), radial-gradient(#10B981 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px'
              }}
            />

            {/* Radar Console Header */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono font-bold text-xs text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  DOPPLER FMCW RADAR TELEMETRY
                </span>
              </div>
              
              {/* Colorful Status Pills */}
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-semibold">
                  AZIMUTH: {azimuth}°
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold">
                  RANGE: 150M
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/60 font-semibold">
                  AI CONF: 98.4%
                </span>
              </div>
            </div>

            {/* THE COLORFUL RADAR POD */}
            <div className="my-5 flex flex-col items-center justify-center relative z-10">
              <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center rounded-full bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.18)_0%,_rgba(15,23,42,0.95)_65%,_rgba(10,16,29,1)_100%)] border-2 border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.22),inset_0_0_25px_rgba(6,182,212,0.15)]">
                
                {/* 1. Concentric Range Rings with Vivid Neon Colors */}
                {/* Outer Ring: 150M (Neon Cyan) */}
                <div className="absolute inset-2 sm:inset-3 rounded-full border border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.3)] pointer-events-none" />
                <span className="absolute top-3.5 text-[9px] font-mono text-cyan-300/80 font-bold tracking-wider">150m</span>

                {/* Mid-Outer Ring: 100M (Electric Indigo / Violet) */}
                <div className="absolute inset-10 sm:inset-14 rounded-full border border-indigo-400/50 shadow-[0_0_8px_rgba(129,140,248,0.3)] pointer-events-none" />
                <span className="absolute top-11 sm:top-15 text-[9px] font-mono text-indigo-300/80 font-bold tracking-wider">100m</span>

                {/* Mid-Inner Ring: 50M (Emerald Green) */}
                <div className="absolute inset-20 sm:inset-26 rounded-full border border-emerald-400/50 shadow-[0_0_8px_rgba(52,211,153,0.3)] pointer-events-none" />
                <span className="absolute top-21 sm:top-27 text-[9px] font-mono text-emerald-300/80 font-bold tracking-wider">50m</span>

                {/* Inner Ring: 25M (Radiant Amber / Gold) */}
                <div className="absolute inset-28 sm:inset-36 rounded-full border border-amber-400/60 shadow-[0_0_8px_rgba(251,191,36,0.35)] pointer-events-none" />
                <span className="absolute top-29 sm:top-37 text-[9px] font-mono text-amber-300/80 font-bold tracking-wider">25m</span>

                {/* 2. Colorful Crosshair Axes with Degree Scale */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[1px] bg-gradient-to-r from-cyan-500/40 via-cyan-400/70 to-cyan-500/40" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-full w-[1px] bg-gradient-to-b from-cyan-500/40 via-cyan-400/70 to-cyan-500/40" />
                </div>

                {/* Diagonal 45-degree Guide Reticles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-45">
                  <div className="w-full h-[1px] bg-cyan-400/20 stroke-dasharray" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none -rotate-45">
                  <div className="w-full h-[1px] bg-cyan-400/20" />
                </div>

                {/* 3. Colorful Rotating Radar Sweep Beam */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  <div
                    className="w-full h-full animate-radar-sweep origin-center"
                    style={{
                      background: 'conic-gradient(from 0deg at 50% 50%, rgba(6, 182, 212, 0.55) 0deg, rgba(99, 102, 241, 0.35) 20deg, rgba(16, 185, 129, 0.15) 45deg, transparent 75deg)',
                    }}
                  />
                  {/* Leading Laser Ray Arm */}
                  <div 
                    className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-white shadow-[0_0_10px_#38BDF8] origin-left animate-radar-sweep pointer-events-none"
                    style={{ transformOrigin: '0 0' }}
                  />
                </div>

                {/* 4. Compass Degree Markings in Colors */}
                <span className="absolute top-1.5 text-[10px] font-mono text-cyan-400 font-bold bg-[#0A101D]/80 px-1 rounded">000° N</span>
                <span className="absolute right-1 text-[10px] font-mono text-emerald-400 font-bold bg-[#0A101D]/80 px-1 rounded">090° E</span>
                <span className="absolute bottom-1.5 text-[10px] font-mono text-amber-400 font-bold bg-[#0A101D]/80 px-1 rounded">180° S</span>
                <span className="absolute left-1 text-[10px] font-mono text-purple-400 font-bold bg-[#0A101D]/80 px-1 rounded">270° W</span>

                {/* 5. VIBRANT TARGET BLIPS WITH RIPPLE ANIMATIONS */}
                {/* Target 1: CRIMSON RED (Overspeeding Vehicle) */}
                <div className="absolute top-12 right-12 flex items-center gap-1.5 z-20">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-90" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 shadow-[0_0_10px_#EF4444]" />
                  </span>
                  <div className="text-[10px] font-mono font-bold bg-rose-950/90 text-rose-300 border border-rose-600/80 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(239,68,68,0.3)] backdrop-blur-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    <span>⚠️ OVERSPEED // 84 KM/H</span>
                  </div>
                </div>

                {/* Target 2: RADIANT AMBER (No Helmet Flagged) */}
                <div className="absolute bottom-20 left-10 flex items-center gap-1.5 z-20">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-90" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 shadow-[0_0_10px_#F59E0B]" />
                  </span>
                  <div className="text-[10px] font-mono font-bold bg-amber-950/90 text-amber-300 border border-amber-600/80 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(245,158,11,0.3)] backdrop-blur-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>🪖 NO HELMET // 38 KM/H</span>
                  </div>
                </div>

                {/* Target 3: NEON EMERALD (Compliant Normal Flow) */}
                <div className="absolute bottom-12 right-16 flex items-center gap-1.5 z-20">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 shadow-[0_0_10px_#10B981]" />
                  </span>
                  <div className="text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-600/80 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.3)] backdrop-blur-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>✓ CLEAR // 48 KM/H</span>
                  </div>
                </div>

                {/* Target 4: ELECTRIC VIOLET (Heavy Highway Transit) */}
                <div className="absolute top-20 left-14 flex items-center gap-1.5 z-20">
                  <span className="relative flex h-3 w-3">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-400 shadow-[0_0_8px_#A855F7]" />
                  </span>
                  <div className="text-[10px] font-mono font-bold bg-purple-950/90 text-purple-300 border border-purple-600/80 px-2 py-0.5 rounded shadow-xs backdrop-blur-xs">
                    BUS // 42 KM/H
                  </div>
                </div>

                {/* Center Core Doppler Transceiver Node */}
                <div className="relative flex items-center justify-center z-30">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 animate-ping absolute" />
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-[0_0_14px_#38BDF8] ring-2 ring-cyan-200" />
                </div>
              </div>

              {/* Sub-pod Doppler Spectrum Ticker */}
              <div className="mt-3 flex items-center gap-4 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>DOPPLER VELOCITY: ±140 KM/H</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>BEAM SPREAD: 60° HORIZ</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>DSP: ONLINE</span>
                </span>
              </div>
            </div>

            {/* Radar Console Bottom Section: Telemetry Stream & KPIs in neat lineup */}
            <div className="relative z-10 space-y-3 pt-3 border-t border-[#1E293B]">
              {/* Active Stream Bar */}
              <div className="bg-[#0F172A]/90 border border-[#1E293B] rounded-xl p-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono font-medium">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <Radio className="w-3 h-3 animate-pulse" />
                    LIVE TELEMETRY STREAM
                  </span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    STREAM ENCRYPTED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 border border-rose-900/40">
                    <span className="text-slate-200 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      MH-12-DE-4021
                    </span>
                    <span className="text-rose-400 font-bold text-[10px]">84 km/h</span>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 border border-amber-900/40">
                    <span className="text-slate-200 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      KA-03-MN-5112
                    </span>
                    <span className="text-amber-400 font-bold text-[10px]">NO HELMET</span>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 border border-emerald-900/40">
                    <span className="text-slate-200 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      DL-01-AX-9920
                    </span>
                    <span className="text-emerald-400 font-bold text-[10px]">48 km/h</span>
                  </div>
                </div>
              </div>

              {/* 3 Status KPI Cards in Neat Lineup */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-[#0F172A] border border-cyan-900/40 p-2.5 rounded-xl border-l-3 border-l-cyan-400">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Cameras Online</p>
                  <p className="text-sm sm:text-base font-bold text-white mt-0.5 font-mono">
                    24 / 24 <span className="text-[11px] text-emerald-400 font-normal">100%</span>
                  </p>
                </div>

                <div className="bg-[#0F172A] border border-rose-900/40 p-2.5 rounded-xl border-l-3 border-l-rose-500">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Violations Today</p>
                  <p className="text-sm sm:text-base font-bold text-rose-400 mt-0.5 font-mono">142</p>
                </div>

                <div className="bg-[#0F172A] border border-amber-900/40 p-2.5 rounded-xl border-l-3 border-l-amber-400">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Pending Review</p>
                  <p className="text-sm sm:text-base font-bold text-amber-400 mt-0.5 font-mono">18</p>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: SIGN IN STATION (5 cols, perfectly height-matched & aligned) */}
          <section className="lg:col-span-5 bg-white text-[#172033] rounded-3xl border border-[#E2E8F0] shadow-[0_12px_40px_rgba(15,23,42,0.06)] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Operator Access Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-[#1677FF] text-xs font-bold mb-2 uppercase tracking-wider font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-pulse" />
                  AUTHENTICATED ACCESS
                </div>
                <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-1.5">
                  Sign In to Command Center
                </h1>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Enter authorized officer credentials to monitor live feeds, audit automated ANPR detections, and issue e-challans.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5 font-mono">
                    Operator Identifier
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1677FF] focus:bg-white text-xs font-medium transition-colors"
                      placeholder="admin, operator, or reviewer"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-[#475569] uppercase tracking-wider font-mono">
                      Access Key / Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-[#64748B] hover:text-[#1677FF] flex items-center gap-1 cursor-pointer font-medium transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#1677FF]" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1677FF] focus:bg-white text-xs font-medium transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-[#FEE2E2] border border-rose-200 text-[#EF4444] text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-[#EF4444]" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#2563EB] hover:from-[#0958d9] hover:to-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Sign In to Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo Role Switcher (One-Click) */}
              <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2.5 text-center font-mono">
                  DEMO ROLES (ONE-CLICK SWITCH)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('admin')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedRole === 'admin'
                        ? 'bg-blue-50/80 border-[#1677FF] ring-2 ring-blue-100 shadow-2xs'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-[#0F172A]">Chief Admin</span>
                      {selectedRole === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-[#1677FF]" />}
                    </div>
                    <p className="text-[10px] text-[#64748B] font-mono">admin</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('operator')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedRole === 'operator'
                        ? 'bg-blue-50/80 border-[#1677FF] ring-2 ring-blue-100 shadow-2xs'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-[#0F172A]">Operator</span>
                      {selectedRole === 'operator' && <CheckCircle2 className="w-3.5 h-3.5 text-[#1677FF]" />}
                    </div>
                    <p className="text-[10px] text-[#64748B] font-mono">operator</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('reviewer')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedRole === 'reviewer'
                        ? 'bg-blue-50/80 border-[#1677FF] ring-2 ring-blue-100 shadow-2xs'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-[#0F172A]">Reviewer</span>
                      {selectedRole === 'reviewer' && <CheckCircle2 className="w-3.5 h-3.5 text-[#1677FF]" />}
                    </div>
                    <p className="text-[10px] text-[#64748B] font-mono">reviewer</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Security Credentials Note */}
            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>NODE // ENFORCEMENT V4.2</span>
              </span>
              <span className="text-emerald-600 font-bold">256-BIT TLS ENCRYPTED</span>
            </div>
          </section>

        </div>
      </main>

      {/* FOOTER TICKER: Clean, balanced bottom lineup */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5 pt-2 z-10">
        <div className="bg-white/80 backdrop-blur-xs rounded-xl border border-[#E2E8F0] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="font-mono font-medium text-[#1E293B]">
              LIVE ROAD CONDITIONS: NH-48 KM 42 - SIGNAL OK // NO CARRIER FAULTS
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>DOPPLER PROTOCOL: ETSI EN 301 091-1</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-600 font-bold">SYS-LATENCY: 14ms · 60.0 FPS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
