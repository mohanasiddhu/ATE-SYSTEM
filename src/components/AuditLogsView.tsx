import React, { useState } from 'react';
import { History, ShieldCheck, Search, Filter } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogsViewProps {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.actor && l.actor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.details && l.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.entityId && l.entityId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.description && l.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-[#172033]">
            Cryptographic Enforcement Audit Trail
          </h2>
          <p className="text-xs text-[#64748B]">
            Immutable Log of Operator Approvals, System Overrides & Dispatch Events
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search action, actor or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#D9E1EA] rounded-lg text-xs text-[#172033] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1677FF]"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-semibold">
              <tr>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">ACTOR / ID</th>
                <th className="py-3 px-4">ROLE</th>
                <th className="py-3 px-4">ACTION</th>
                <th className="py-3 px-4">ENTITY REF</th>
                <th className="py-3 px-4">EVENT DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EDF3]">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 text-[#64748B] whitespace-nowrap">{l.timestamp}</td>
                  <td className="py-3 px-4 font-semibold text-[#172033]">{l.actor}</td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-[#172033] font-medium border border-slate-200">
                      {l.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        l.action.includes('REJECT')
                          ? 'bg-[#FEE2E2] text-[#EF4444]'
                          : l.action.includes('APPROVE')
                          ? 'bg-[#DCFCE7] text-[#16A34A]'
                          : l.action.includes('PAY')
                          ? 'bg-blue-50 text-[#1677FF]'
                          : 'bg-slate-100 text-[#64748B]'
                      }`}
                    >
                      {l.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#1677FF]">{l.entityId}</td>
                  <td className="py-3 px-4 text-[#172033]">{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
