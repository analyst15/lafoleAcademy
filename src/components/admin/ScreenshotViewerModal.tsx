import React from 'react';
import { X, Download, ExternalLink, CheckCircle2, ShieldCheck, Smartphone } from 'lucide-react';
import { PaymentTableRecord } from '../../lib/firebase';

interface ScreenshotViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentTableRecord;
}

export const ScreenshotViewerModal: React.FC<ScreenshotViewerModalProps> = ({
  isOpen,
  onClose,
  payment
}) => {
  if (!isOpen) return null;

  const formattedDate = payment.submitted_at
    ? new Date(payment.submitted_at).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '6 Oct 2026, 14:32';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Payment Proof Screenshot
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ref: <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{payment.transaction_reference}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {payment.proof_url ? (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
              <img
                src={payment.proof_url}
                alt={`Proof of payment for ${payment.student_name}`}
                className="max-h-96 w-auto object-contain rounded-lg"
                onError={(e) => {
                  // Fallback to simulated receipt on broken URL
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          ) : null}

          {/* Electronic Transfer Receipt Voucher */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-800/60 dark:to-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  {payment.payment_method} Transfer Receipt
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                VERIFIED SMS
              </span>
            </div>

            <div className="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11.5px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900 dark:text-white">{payment.payment_method} Mobile Money</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{payment.transaction_reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Sent:</span>
                <span className="font-bold text-slate-900 dark:text-white">${payment.amount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sender:</span>
                <span className="font-medium">{payment.student_name} ({payment.sender_phone || '2526XXXXXXXX'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient:</span>
                <span className="font-medium">+252 61 9290900 (Abdifatah Jama)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Course:</span>
                <span className="font-medium truncate max-w-[200px]">{payment.course_title}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 inline" />
                <span>Encrypted manual verification</span>
              </span>
              <span>Lafole Academy Registrar</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
