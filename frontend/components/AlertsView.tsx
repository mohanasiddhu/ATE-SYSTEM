import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  Filter
} from 'lucide-react';
import { AlertItem } from '../types';

interface AlertsViewProps {
  alerts: AlertItem[];
  onMarkRead: (id: number) => void;
  onClearAll: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts, onMarkRead, onClearAll }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filtered = alerts.filter(
    (a) => filterSeverity === 'ALL' || a.severity === filterSeverity
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-[#172033]">
            Real-Time System & Incident Alerts
          </h2>
          <p className="text-xs text-[#64748B]">
            Automated Sensor Anomalies, Severe Infractions & Hardware Diagnostics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearAll}
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-[#D9E1EA] text-[#172033] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#64748B] font-semibold mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-[#1677FF]" /> SEVERITY:
        </span>
        {['ALL', 'CRITICAL', 'HIGH', 'WARNING', 'INFO'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterSeverity === sev
                ? 'bg-[#1677FF] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#172033] border border-[#E5EAF0]'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-[#E5EAF0] text-center text-[#64748B] text-xs">
            No active alerts matching severity filter.
          </div>
        ) : (
          filtered.map((a) => (
            <div
              key={a.id}
              className={`bg-white p-4 rounded-xl border transition-all flex items-start justify-between gap-4 shadow-[0_2px_8px_rgba(15,23,42,0.05)] ${
                a.isRead ? 'border-[#E5EAF0] opacity-75' : 'border-[#CBD5E1]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    a.severity === 'CRITICAL'
                      ? 'bg-[#FEE2E2] text-[#EF4444]'
                      : a.severity === 'HIGH'
                      ? 'bg-[#FEF3C7] text-[#D97706]'
                      : a.severity === 'WARNING'
                      ? 'bg-[#FEF3C7] text-[#D97706]'
                      : 'bg-blue-50 text-[#1677FF]'
                  }`}
                >
                  {a.severity === 'CRITICAL' ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : a.severity === 'HIGH' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#172033]">
                      {a.title}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        a.severity === 'CRITICAL'
                          ? 'bg-[#FEE2E2] text-[#EF4444]'
                          : a.severity === 'HIGH'
                          ? 'bg-[#FEF3C7] text-[#D97706]'
                          : 'bg-blue-50 text-[#1677FF]'
                      }`}
                    >
                      {a.severity}
                    </span>
                  </div>

                  <p className="text-xs text-[#172033]">{a.message}</p>

                  <div className="flex items-center gap-3 text-[11px] text-[#64748B] pt-0.5">
                    <span>SOURCE: <strong className="text-[#172033] font-medium">{a.source}</strong></span>
                    <span>·</span>
                    <span>TIMESTAMP: <strong className="text-[#172033] font-medium">{a.timestamp}</strong></span>
                  </div>
                </div>
              </div>

              {!a.isRead && (
                <button
                  onClick={() => onMarkRead(a.id)}
                  className="px-3 py-1 rounded-lg bg-white hover:bg-slate-50 border border-[#D9E1EA] text-[#172033] text-xs font-semibold shrink-0 cursor-pointer transition-colors shadow-2xs"
                >
                  Acknowledge
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
