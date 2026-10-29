import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Zap, 
  Car, 
  Camera, 
  Cpu, 
  QrCode, 
  ArrowRight, 
  Radio, 
  Sparkles, 
  Send, 
  Clock, 
  Volume2, 
  VolumeX, 
  SkipForward,
  Check,
  Eye,
  MapPin,
  Lock,
  Layers
} from 'lucide-react';
import { User } from '../types';

interface ViolationChallanIntroProps {
  user: User;
  onComplete: () => void;
}

// Simple Web Audio synthesizer for futuristic sci-fi sound effects
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  // Target radar beep / lock-on
  playTargetLock() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {
      // Audio may be blocked before interaction, safe ignore
    }
  }

  // Camera shutter / OCR snapshot click
  playShutter() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400, this.ctx.currentTime);
      osc.frequency.setValueAtTime(800, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {}
  }

  // Stamp slam sound
  playStamp() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch {}
  }

  // High tech reveal chord
  playReveal() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6 + i * 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + 0.7 + i * 0.08);
      });
    } catch {}
  }
}

export const ViolationChallanIntro: React.FC<ViolationChallanIntroProps> = ({
  user,
  onComplete,
}) => {
  // Current animation phase: 1 = Traffic Violation, 2 = Challan Generation, 3 = Project Title Reveal
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const soundRef = useRef<SoundFX>(new SoundFX());

  // Step-specific animation micro-states
  const [detectionLocked, setDetectionLocked] = useState(false);
  const [ocrScanned, setOcrScanned] = useState(false);
  const [radarSpeed, setRadarSpeed] = useState(58);
  const [challanStamped, setChallanStamped] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [titleProgress, setTitleProgress] = useState(0);

  // Sync sound mute setting
  useEffect(() => {
    soundRef.current.enabled = soundEnabled;
  }, [soundEnabled]);

  // Key listeners for fast skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  // Sequence Timeline
  useEffect(() => {
    // PHASE 1: Traffic Violation Detection
    // T = 0ms: Initial video scan
    // T = 600ms: Speed ramps up
    const speedTimer = setInterval(() => {
      setRadarSpeed((s) => {
        if (s < 84) return s + 2;
        clearInterval(speedTimer);
        return 84;
      });
    }, 40);

    const lockTimer = setTimeout(() => {
      setDetectionLocked(true);
      soundRef.current.playTargetLock();
    }, 1100);

    const ocrTimer = setTimeout(() => {
      setOcrScanned(true);
      soundRef.current.playShutter();
    }, 2000);

    // Transition to Phase 2: Challan Generation at T = 3600ms
    const toPhase2Timer = setTimeout(() => {
      setPhase(2);
    }, 3600);

    return () => {
      clearInterval(speedTimer);
      clearTimeout(lockTimer);
      clearTimeout(ocrTimer);
      clearTimeout(toPhase2Timer);
    };
  }, []);

  // When phase becomes 2
  useEffect(() => {
    if (phase !== 2) return;

    // Stamping the Challan after 1.1s
    const stampTimer = setTimeout(() => {
      setChallanStamped(true);
      soundRef.current.playStamp();
    }, 1100);

    // SMS dispatch confirmation
    const smsTimer = setTimeout(() => {
      setSmsSent(true);
    }, 2200);

    // Transition to Phase 3: Project Title Reveal at T = 3900ms after entering Phase 2
    const toPhase3Timer = setTimeout(() => {
      setPhase(3);
      soundRef.current.playReveal();
    }, 3900);

    return () => {
      clearTimeout(stampTimer);
      clearTimeout(smsTimer);
      clearTimeout(toPhase3Timer);
    };
  }, [phase]);

  // When phase becomes 3
  useEffect(() => {
    if (phase !== 3) return;

    // Smooth progress bar to 100%
    const interval = setInterval(() => {
      setTitleProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 3;
      });
    }, 60);

    // Auto-enter dashboard after 3.2s
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(completeTimer);
    };
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#080D1A] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Background Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Dynamic Ambient Neon Spotlights */}
      <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
        phase === 1 ? 'bg-rose-500/25' : phase === 2 ? 'bg-amber-500/25' : 'bg-cyan-500/30'
      }`} />
      <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
        phase === 1 ? 'bg-cyan-500/20' : phase === 2 ? 'bg-emerald-500/25' : 'bg-blue-600/30'
      }`} />

      {/* TOP BAR: Step Indicator & Controls */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1677FF] to-[#38BDF8] flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
              TRAFFIC ENFORCEMENT ENGINE
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                LIVE PIPELINE
              </span>
            </span>
          </div>
        </div>

        {/* Phase Timeline Pill */}
        <div className="hidden md:flex items-center gap-2 bg-[#0F172A]/80 border border-[#1E293B] rounded-full px-4 py-1.5 backdrop-blur-md text-xs font-mono">
          <span className={`flex items-center gap-1.5 transition-colors ${phase === 1 ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${phase === 1 ? 'bg-rose-500 animate-ping' : phase > 1 ? 'bg-emerald-500' : 'bg-slate-600'}`} />
            1. VIOLATION DETECTION
          </span>
          <span className="text-slate-600">→</span>
          <span className={`flex items-center gap-1.5 transition-colors ${phase === 2 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${phase === 2 ? 'bg-amber-500 animate-ping' : phase > 2 ? 'bg-emerald-500' : 'bg-slate-600'}`} />
            2. CHALLAN GENERATION
          </span>
          <span className="text-slate-600">→</span>
          <span className={`flex items-center gap-1.5 transition-colors ${phase === 3 ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${phase === 3 ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
            3. COMMAND CENTER
          </span>
        </div>

        {/* Audio & Skip Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-[#0F172A] border border-[#1E293B] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={onComplete}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-[#1677FF] border border-slate-700 hover:border-blue-500 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <span>Skip to Dashboard</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* CENTER STAGE: Dynamic Phases */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 my-auto flex flex-col items-center justify-center">

        {/* ======================================================== */}
        {/* PHASE 1: TRAFFIC VIOLATION AI DETECTION                  */}
        {/* ======================================================== */}
        {phase === 1 && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            {/* Header Banner */}
            <div className="mb-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-mono font-bold tracking-wider mb-2">
                <AlertTriangle className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                NEURAL INFERENCE DETECTING VIOLATION
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Live Frame-by-Frame AI Surveillance Lock-On
              </h2>
            </div>

            {/* Video Viewport Simulation with Bounding Box & OCR Reticle */}
            <div className="relative w-full max-w-3xl aspect-[16/9] rounded-2xl overflow-hidden bg-[#020617] border-2 border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.25)]">
              {/* Highway Road Simulation Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B1528] via-[#0F172A] to-[#020617]" />
              
              {/* Perspective Road Surface */}
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-40">
                <div 
                  className="w-full h-full"
                  style={{
                    background: 'radial-gradient(ellipse at bottom, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
                  }}
                />
              </div>

              {/* Road Lane Lines */}
              <div className="absolute inset-x-0 bottom-0 top-1/3 flex justify-center pointer-events-none opacity-30">
                <div className="w-0.5 h-full bg-cyan-400 border-dashed border-cyan-400" />
                <div className="w-96 h-full border-x border-dashed border-slate-500" />
              </div>

              {/* Optical Crosshair Scan Lines */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-[1px] bg-rose-500/30 absolute top-1/2" />
                <div className="h-full w-[1px] bg-rose-500/30 absolute left-1/2" />
                {/* Sweeping Laser Line */}
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38BDF8] animate-bounce opacity-80" />
              </div>

              {/* Live Camera Feed Metadata Overlay */}
              <div className="absolute top-3 left-4 flex items-center gap-2 text-[11px] font-mono text-cyan-300 bg-[#0A101D]/80 px-2.5 py-1 rounded-md border border-cyan-900/60 backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>CAM-04 // NH-48 KM 42.4 (EXPRESS HIGHWAY)</span>
              </div>

              <div className="absolute top-3 right-4 flex items-center gap-2 text-[11px] font-mono text-slate-300 bg-[#0A101D]/80 px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur-xs">
                <Radio className="w-3 h-3 text-cyan-400" />
                <span>DOPPLER FMCW 77 GHz</span>
              </div>

              {/* CENTER: THE TARGETED CAR WITH HIGH-PRECISION BOUNDING BOX */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 p-3 transition-all duration-700 ${
                detectionLocked ? 'scale-100 opacity-100' : 'scale-90 opacity-60'
              }`}>
                {/* Realistic Car Graphic Mock */}
                <div className="relative rounded-xl bg-gradient-to-b from-slate-700 to-slate-900 border border-slate-600 p-4 shadow-2xl flex flex-col items-center">
                  <div className="w-full flex items-center justify-between text-slate-400 mb-2">
                    <Car className="w-8 h-8 text-white" />
                    <span className="text-[10px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      SEDAN / SUV (WHITE)
                    </span>
                  </div>

                  {/* High Contrast Indian HSRP Number Plate */}
                  <div className={`relative px-4 py-1.5 rounded bg-white text-black font-mono font-bold tracking-widest text-sm border-2 border-black shadow-md flex items-center gap-2 transition-all duration-500 ${
                    ocrScanned ? 'ring-4 ring-cyan-400 scale-105' : ''
                  }`}>
                    <span className="text-[9px] text-blue-800 font-extrabold flex flex-col leading-none">
                      <span>I</span><span>N</span><span>D</span>
                    </span>
                    <span className="text-black font-black">MH 12 DE 4021</span>
                    {ocrScanned && (
                      <span className="absolute -top-3 -right-2 bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-sans font-bold flex items-center gap-0.5 shadow">
                        <Check className="w-2.5 h-2.5" /> OCR 99.4%
                      </span>
                    )}
                  </div>
                </div>

                {/* THE NEON YOLOv8 BOUNDING BOX & CORNER RETICLES */}
                <div className="absolute inset-0 border-2 border-rose-500 rounded-lg pointer-events-none shadow-[0_0_20px_rgba(244,63,94,0.6)]">
                  {/* Precision Corner Brackets */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-rose-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-rose-400" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-rose-400" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-rose-400" />
                </div>

                {/* Floating AI Classification Pill */}
                <div className="absolute -top-7 left-0 bg-rose-600 text-white font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-t flex items-center gap-1.5 shadow-lg">
                  <Cpu className="w-3 h-3 text-yellow-300" />
                  <span>YOLOv8x: CAR #849 (CONF 98.7%)</span>
                </div>

                {/* Floating Speed Telemetry Pill */}
                <div className="absolute -bottom-7 right-0 bg-[#0F172A] border border-rose-500 text-rose-400 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-b flex items-center gap-1.5 shadow-lg">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>DOPPLER: {radarSpeed} KM/H (LIMIT 50)</span>
                </div>
              </div>

              {/* Bottom Alarm Banner */}
              <div className="absolute bottom-3 inset-x-4 bg-rose-950/90 border border-rose-600 text-rose-200 px-4 py-2 rounded-xl backdrop-blur-md flex items-center justify-between font-mono text-xs shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-bold text-rose-300">VIOLATION CONFIRMED:</span>
                  <span>SPEEDING +34 KM/H OVER ARTERIAL LIMIT</span>
                </div>
                <span className="text-[10px] text-rose-400 font-semibold uppercase hidden sm:inline">
                  TRIGGERING E-CHALLAN ENGINE...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PHASE 2: AUTOMATED E-CHALLAN GENERATION                  */}
        {/* ======================================================== */}
        {phase === 2 && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            {/* Header Banner */}
            <div className="mb-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold tracking-wider mb-2">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                AUTOMATED ENFORCEMENT DISPATCH
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Official Digital E-Challan Issuance Under M.V. Act
              </h2>
            </div>

            {/* THE E-CHALLAN CARD */}
            <div className="relative w-full max-w-xl bg-white text-[#0F172A] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-2 border-slate-200 p-6 sm:p-7 overflow-hidden">
              {/* Official Seal / Watermark Background */}
              <div className="absolute -right-8 -bottom-8 w-64 h-64 opacity-5 pointer-events-none text-[#1677FF]">
                <Shield className="w-full h-full" />
              </div>

              {/* Challan Card Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1677FF] to-[#0284C7] text-white flex items-center justify-center font-bold shadow-md">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#0F172A] tracking-tight uppercase">
                      State Traffic Police Command
                    </h3>
                    <p className="text-[11px] text-[#475569] font-mono">
                      NATIONAL E-CHALLAN DIGITAL PORTAL (VAHAN SYNC)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#64748B] block">CHALLAN NO.</span>
                  <span className="font-mono font-bold text-xs text-[#0F172A] bg-slate-100 px-2 py-0.5 rounded">
                    CH-2026-MH12-9942
                  </span>
                </div>
              </div>

              {/* Violation Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <span className="text-[10px] text-[#64748B] font-mono uppercase block">Vehicle Reg. Number</span>
                  <span className="font-mono font-bold text-sm text-[#0F172A]">MH-12-DE-4021</span>
                  <span className="text-[10px] text-slate-500 block">Hyundai Creta (White)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <span className="text-[10px] text-[#64748B] font-mono uppercase block">Offense Clause</span>
                  <span className="font-bold text-xs text-rose-600 block">Section 183(2) M.V. Act</span>
                  <span className="text-[10px] text-slate-500">Exceeding Speed Limit (&gt;30 km/h)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <span className="text-[10px] text-[#64748B] font-mono uppercase block">Recorded Doppler Speed</span>
                  <span className="font-mono font-bold text-sm text-rose-600">84 KM/H</span>
                  <span className="text-[10px] text-slate-500 block">Permissible: 50 KM/H</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <span className="text-[10px] text-[#64748B] font-mono uppercase block">Fine Assessment</span>
                  <span className="font-mono font-extrabold text-base text-emerald-700">₹2,000</span>
                  <span className="text-[10px] text-emerald-600 block">Due in 15 days</span>
                </div>
              </div>

              {/* Location & Sensor Proof Watermark */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] font-mono text-[#475569] mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>NH-48 KM 42, Express Arterial Lane 2</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>YOLOv8 + OCR VERIFIED</span>
                </div>
              </div>

              {/* QR Code & Barcode Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white border border-slate-300 p-1 rounded-lg flex items-center justify-center shadow-xs">
                    <QrCode className="w-10 h-10 text-slate-800" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">INSTANT UPI PAYMENT</span>
                    <span className="text-xs font-mono font-bold text-[#1677FF]">scan-pay.gov.in</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">DIGITAL HASH</span>
                  <span className="text-[9px] font-mono text-slate-600 block">SHA256: 9e4f...b72a</span>
                </div>
              </div>

              {/* ANIMATED BIG OFFICIAL RUBBER STAMP */}
              {challanStamped && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rotate-[-12deg] animate-in zoom-in-150 duration-300">
                  <div className="border-4 border-rose-600 rounded-2xl px-6 py-2 bg-rose-500/10 backdrop-blur-[1px] shadow-[0_0_30px_rgba(225,29,72,0.4)]">
                    <span className="text-2xl sm:text-3xl font-black text-rose-600 tracking-wider uppercase block text-center font-mono">
                      OFFICIALLY ISSUED
                    </span>
                    <span className="text-[10px] font-mono font-bold text-rose-700 tracking-widest block text-center">
                      AUTOMATED TRAFFIC ENFORCEMENT
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Dispatch Banner */}
            {smsSent && (
              <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-600/70 text-emerald-300 text-xs font-mono animate-in fade-in duration-300 shadow-md">
                <Send className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>E-Challan SMS & WhatsApp Alert dispatched to Owner Mobile (+91 98*** **420)</span>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PHASE 3: PROJECT TITLE CINEMATIC REVEAL                  */}
        {/* ======================================================== */}
        {phase === 3 && (
          <div className="w-full flex flex-col items-center text-center animate-in fade-in zoom-in-90 duration-700">
            {/* Glowing System Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-3xl bg-cyan-500/30 blur-2xl animate-pulse" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#1677FF] via-[#0284C7] to-[#38BDF8] flex items-center justify-center text-white shadow-[0_0_50px_rgba(56,189,248,0.5)] border-2 border-cyan-300/40">
                <Shield className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
            </div>

            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              NEXT-GENERATION SMART CITY ROAD SURVEILLANCE
            </div>

            {/* MAIN PROJECT TITLE */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-300 mb-3 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              AI SMART TRAFFIC ENFORCEMENT
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-sm sm:text-base text-slate-300 mb-8 font-light leading-relaxed">
              Automated ANPR Plate Recognition · Doppler FMCW Radar Telemetry · YOLOv8 Neural Inference · Instant Digital E-Challan Pipeline
            </p>

            {/* System Status Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mb-8">
              <div className="p-2.5 rounded-xl bg-[#0F172A]/90 border border-cyan-900/60 font-mono text-left">
                <span className="text-[10px] text-slate-400 block">AI INFERENCE</span>
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> YOLOv8x ONLINE
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0F172A]/90 border border-emerald-900/60 font-mono text-left">
                <span className="text-[10px] text-slate-400 block">DOPPLER RADAR</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 77 GHz SYNCED
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0F172A]/90 border border-purple-900/60 font-mono text-left">
                <span className="text-[10px] text-slate-400 block">SENSORS SYNCED</span>
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> 24 / 24 ACTIVE
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0F172A]/90 border border-amber-900/60 font-mono text-left">
                <span className="text-[10px] text-slate-400 block">OPERATOR</span>
                <span className="text-xs font-bold text-amber-400 truncate block">
                  {user.fullName || user.username}
                </span>
              </div>
            </div>

            {/* Launch Progress Bar */}
            <div className="w-full max-w-md space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  LOADING COMMAND CENTER DASHBOARD...
                </span>
                <span className="text-cyan-400 font-bold">{Math.min(100, titleProgress)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#1677FF] via-cyan-400 to-emerald-400 shadow-[0_0_12px_#38BDF8] transition-all duration-100 ease-out"
                  style={{ width: `${titleProgress}%` }}
                />
              </div>
            </div>

            {/* Enter Button if user wants to click immediately */}
            <button
              onClick={onComplete}
              className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#2563EB] hover:from-[#0958D9] hover:to-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all cursor-pointer hover:scale-105"
            >
              <span>ENTER MAIN PROJECT NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </main>

      {/* FOOTER: Security & Protocol Bar */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 pb-5 pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-500 border-t border-[#1E293B]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>SESSION AUTHENTICATED: {user.badgeId} · {user.role}</span>
        </div>

        <div className="flex items-center gap-3">
          <span>PRESS [SPACE] OR [ESC] TO SKIP</span>
          <span className="text-slate-700">|</span>
          <span className="text-cyan-400 font-semibold">SECURE TLS 1.3</span>
        </div>
      </footer>
    </div>
  );
};
