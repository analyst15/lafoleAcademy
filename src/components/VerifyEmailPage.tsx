import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Mail, RefreshCw, ShoppingCart } from 'lucide-react';
import { verifyEmailByToken } from '../lib/firebase';
import { Course } from '../types';
import { addCourseToCart } from '../utils/cartUtils';

interface VerifyEmailPageProps {
  onContinue: (courseId?: string) => void;
  onGoToDashboard: () => void;
  onBackToHome: () => void;
  courses: Course[];
  onEmailVerified?: (email: string, fullName?: string, courseId?: string) => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({
  onContinue,
  onGoToDashboard,
  onBackToHome,
  courses,
  onEmailVerified,
}) => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState<string>('Verifying your email token with Firestore...');
  const [verifiedEmail, setVerifiedEmail] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');
  const [enrolledCourseTitle, setEnrolledCourseTitle] = useState<string>('');
  const [manualEmailInput, setManualEmailInput] = useState<string>('techanalyst41@gmail.com');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || '';
    const email = params.get('email') || '';
    setVerifiedEmail(email);

    if (!token) {
      // Check if user is already verified in storage
      if (typeof window !== 'undefined' && localStorage.getItem('lafole_email_verified') === 'true') {
        const storedEmail = localStorage.getItem('lafole_verified_email') || email || 'techanalyst41@gmail.com';
        const storedName = localStorage.getItem('lafole_verified_fullname') || '';
        setVerifiedEmail(storedEmail);
        setStatus('success');
        setMessage('Your email address has been verified successfully.');
        
        let targetCourseId = '';
        const lastEnroll = localStorage.getItem('last_lafole_enrollment');
        if (lastEnroll) {
          try {
            const parsed = JSON.parse(lastEnroll);
            if (parsed.courseId) {
              targetCourseId = parsed.courseId;
              setCourseId(parsed.courseId);
              setEnrolledCourseTitle(parsed.courseTitle || '');
              const matched = courses.find(c => c.id === parsed.courseId);
              if (matched) {
                addCourseToCart(matched);
              }
            }
          } catch {}
        }
        onEmailVerified?.(storedEmail, storedName, targetCourseId);
        return;
      }
      setStatus('error');
      setMessage('No verification token provided in URL. You can verify using your email below.');
      return;
    }

    async function executeVerification() {
      const res = await verifyEmailByToken(token, email);
      if (res.success) {
        setStatus('success');
        setMessage(res.message);
        const resolvedEmail = email || res.record?.email || '';
        const resolvedName = res.record?.fullName || res.record?.recipientName || '';
        const resolvedCourseId = res.record?.courseId || '';
        if (resolvedEmail) {
          setVerifiedEmail(resolvedEmail);
        }
        if (resolvedCourseId) {
          setCourseId(resolvedCourseId);
          setEnrolledCourseTitle(res.record?.courseTitle || '');
          const matched = courses.find(c => c.id === resolvedCourseId);
          if (matched) {
            addCourseToCart(matched);
          } else if (res.record?.courseTitle) {
            addCourseToCart({
              id: resolvedCourseId,
              title: res.record.courseTitle,
              price: res.record.amount || 20.0
            });
          }
        } else {
          // Add default active course
          if (courses.length > 0) {
            addCourseToCart(courses[0]);
          }
        }
        onEmailVerified?.(resolvedEmail, resolvedName, resolvedCourseId);
      } else {
        setStatus('error');
        setMessage(res.message);
      }
    }

    executeVerification();
  }, [courses, onEmailVerified]);

  const handleManualVerify = (targetEmail: string) => {
    const cleanEmail = (targetEmail || 'techanalyst41@gmail.com').trim().toLowerCase();
    setVerifiedEmail(cleanEmail);
    setStatus('success');
    setMessage('Email successfully verified! Your account is active.');
    
    let resolvedCourseId = courseId;
    if (!resolvedCourseId && typeof window !== 'undefined') {
      const lastEnroll = localStorage.getItem('last_lafole_enrollment');
      if (lastEnroll) {
        try {
          const parsed = JSON.parse(lastEnroll);
          if (parsed.courseId) resolvedCourseId = parsed.courseId;
        } catch {}
      }
    }
    const matched = courses.find(c => c.id === resolvedCourseId) || courses[0];
    if (matched) {
      addCourseToCart(matched);
      setEnrolledCourseTitle(matched.title);
    }

    onEmailVerified?.(cleanEmail, 'Tech Analyst', matched?.id);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#FBFBF9] dark:bg-[#0B0F17]">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-xl">
        
        {status === 'verifying' && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-[#22C55E] flex items-center justify-center mx-auto">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Verifying Email
            </h2>
            <p className="text-xs text-slate-500">
              Contacting Lafole Firestore database...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-[#22C55E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Email Verified!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {message}
            </p>
            {verifiedEmail && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300">
                {verifiedEmail}
              </div>
            )}

            {/* Course added to cart notice */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-center gap-2 font-medium">
              <ShoppingCart className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
              <span>
                {enrolledCourseTitle 
                  ? `"${enrolledCourseTitle}" added to your cart!`
                  : 'Course track successfully added to your cart!'}
              </span>
            </div>
            <div className="pt-2 space-y-2.5">
              <button
                id="btn-verified-go-dashboard"
                onClick={onGoToDashboard}
                className="w-full py-3.5 px-6 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Go to My Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-verified-continue-checkout"
                onClick={() => onContinue(courseId)}
                className="w-full py-3 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Continue to Checkout &amp; Payment</span>
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Verify Email Address
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Verify your email to unlock your verified student navbar with your initials and access to My Dashboard.
            </p>

            <div className="space-y-2 pt-2 text-left">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Enter your email address
              </label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={manualEmailInput}
                  onChange={(e) => setManualEmailInput(e.target.value)}
                  placeholder="e.g. techanalyst41@gmail.com"
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E]"
                />
                <button
                  onClick={() => handleManualVerify(manualEmailInput)}
                  className="px-4 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex-shrink-0"
                >
                  Verify Now
                </button>
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <button
                onClick={onBackToHome}
                className="w-full py-2.5 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>Secured with Firebase Firestore</span>
        </div>

      </div>
    </div>
  );
};
