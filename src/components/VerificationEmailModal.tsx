import React, { useState } from 'react';
import { Mail, CheckCircle2, Copy, ExternalLink, X, ShieldCheck, Sparkles } from 'lucide-react';

interface VerificationEmailModalProps {
  recipientName: string;
  recipientEmail: string;
  verificationToken: string;
  verificationUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => Promise<void> | void;
  isVerified?: boolean;
}

export const VerificationEmailModal: React.FC<VerificationEmailModalProps> = ({
  recipientName,
  recipientEmail,
  verificationToken,
  verificationUrl,
  isOpen,
  onClose,
  onVerify,
  isVerified = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleVerifyClick = async () => {
    setVerifying(true);
    try {
      await onVerify();
    } finally {
      setVerifying(false);
    }
  };

  const displayName = recipientName ? recipientName.split(' ')[0] : 'Student';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      
      {/* Container simulating the user's email client inbox view */}
      <div className="relative w-full max-w-2xl bg-[#F4F5F7] dark:bg-[#0B0F17] rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-800 overflow-hidden my-auto animate-scaleUp">
        
        {/* Email Client Header Bar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#22C55E] flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <span>Lafole Academy &lt;admissions@lafole.net&gt;</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-mono">
                  Inbox
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                To: {recipientName} &lt;{recipientEmail}&gt;
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Close email preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* EMAIL BODY - Matches https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Lafole%2FEmail.png */}
        <div className="p-4 sm:p-8">
          
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs max-w-xl mx-auto space-y-6">
            
            {/* Title: One Last Step! */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              One Last Step!
            </h2>

            {/* Greeting */}
            <p className="text-base text-slate-800 dark:text-slate-200 font-medium">
              Hi {displayName},
            </p>

            {/* Paragraph 1 */}
            <p className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed">
              Thank you for enrolling at Lafole! Your account is active and your course access is ready.
            </p>

            {/* Paragraph 2 */}
            <p className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed">
              Please verify your email address so we can send you course updates, payment receipts, and important notifications.
            </p>

            {/* Primary Action Button: Verify My Email */}
            <div className="pt-2 pb-2">
              {isVerified ? (
                <div className="inline-flex items-center space-x-2 px-5 py-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#22C55E] rounded-xl font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Email Verified Successfully!</span>
                </div>
              ) : (
                <button
                  id="btn-verify-my-email"
                  type="button"
                  disabled={verifying}
                  onClick={handleVerifyClick}
                  className="inline-flex items-center justify-center px-6 py-3.5 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-50 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {verifying ? (
                    <span className="flex items-center space-x-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Verifying on Firestore...</span>
                    </span>
                  ) : (
                    <span>Verify My Email</span>
                  )}
                </button>
              )}
            </div>

            {/* Fallback link instructions */}
            <div className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-400">
              <p>If the button doesn't work, copy and paste this link:</p>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-[11px] break-all text-slate-700 dark:text-slate-300 flex items-center justify-between gap-2">
                <span className="line-clamp-2 select-all">{verificationUrl}</span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-shrink-0 p-1 text-slate-500 hover:text-black dark:hover:text-white"
                  title="Copy link"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expiration Note */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This link expires in 24 hours. If it expires, log in to your dashboard and click "Resend Verification"
            </p>

            {/* Sign-off */}
            <div className="pt-2 text-sm text-slate-700 dark:text-slate-300 space-y-0.5">
              <p>Happy learning,</p>
              <p className="font-bold text-slate-900 dark:text-white">The Lafole Team</p>
            </div>

          </div>

          {/* Bottom Bar in Simulator */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 max-w-xl mx-auto px-1">
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Synced with Firebase Firestore (Lafole Project)</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-600 dark:text-slate-300 hover:underline font-semibold cursor-pointer"
            >
              Continue on Checkout
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
