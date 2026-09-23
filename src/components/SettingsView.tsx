import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Sliders, Shield, Bell, Database } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [speedFine, setSpeedFine] = useState<number>(1000);
  const [redLightFine, setRedLightFine] = useState<number>(1000);
  const [helmetFine, setHelmetFine] = useState<number>(500);
  const [defaultLimit, setDefaultLimit] = useState<number>(60);
  const [retentionDays, setRetentionDays] = useState<number>(90);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-[#172033]">
            System & Statutory Enforcement Settings
          </h2>
          <p className="text-xs text-[#64748B]">
            Jurisdictional Fine Tariffs, Threshold Rules & Data Retention Policies
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#16A34A] text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Parameters Updated & Persisted</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Fine Tariffs */}
        <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAF0]">
            <Sliders className="w-4 h-4 text-[#1677FF]" />
            <h3 className="font-bold text-sm text-[#172033] uppercase">
              Demonstration Statutory Fine Tariffs (INR)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[#64748B] font-semibold mb-1">OVERSPEEDING PENALTY (₹)</label>
              <input
                type="number"
                value={speedFine}
                onChange={(e) => setSpeedFine(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-white border border-[#D9E1EA] rounded-lg text-[#172033] focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="block text-[#64748B] font-semibold mb-1">RED LIGHT INTRUSION (₹)</label>
              <input
                type="number"
                value={redLightFine}
                onChange={(e) => setRedLightFine(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-white border border-[#D9E1EA] rounded-lg text-[#172033] focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="block text-[#64748B] font-semibold mb-1">HELMET COMPLIANCE BREACH (₹)</label>
              <input
                type="number"
                value={helmetFine}
                onChange={(e) => setHelmetFine(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-white border border-[#D9E1EA] rounded-lg text-[#172033] focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>
        </div>

        {/* Corridor Speed Limits & Storage */}
        <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAF0]">
            <Database className="w-4 h-4 text-[#1677FF]" />
            <h3 className="font-bold text-sm text-[#172033] uppercase">
              Telemetry Calibration & Evidence Retention
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#64748B] font-semibold mb-1">DEFAULT CITY CORRIDOR LIMIT (KM/H)</label>
              <input
                type="number"
                value={defaultLimit}
                onChange={(e) => setDefaultLimit(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-white border border-[#D9E1EA] rounded-lg text-[#172033] focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="block text-[#64748B] font-semibold mb-1">EVIDENCE SNAPSHOT RETENTION (DAYS)</label>
              <input
                type="number"
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-white border border-[#D9E1EA] rounded-lg text-[#172033] focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-[#1677FF] hover:bg-[#0958d9] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration Parameters</span>
        </button>
      </form>
    </div>
  );
};
