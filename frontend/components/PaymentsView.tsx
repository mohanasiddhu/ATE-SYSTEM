import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  CheckCircle2,
  QrCode,
  Printer,
  ShieldCheck,
  Receipt,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Fine, PaymentRecord } from '../types';

interface PaymentsViewProps {
  payments: PaymentRecord[];
  activeFineForPayment: Fine | null;
  onClosePaymentModal: () => void;
  onPaymentSuccess: (payment: PaymentRecord) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  payments,
  activeFineForPayment,
  onClosePaymentModal,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [receiptToShow, setReceiptToShow] = useState<PaymentRecord | null>(null);

  const handleProcessPayment = () => {
    if (!activeFineForPayment) return;
    setIsProcessing(true);

    setTimeout(() => {
      const now = new Date();
      const newPay: PaymentRecord = {
        id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
        fineId: activeFineForPayment.id,
        transactionRef: `TXN-DEMO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        amount: activeFineForPayment.amount,
        method: selectedMethod === 'UPI' ? 'Demo UPI (GPay / PhonePe)' : selectedMethod === 'CARD' ? 'Demo Visa / RuPay Card' : 'Demo Net Banking',
        paidAt: 'Just now',
        receiptNumber: `RCP-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        plateNumber: activeFineForPayment.plateNumber,
      };

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if unavailable
      }

      setIsProcessing(false);
      onPaymentSuccess(newPay);
      setReceiptToShow(newPay);
    }, 1100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-[#172033]">
            Payment Reconciliation & Gateway Simulator
          </h2>
          <p className="text-xs text-[#64748B]">
            Citizen Online Fine Clearance, Transaction Hashes & Certified Digital Receipts
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#16A34A]">
          <ShieldCheck className="w-4 h-4" />
          <span>AES-256 Mock Gateway Active</span>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="p-4 border-b border-[#E8EDF3] flex items-center justify-between bg-[#F8FAFC]">
          <span className="font-bold text-sm text-[#172033]">
            Settled Transaction Receipts ({payments.length})
          </span>
          <span className="text-xs text-[#64748B]">Immutable Payment Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-semibold">
              <tr>
                <th className="py-3 px-4">TRANSACTION REF</th>
                <th className="py-3 px-4">RECEIPT NO</th>
                <th className="py-3 px-4">PLATE NUMBER</th>
                <th className="py-3 px-4">AMOUNT SETTLED</th>
                <th className="py-3 px-4">PAYMENT METHOD</th>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4 text-right">RECEIPT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EDF3]">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-[#1677FF]">{p.transactionRef}</td>
                  <td className="py-3 px-4 font-medium text-[#172033]">{p.receiptNumber}</td>
                  <td className="py-3 px-4 font-bold text-[#172033]">{p.plateNumber}</td>
                  <td className="py-3 px-4 font-bold text-[#16A34A]">₹{p.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-[#64748B]">{p.method}</td>
                  <td className="py-3 px-4 text-[#64748B]">{p.paidAt}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setReceiptToShow(p)}
                      className="px-3 py-1 rounded-lg bg-white hover:bg-slate-50 border border-[#D9E1EA] text-[#172033] text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAYMENT CHECKOUT MODAL */}
      {activeFineForPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-[#E5EAF0] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#1677FF]" />
                <h3 className="font-bold text-sm text-[#172033]">
                  Simulated e-Challan Checkout
                </h3>
              </div>
              <button
                onClick={onClosePaymentModal}
                disabled={isProcessing}
                className="text-[#64748B] hover:text-[#172033] text-sm"
              >
                ✕
              </button>
            </div>

            {/* Bill Info */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Fine Reference</span>
                <span className="font-bold text-[#172033]">{activeFineForPayment.fineId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Vehicle Plate</span>
                <span className="font-bold text-[#1677FF]">{activeFineForPayment.plateNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Reason</span>
                <span className="text-[#172033] text-right font-medium">{activeFineForPayment.noticeText}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF0] text-sm">
                <span className="font-bold text-[#172033]">Total Payable</span>
                <span className="font-bold text-[#16A34A] text-base">
                  ₹{activeFineForPayment.amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs text-[#64748B] font-semibold block">
                Select Demo Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('UPI')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === 'UPI'
                      ? 'bg-blue-50 border-[#1677FF] text-[#1677FF] font-semibold'
                      : 'bg-[#F8FAFC] border-[#E5EAF0] text-[#64748B] hover:border-[#CBD5E1]'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1 text-[#1677FF]" />
                  <span>Demo UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('CARD')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === 'CARD'
                      ? 'bg-blue-50 border-[#1677FF] text-[#1677FF] font-semibold'
                      : 'bg-[#F8FAFC] border-[#E5EAF0] text-[#64748B] hover:border-[#CBD5E1]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#16A34A]" />
                  <span>Demo Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('NETBANKING')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === 'NETBANKING'
                      ? 'bg-blue-50 border-[#1677FF] text-[#1677FF] font-semibold'
                      : 'bg-[#F8FAFC] border-[#E5EAF0] text-[#64748B] hover:border-[#CBD5E1]'
                  }`}
                >
                  <Receipt className="w-5 h-5 mx-auto mb-1 text-[#F59E0B]" />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full py-3 btn-3d btn-3d-success text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Authorizing Mock Transaction...</span>
              ) : (
                <>
                  <span>Authorize Demo Payment (₹{activeFineForPayment.amount})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* RECEIPT VIEW MODAL */}
      {receiptToShow && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-[#E5EAF0] shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0]">
              <h3 className="font-bold text-sm text-[#172033]">
                Official Digital Payment Receipt
              </h3>
              <button onClick={() => setReceiptToShow(null)} className="text-[#64748B] hover:text-[#172033]">
                ✕
              </button>
            </div>

            <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] text-[#172033] text-xs space-y-3">
              <div className="text-center border-b border-[#E5EAF0] pb-2">
                <h4 className="font-bold text-sm">SMART TRAFFIC ENFORCEMENT</h4>
                <p className="text-[11px] text-[#64748B]">STATE TRAFFIC DEPARTMENT · E-CHALLAN RECEIPT</p>
                <p className="text-[10px] text-[#94A3B8]">ACADEMIC SIMULATION · NON-BINDING</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Receipt Number:</span>
                  <span className="font-semibold text-[#172033]">{receiptToShow.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Transaction Ref:</span>
                  <span className="font-mono text-[#1677FF] font-semibold">{receiptToShow.transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Vehicle Plate:</span>
                  <span className="font-bold text-[#172033]">{receiptToShow.plateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Payment Channel:</span>
                  <span className="text-[#172033]">{receiptToShow.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Status:</span>
                  <span className="font-bold text-[#16A34A]">SUCCESS // SETTLED</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5EAF0] flex justify-between font-bold text-sm">
                <span>Amount Paid:</span>
                <span className="text-[#16A34A]">₹{receiptToShow.amount.toLocaleString()}</span>
              </div>

              <div className="pt-2 text-[10px] text-[#94A3B8] text-center">
                This simulated computer receipt certifies electronic clearance of the indicated demo fine.
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-[#D9E1EA] text-[#172033] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-[#1677FF]" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setReceiptToShow(null)}
                className="flex-1 py-2.5 rounded-lg bg-[#1677FF] hover:bg-[#0958d9] text-white font-semibold text-xs cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
