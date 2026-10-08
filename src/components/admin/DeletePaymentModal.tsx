import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, Loader2, CreditCard } from 'lucide-react';
import { PaymentTableRecord } from '../../lib/firebase';

interface DeletePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentTableRecord | null;
  onConfirmDelete: (paymentId: string) => Promise<void>;
}

export const DeletePaymentModal: React.FC<DeletePaymentModalProps> = ({
  isOpen,
  onClose,
  payment,
  onConfirmDelete
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !payment) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirmDelete(payment.id);
      onClose();
    } catch (err) {
      console.warn("Delete payment failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center">
            <Trash2 className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span>Super Admin Action</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Delete Payment Record?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Are you sure you want to permanently delete payment transaction <strong className="text-slate-900 dark:text-white font-mono">{payment.transaction_reference}</strong>?
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Student:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{payment.student_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email:</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{payment.student_email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Amount / Course:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">${payment.amount} • {payment.course_title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Method:</span>
            <span className="text-slate-700 dark:text-slate-300">{payment.payment_method}</span>
          </div>
        </div>

        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/60 flex items-start space-x-2 text-xs text-rose-700 dark:text-rose-300">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>This will permanently delete this payment transaction record from Firestore and the administrator dashboard.</span>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs sm:text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-sm flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Payment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
