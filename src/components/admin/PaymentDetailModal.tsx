import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Copy, 
  Check, 
  Clock, 
  AlertCircle, 
  Loader2,
  Mail,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  Phone,
  Trash2
} from 'lucide-react';
import { PaymentTableRecord } from '../../lib/firebase';
import { ScreenshotViewerModal } from './ScreenshotViewerModal';

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentTableRecord | null;
  onApprove: (paymentId: string) => Promise<void>;
  onReject: (paymentId: string, reason?: string) => Promise<void>;
  onNavigateToCourse?: (courseId: string) => void;
  isSuperAdmin?: boolean;
  onDeletePayment?: (payment: PaymentTableRecord) => void;
}

export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  isOpen,
  onClose,
  payment,
  onApprove,
  onReject,
  onNavigateToCourse,
  isSuperAdmin = false,
  onDeletePayment
}) => {
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('Payment reference could not be verified in mobile money statement');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!isOpen || !payment) return null;

  const handleCopyRef = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(payment.transaction_reference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    setActionSuccess(null);
    try {
      await onApprove(payment.id);
      setActionSuccess('Payment approved! Course enrollment is now ACTIVE.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    setActionSuccess(null);
    try {
      await onReject(payment.id, rejectReason);
      setActionSuccess('Payment marked as rejected.');
      setShowRejectReason(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRejecting(false);
    }
  };

  const formattedDate = payment.submitted_at
    ? new Date(payment.submitted_at).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '6 Oct 2026, 14:32';

  const isPending = payment.status === 'pending';
  const isApproved = payment.status === 'approved' || payment.status === 'paid';
  const isRejected = payment.status === 'rejected';

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs px-2.5 py-1 rounded-md font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                PAYMENT DETAILS
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                isApproved 
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : isRejected
                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              }`}>
                {isApproved ? 'Approved / Paid' : isRejected ? 'Rejected' : 'Pending Verification'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Banner */}
          {actionSuccess && (
            <div className="mx-6 mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center space-x-3 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Form Fields matching the brief exactly */}
          <div className="p-6 space-y-4.5 text-sm">
            {/* Student */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Student
              </label>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-base">
                    {payment.student_name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {payment.student_email}
                  </p>
                </div>
              </div>
            </div>

            {/* Course */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Course
              </label>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {payment.course_title}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      ID: {payment.course_id}
                    </p>
                  </div>
                </div>
                {onNavigateToCourse && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToCourse(payment.course_id);
                    }}
                    className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium flex items-center space-x-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Amount
              </label>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                  ${payment.amount.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500">
                  Currency: {payment.currency || 'USD'}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Payment Method
              </label>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {payment.payment_method}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Manual Mobile Money
                </span>
              </div>
            </div>

            {/* Transaction Reference */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Transaction Reference
              </label>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <span className="font-mono font-bold text-base text-slate-900 dark:text-white tracking-wider">
                  {payment.transaction_reference}
                </span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center space-x-1 transition-colors"
                >
                  {copiedRef ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sender Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Sender Number
              </label>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="font-mono font-medium text-slate-900 dark:text-white">
                    {payment.sender_phone || '2526XXXXXXXX'}
                  </span>
                </div>
                <a
                  href={`tel:${payment.sender_phone}`}
                  className="text-xs text-emerald-600 hover:underline"
                >
                  Call / SMS
                </a>
              </div>
            </div>

            {/* Submitted */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Submitted
              </label>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Screenshot */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Payment Screenshot
              </label>
              <button
                type="button"
                onClick={() => setIsScreenshotOpen(true)}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-emerald-500/70 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-semibold text-xs sm:text-sm hover:bg-emerald-100/60 dark:hover:bg-emerald-900/30 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
              >
                <Eye className="w-4 h-4" />
                <span>[ View Screenshot ]</span>
              </button>
            </div>

            {/* Verification Metadata (if approved/rejected) */}
            {payment.verified_at && (
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Verified By:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{payment.verified_by || 'Admin'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified At:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {new Date(payment.verified_at).toLocaleString('en-GB')}
                  </span>
                </div>
              </div>
            )}

            {/* Backend Transition Blueprint Visualizer */}
            {isApproved && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs space-y-1.5 font-mono text-emerald-800 dark:text-emerald-300">
                <div className="font-bold flex items-center space-x-1.5 text-[11px] uppercase tracking-wide">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>State Transition Executed:</span>
                </div>
                <div className="text-[11px] leading-relaxed pl-1 text-slate-600 dark:text-slate-400">
                  Payment (PAID) → Order (COMPLETED) → Enrollment (ACTIVE) → Student course access granted.
                </div>
              </div>
            )}

            {/* Rejection reason input form if toggled */}
            {showRejectReason && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl space-y-3">
                <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                  Reason for rejecting payment:
                </p>
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Transaction ID not found on bank/SMS statement"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectReason(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isRejecting}
                    onClick={handleReject}
                    className="px-4 py-1.5 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                  >
                    {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
                  </button>
                </div>
              </div>
            )}

            {/* Horizontal divider requested in mockup */}
            <div className="border-t border-slate-200 dark:border-slate-800 my-4" />

            {/* Action Buttons: [ APPROVE PAYMENT ] & [ REJECT PAYMENT ] */}
            <div className="space-y-3">
              <button
                type="button"
                disabled={isApproving || isApproved}
                onClick={handleApprove}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center space-x-2 ${
                  isApproved
                    ? 'bg-emerald-600/30 text-emerald-700 dark:text-emerald-400 cursor-not-allowed border border-emerald-500/40'
                    : 'bg-[#22C55E] hover:bg-[#16A34A] text-white hover:shadow-lg hover:shadow-emerald-500/20 cursor-pointer active:scale-[0.99]'
                }`}
              >
                {isApproving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Approval & Activating Course...</span>
                  </>
                ) : isApproved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>PAYMENT APPROVED & ENROLLMENT ACTIVE</span>
                  </>
                ) : (
                  <span>[ APPROVE PAYMENT ]</span>
                )}
              </button>

              {!isApproved && !showRejectReason && (
                <button
                  type="button"
                  disabled={isRejecting || isRejected}
                  onClick={() => setShowRejectReason(true)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all border flex items-center justify-center space-x-2 ${
                    isRejected
                      ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 cursor-not-allowed'
                      : 'border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer'
                  }`}
                >
                  {isRejected ? (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>PAYMENT REJECTED</span>
                    </>
                  ) : (
                    <span>[ REJECT PAYMENT ]</span>
                  )}
                </button>
              )}

              {isSuperAdmin && onDeletePayment && (
                <button
                  type="button"
                  onClick={() => onDeletePayment(payment)}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Payment Record (Super Admin)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Viewer Modal */}
      <ScreenshotViewerModal
        isOpen={isScreenshotOpen}
        onClose={() => setIsScreenshotOpen(false)}
        payment={payment}
      />
    </>
  );
};
