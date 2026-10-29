import React, { useState } from 'react';
import {
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  ShieldAlert,
  Clock,
  Printer
} from 'lucide-react';
import { Fine } from '../types';

interface FinesViewProps {
  fines: Fine[];
  onOpenPaymentModal: (fine: Fine) => void;
}

export const FinesView: React.FC<FinesViewProps> = ({ fines, onOpenPaymentModal }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredFines = fines.filter((f) => {
    const matchesStatus = filterStatus === 'ALL' || f.status === filterStatus;
    const matchesQuery =
      f.fineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.noticeText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const totalAmount = fines.reduce((sum, f) => sum + f.amount, 0);
  const paidAmount = fines.filter((f) => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0);
  const unpaidAmount = fines.filter((f) => f.status === 'UNPAID').reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[#D97706] text-xs flex items-center justify-between shadow-2xs">
        <span className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-[#D97706]" />
          <span>
            ACADEMIC PROTOTYPE NOTICE: Digital e-Challan records are demonstration simulations and do not represent statutory legal penalties.
          </span>
        </span>
        <span className="font-semibold text-[#D97706] hidden sm:inline">DEMO FINES ENGINE</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
          <span className="text-xs uppercase text-[#64748B] font-semibold tracking-wider">
            Total Challans Issued
          </span>
          <p className="text-2xl font-bold text-[#172033] mt-2">
            ₹{totalAmount.toLocaleString()}
          </p>
          <span className="text-xs text-[#64748B] mt-0.5 block">{fines.length} total penalty records</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
          <span className="text-xs uppercase text-[#64748B] font-semibold tracking-wider">
            Simulated Collections (Paid)
          </span>
          <p className="text-2xl font-bold text-[#16A34A] mt-2">
            ₹{paidAmount.toLocaleString()}
          </p>
          <span className="text-xs text-[#16A34A] mt-0.5 block">Citizen portal settlements</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
          <span className="text-xs uppercase text-[#64748B] font-semibold tracking-wider">
            Outstanding Liability (Unpaid)
          </span>
          <p className="text-2xl font-bold text-[#EF4444] mt-2">
            ₹{unpaidAmount.toLocaleString()}
          </p>
          <span className="text-xs text-[#EF4444] mt-0.5 block">Due within 15-day window</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-base text-[#172033]">
              Electronic Challan Ledger
            </h2>
            <p className="text-xs text-[#64748B]">
              Notice Distribution, Payment Gateway Integration & Status Tracking
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search fine ID or plate number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#D9E1EA] rounded-lg text-xs text-[#172033] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1677FF]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-[#E5EAF0] text-xs">
          <span className="text-[#64748B] font-semibold mr-1">FILTER:</span>
          {['ALL', 'UNPAID', 'PAID', 'OVERDUE'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                filterStatus === status
                  ? 'bg-[#1677FF] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] border border-[#E5EAF0]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-semibold">
              <tr>
                <th className="py-3 px-4">CHALLAN ID</th>
                <th className="py-3 px-4">PLATE NUMBER</th>
                <th className="py-3 px-4">PENALTY AMOUNT</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">ISSUED AT</th>
                <th className="py-3 px-4">DUE DATE</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EDF3]">
              {filteredFines.map((f) => (
                <tr key={f.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#172033]">{f.fineId}</td>
                  <td className="py-3 px-4 font-bold text-[#1677FF]">
                    {f.plateNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#172033]">
                    ₹{f.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                        f.status === 'PAID'
                          ? 'bg-[#DCFCE7] text-[#16A34A]'
                          : 'bg-[#FEE2E2] text-[#EF4444]'
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">{f.issuedAt}</td>
                  <td className="py-3 px-4 text-[#64748B]">{f.dueDate}</td>
                  <td className="py-3 px-4 text-right">
                    {f.status === 'UNPAID' ? (
                      <button
                        onClick={() => onOpenPaymentModal(f)}
                        className="btn-3d btn-3d-success px-3.5 py-1.5 text-xs font-semibold"
                      >
                        Pay Demo Fine
                      </button>
                    ) : (
                      <span className="text-xs text-[#16A34A] flex items-center justify-end gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
