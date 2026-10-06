import React from 'react';
import { 
  Clock, 
  ShieldCheck, 
  Copy, 
  MessageCircle, 
  ArrowRight, 
  Home, 
  CheckCircle2, 
  FileText, 
  Smartphone,
  Calendar,
  Phone,
  Image as ImageIcon,
  Check
} from 'lucide-react';

export interface PendingOrderDetails {
  orderReference: string;
  courseTitle: string;
  courseThumbnail?: string;
  manualCurrency: 'EVC Plus' | 'eDahab' | 'ZAAD';
  recipientNumber: string;
  recipientName: string;
  amountPaid: string;
  paymentDate: string;
  senderPhoneNumber: string;
  paymentReference: string;
  screenshotFileName?: string | null;
  screenshotPreview?: string | null;
  buyerName?: string;
  buyerEmail?: string;
}

interface PendingVerificationModalProps {
  isOpen: boolean;
  order: PendingOrderDetails | null;
  onNavigateToDashboard?: () => void;
  onBackToHome: () => void;
  onCopy: (text: string, label: string) => void;
}

export const PendingVerificationModal: React.FC<PendingVerificationModalProps> = ({
  isOpen,
  order,
  onNavigateToDashboard,
  onBackToHome,
  onCopy
}) => {
  if (!isOpen || !order) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello Lafole Academy, I have submitted my manual payment for Order ${order.orderReference}.\n\n` +
    `Course: ${order.courseTitle}\n` +
    `Provider: ${order.manualCurrency}\n` +
    `Amount Paid: ${order.amountPaid}\n` +
    `Sender Phone: ${order.senderPhoneNumber}\n` +
    `Payment Ref: ${order.paymentReference}\n\n` +
    `Please verify and activate my course enrollment.`
  );

  const whatsappUrl = `https://wa.me/252619290900?text=${whatsappMessage}`;

  return (
    <div 
      id="modal-pending-payment-verification"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp my-auto">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/80 text-amber-500 flex items-center justify-center shadow-inner">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#22C55E] text-white flex items-center justify-center border-2 border-white dark:border-slate-900">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/70">
              PENDING PAYMENT VERIFICATION
            </div>
            <h2 className="text-2xl sm:text-[26px] font-black text-slate-900 dark:text-white tracking-tight">
              Payment Under Review
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              Your manual payment details have been received. Course access will unlock as soon as our finance team approves your transaction.
            </p>
          </div>
        </div>

        {/* Order Details Receipt Box */}
        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-700 space-y-3 text-xs">
          
          {/* Order Ref & Course */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 dark:border-slate-700/80">
            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                Order Reference
              </span>
              <div className="font-mono font-black text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <span>{order.orderReference}</span>
                <button
                  type="button"
                  onClick={() => onCopy(order.orderReference, 'Order Reference')}
                  className="text-slate-400 hover:text-[#22C55E] cursor-pointer"
                  title="Copy reference"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                Amount Paid
              </span>
              <div className="font-mono font-black text-base text-[#22C55E]">
                {order.amountPaid}
              </div>
            </div>
          </div>

          {/* Course Title */}
          <div className="py-1">
            <span className="text-slate-400 dark:text-slate-500 text-[11px] font-semibold">Course Item:</span>
            <div className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm truncate">
              {order.courseTitle}
            </div>
          </div>

          {/* Grid of verified items */}
          <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-slate-200/70 dark:border-slate-700/80">
            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold">Payment Method</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 mt-0.5">
                <Smartphone className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>{order.manualCurrency}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold">Merchant Recipient</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5" title={order.recipientName}>
                {order.recipientName}
              </div>
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold">Payment Date</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {order.paymentDate}
              </div>
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold">Sender Phone</span>
              <div className="font-semibold font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                {order.senderPhoneNumber}
              </div>
            </div>
          </div>

          {/* Payment Reference */}
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">
                Payment Reference / SMS ID
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                {order.paymentReference}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onCopy(order.paymentReference, 'Payment Reference')}
              className="text-slate-400 hover:text-[#22C55E] p-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Screenshot preview if uploaded */}
          {order.screenshotPreview && (
            <div className="pt-1 flex items-center space-x-2 text-[11px] text-slate-600 dark:text-slate-300">
              <ImageIcon className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
              <span className="truncate">Attached screenshot: {order.screenshotFileName || 'payment_proof.jpg'}</span>
              <span className="text-[#22C55E] font-bold">✓ Attached</span>
            </div>
          )}

        </div>

        {/* Informational Guidance Note */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Verification Process (15–60 Minutes)</span>
          </div>
          <p>
            Our registrar will cross-reference your reference code against our <strong>{order.manualCurrency}</strong> merchant statement ({order.recipientNumber} — {order.recipientName}).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* WhatsApp Direct Verification */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Us for Instant Verification (+252 61 9290900)</span>
          </a>

          {/* Navigate to Dashboard */}
          {onNavigateToDashboard && (
            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>View Order in Student Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Return to Home */}
          <button
            type="button"
            onClick={onBackToHome}
            className="w-full py-2.5 px-4 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium text-xs text-center transition-colors cursor-pointer"
          >
            Return to Home
          </button>
        </div>

      </div>
    </div>
  );
};
