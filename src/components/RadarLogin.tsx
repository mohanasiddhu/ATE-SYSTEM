import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Radio, Lock, User as UserIcon, CheckCircle2, AlertTriangle, ArrowRight, Play } from 'lucide-react';
import { User, UserRole } from '../types';
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
    <div className="min-h-screen bg-[#F5F7FA] text-[#172033] flex flex-col lg:flex-row relative overflow-hidden">
      {/* LEFT SECTION: SMART CITY RADAR & TELEMETRY */}
      <div className="lg:w-7/12 p-6 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E5EAF0] z-10 bg-white">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677FF] shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#172033]">
                  AI Smart Traffic Enforcement
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Intelligent ANPR, Doppler Radar & Enforcement Platform <span className="text-slate-300">|</span> <span className="text-[#1677FF] font-medium">SYS-NODE-01</span>
              </p>
            </div>
          </div>

          <button
            onClick={onPresentationMode}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#1677FF] text-xs font-semibold transition-colors cursor-pointer"
            title="Launch College Review Automated Demonstration"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>PRESENTATION MODE</span>
          </button>
        </div>

        {/* Tactical Radar Display (Clean Light Theme) */}
        <div className="my-8 flex flex-col items-center justify-center relative">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center bg-[#F8FAFC] rounded-full border border-[#E5EAF0] shadow-inner">
            {/* Concentric rings */}
            <div className="absolute inset-4 rounded-full border border-[#CBD5E1]" />
            <div className="absolute inset-12 sm:inset-16 rounded-full border border-[#CBD5E1]" />
            <div className="absolute inset-24 sm:inset-28 rounded-full border border-[#CBD5E1]" />
            <div className="absolute inset-36 sm:inset-40 rounded-full border border-[#CBD5E1]" />

            {/* Crosshair Axes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] bg-[#CBD5E1]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-full w-[1px] bg-[#CBD5E1]" />
            </div>

            {/* Rotating Radar Sweep Beam */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div
                className="w-full h-full animate-radar origin-center"
                style={{
                  background: 'conic-gradient(from 0deg at 50% 50%, rgba(22, 119, 255, 0.22) 0deg, rgba(22, 119, 255, 0) 55deg)',
                }}
              />
            </div>

            {/* Degree Marks */}
            <span className="absolute top-2 text-[10px] font-mono text-[#94A3B8]">000°</span>
            <span className="absolute right-2 text-[10px] font-mono text-[#94A3B8]">090°</span>
            <span className="absolute bottom-2 text-[10px] font-mono text-[#94A3B8]">180°</span>
            <span className="absolute left-2 text-[10px] font-mono text-[#94A3B8]">270°</span>

            {/* Target 1: Overspeed (Red) */}
            <div className="absolute top-16 right-16 flex items-center gap-1.5 animate-bounce" style={{ animationDuration: '3s' }}>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EF4444]" />
              </span>
              <span className="text-[10px] font-mono bg-white text-[#EF4444] border border-rose-200 px-2 py-0.5 rounded shadow-sm font-bold">
                OVERSPEED // 84 KM/H
              </span>
            </div>

            {/* Target 2: No Helmet (Amber) */}
            <div className="absolute bottom-24 left-14 flex items-center gap-1.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F59E0B]" />
              </span>
              <span className="text-[10px] font-mono bg-white text-[#D97706] border border-amber-200 px-2 py-0.5 rounded shadow-sm font-bold">
                NO HELMET
              </span>
            </div>

            {/* Target 3: Clear Flow (Blue) */}
            <div className="absolute bottom-16 right-20 flex items-center gap-1.5">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1677FF]" />
              <span className="text-[10px] font-mono bg-white text-[#1677FF] border border-blue-200 px-2 py-0.5 rounded shadow-sm font-bold">
                CLEAR // 48 KM/H
              </span>
            </div>

            {/* Center Node */}
            <div className="w-3.5 h-3.5 rounded-full bg-[#1677FF] ring-4 ring-blue-100" />
          </div>

          {/* Radar Telemetry Sub-row */}
          <div className="mt-4 flex items-center gap-6 text-xs text-[#64748B]">
            <span>RANGE: <strong className="text-[#172033]">150M</strong></span>
            <span>·</span>
            <span>SWEEP: <strong className="text-[#172033]">4.5S</strong></span>
            <span>·</span>
            <span>AI CONF: <strong className="text-[#1677FF]">96.4%</strong></span>
          </div>
        </div>

        {/* Bottom Stream & Status Cards */}
        <div className="space-y-4">
          {/* Active Telemetry Stream */}
          <div className="bg-[#F8FAFC] border border-[#E5EAF0] rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-2.5 border-b border-[#E5EAF0] pb-2 font-medium">
              <span className="flex items-center gap-1.5 text-[#1677FF] font-semibold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                ACTIVE TELEMETRY STREAM
              </span>
              <span className="text-[#94A3B8]">SECURE FEED</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-0.5">
                <span className="text-[#172033] flex items-center gap-2 font-mono font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  MH-12-DE-4021 <span className="text-[#64748B] font-sans text-[11px]">CAM-02</span>
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#EF4444] font-semibold">
                  OVERSPEED 84 km/h
                </span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-[#172033] flex items-center gap-2 font-mono font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#1677FF]" />
                  DL-01-AX-9920 <span className="text-[#64748B] font-sans text-[11px]">CAM-01</span>
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1677FF] font-semibold">
                  CLEAR 48 km/h
                </span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-[#172033] flex items-center gap-2 font-mono font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  KA-03-MN-5112 <span className="text-[#64748B] font-sans text-[11px]">CAM-04</span>
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] font-semibold">
                  NO HELMET FLAGGED
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#F8FAFC] border border-[#E5EAF0] p-3.5 rounded-xl border-l-4 border-l-[#1677FF]">
              <p className="text-[11px] text-[#64748B] font-semibold uppercase">Cameras Online</p>
              <p className="text-base font-bold text-[#172033] mt-0.5">
                24 / 24 <span className="text-xs text-[#16A34A] font-normal">100%</span>
              </p>
            </div>
            <div className="bg-[#F8FAFC] border border-[#E5EAF0] p-3.5 rounded-xl border-l-4 border-l-[#EF4444]">
              <p className="text-[11px] text-[#64748B] font-semibold uppercase">Violations Today</p>
              <p className="text-base font-bold text-[#EF4444] mt-0.5">142</p>
            </div>
            <div className="bg-[#F8FAFC] border border-[#E5EAF0] p-3.5 rounded-xl border-l-4 border-l-[#F59E0B]">
              <p className="text-[11px] text-[#64748B] font-semibold uppercase">Pending Review</p>
              <p className="text-base font-bold text-[#D97706] mt-0.5">18</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              LIVE ROAD CONDITIONS: NH-48 KM 42 - SIGNAL OK // NO CARRIER FAULTS
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: SIGN IN TO THE COMMAND CENTER */}
      <div className="lg:w-5/12 p-8 lg:p-14 flex flex-col justify-center z-10 bg-[#F5F7FA]">
        <div className="max-w-md w-full mx-auto bg-white p-8 rounded-2xl border border-[#E5EAF0] shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-[#1677FF] text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-pulse" />
              OPERATOR ACCESS
            </div>
            <h1 className="text-2xl font-bold text-[#172033] tracking-tight mb-2">
              Sign In to Command Center
            </h1>
            <p className="text-xs text-[#64748B]">
              Enter authorized credentials to access automated ANPR, radar telemetry, and violation dispatch.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D9E1EA] rounded-xl text-[#172033] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1677FF] text-xs transition-colors"
                  placeholder="admin or operator"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  Access Key / Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#64748B] hover:text-[#172033] flex items-center gap-1 cursor-pointer"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D9E1EA] rounded-xl text-[#172033] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1677FF] text-xs transition-colors"
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
              className="w-full py-3 px-4 rounded-xl bg-[#1677FF] hover:bg-[#0958d9] text-white font-semibold text-xs uppercase tracking-wider shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Sign In to Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Role Switcher */}
          <div className="mt-6 pt-5 border-t border-[#E5EAF0]">
            <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2.5 text-center">
              DEMO ROLES (ONE-CLICK SWITCH)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-blue-50 border-[#1677FF] shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E5EAF0] hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-[#172033]">Chief Admin</span>
                  {selectedRole === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-[#1677FF]" />}
                </div>
                <p className="text-[10px] text-[#64748B]">admin</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('operator')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedRole === 'operator'
                    ? 'bg-blue-50 border-[#1677FF] shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E5EAF0] hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-[#172033]">Operator</span>
                  {selectedRole === 'operator' && <CheckCircle2 className="w-3.5 h-3.5 text-[#1677FF]" />}
                </div>
                <p className="text-[10px] text-[#64748B]">operator</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('reviewer')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedRole === 'reviewer'
                    ? 'bg-blue-50 border-[#1677FF] shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E5EAF0] hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-[#172033]">Reviewer</span>
                  {selectedRole === 'reviewer' && <CheckCircle2 className="w-3.5 h-3.5 text-[#1677FF]" />}
                </div>
                <p className="text-[10px] text-[#64748B]">reviewer</p>
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span>NODE // ENFORCEMENT V4.2</span>
            <span className="text-[#16A34A] font-medium">ENCRYPTION ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
