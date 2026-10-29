import React, { useState } from 'react';
import {
  Sliders,
  Radio,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Activity,
  Zap,
  Cpu
} from 'lucide-react';
import { HardwareSensor } from '../types';

interface HardwareSimViewProps {
  sensors: HardwareSensor[];
  onToggleSensorStatus: (id: string, status: 'ONLINE' | 'OFFLINE' | 'FAULT') => void;
}

export const HardwareSimView: React.FC<HardwareSimViewProps> = ({
  sensors,
  onToggleSensorStatus,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-[#172033]">
            Roadside Sensor & Hardware Simulation Matrix
          </h2>
          <p className="text-xs text-[#64748B]">
            Simulate Doppler Radar Guns, Inductive Ground Loops & Controller Node Telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#1677FF] font-medium">
          <Activity className="w-4 h-4" />
          <span>CAN-Bus Telemetry Stream: 250 kbps</span>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sensors.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl border border-[#E5EAF0] p-5 space-y-4 flex flex-col justify-between hover:border-[#1677FF] shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#1677FF] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {s.id} · {s.type}
                </span>

                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1.5 ${
                    s.status === 'ONLINE'
                      ? 'bg-[#DCFCE7] text-[#16A34A]'
                      : s.status === 'FAULT'
                      ? 'bg-[#FEE2E2] text-[#EF4444]'
                      : 'bg-slate-100 text-[#64748B]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      s.status === 'ONLINE'
                        ? 'bg-[#16A34A]'
                        : s.status === 'FAULT'
                        ? 'bg-[#EF4444] animate-ping'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span>{s.status}</span>
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#172033]">
                {s.name}
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">{s.location}</p>
            </div>

            {/* Current Reading Box */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] text-xs">
              <span className="text-[10px] text-[#64748B] uppercase font-semibold">Live Sensor Telemetry Reading</span>
              <p className="text-[#172033] font-bold mt-1 text-sm">{s.reading}</p>
              <div className="flex justify-between items-center text-[11px] text-[#64748B] mt-2 pt-2 border-t border-[#E5EAF0]">
                <span>Last Telemetry Heartbeat: {s.lastPing}</span>
                <span className="text-[#1677FF] font-medium">12V DC Nominal</span>
              </div>
            </div>

            {/* Interactive State Override Buttons */}
            <div className="pt-2 border-t border-[#E5EAF0]">
              <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">
                Inject Hardware State Override:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => onToggleSensorStatus(s.id, 'ONLINE')}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-colors cursor-pointer font-semibold ${
                    s.status === 'ONLINE'
                      ? 'bg-[#DCFCE7] border-[#16A34A] text-[#16A34A]'
                      : 'bg-[#F8FAFC] border-[#E5EAF0] text-[#64748B] hover:bg-slate-100'
                  }`}
                >
                  Online
                </button>

                <button
                  type="button"
                  onClick={() => onToggleSensorStatus(s.id, 'FAULT')}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-colors cursor-pointer font-semibold ${
                    s.status === 'FAULT'
                      ? 'bg-[#FEE2E2] border-[#EF4444] text-[#EF4444]'
                      : 'bg-[#F8FAFC] border-[#E5EAF0] text-[#64748B] hover:bg-slate-100'
                  }`}
                >
                  Fault / Glitch
                </button>

                <button
                  type="button"
                  onClick={() => onToggleSensorStatus(s.id, 'OFFLINE')}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-colors cursor-pointer font-semibold ${
                    s.status === 'OFFLINE'
                      ? 'bg-slate-200 border-slate-400 text-[#172033]'
                      : 'bg-[#F8FAFC] border-[#E5EAF0] text-[#64748B] hover:bg-slate-100'
                  }`}
                >
                  Offline
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
