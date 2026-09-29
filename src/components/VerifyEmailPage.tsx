import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Mail, RefreshCw, ShoppingCart } from 'lucide-react';
import { verifyEmailByToken, validateStudentVerificationStatus } from '../lib/firebase';
import { Course } from '../types';
import { addCourseToCart } from '../utils/cartUtils';
import { formatNameFromEmail, formatStudentDisplayName } from '../utils/userUtils';

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
  const [status, setStatus] = useState<'verifying' | 'success' | 'already_verified' | 'error'>('verifying');
  const [message, setMessage] = useState<string>('Verifying your email token with Firestore...');
  const [verifiedEmail, setVerifiedEmail] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');
  const [enrolledCourseTitle, setEnrolledCourseTitle] = useState<string>('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashQuery = typeof window !== 'undefined' && window.location.hash.includes('?') 
      ? window.location.hash.substring(window.location.hash.indexOf('?')) 
      : '';
    const hashParams = new URLSearchParams(hashQuery);

    const token = searchParams.get('token') || searchParams.get('oobCode') || hashParams.get('token') || hashParams.get('oobCode') || '';
    const email = searchParams.get('email') || hashParams.get('email') || '';
    if (email) setVerifiedEmail(email);

    if (!token) {
      const emailToCheck = email || (typeof window !== 'undefined' ? localStorage.getItem('lafole_verified_email') : '') || '';
      if (emailToCheck) {
        validateStudentVerificationStatus(emailToCheck).then((dbStatus) => {
          if (dbStatus.verified) {
            const studentName = formatStudentDisplayName(dbStatus.fullName, emailToCheck);
            setVerifiedEmail(emailToCheck);
            setStatus('already_verified');
            setMessage('Your email address is already verified in the database and your student account is active.');
            
            let targetCourseId = '';
            const lastEnroll = typeof window !== 'undefined' ? localStorage.getItem('last_lafole_enrollment') : null;
            if (lastEnroll) {
              try {
                const parsed = JSON.parse(lastEnroll);
                if (parsed.courseId) {
                  targetCourseId = parsed.courseId;
                  setCourseId(parsed.courseId);
                  setEnrolledCourseTitle(parsed.courseTitle || '');
                }
              } catch {}
            }
            onEmailVerified?.(emailToCheck, studentName, targetCourseId);
          } else {
            setStatus('error');
            setMessage('No verification token provided in URL. For account security, you must click the verification link sent directly to your email address.');
          }
        }).catch(() => {
          setStatus('error');
          setMessage('No verification token provided in URL. Please click the verification link sent to your email address.');
        });
        return;
      }
      setStatus('error');
      setMessage('No verification token provided in URL. Please check your email inbox and click the verification link sent to your address.');
      return;
    }

    async function executeVerification() {
      const res = await verifyEmailByToken(token, email);
      if (res.success) {
        const resolvedEmail = email || res.record?.email || '';
        const resolvedName = formatStudentDisplayName(res.record?.fullName, resolvedEmail);
        const resolvedCourseId = res.record?.courseId || '';
        if (resolvedEmail) {
          setVerifiedEmail(resolvedEmail);
        }

        if ((res as any).alreadyVerified) {
          // Email link was clicked again after having already been verified
          setStatus('already_verified');
          setMessage("This email address has already been verified. Your student account is active and you can sign in directly.");
          if (resolvedCourseId) {
            setCourseId(resolvedCourseId);
            setEnrolledCourseTitle(res.record?.courseTitle || '');
          }
          onEmailVerified?.(resolvedEmail, resolvedName, resolvedCourseId);
          return;
        }

        // First-time successful verification
        setStatus('success');
        setMessage(res.message);
        if (resolvedCourseId && resolvedCourseId !== 'general-student') {
          setCourseId(resolvedCourseId);
          setEnrolledCourseTitle(res.record?.courseTitle || '');
        }
        onEmailVerified?.(resolvedEmail, resolvedName, resolvedCourseId);
      } else {
        setStatus('error');
        setMessage(res.message);
      }
    }

    executeVerification();
  }, [courses, onEmailVerified]);

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

        {status === 'already_verified' && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-500 dark:text-blue-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-10 h-10 text-[#22C55E]" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Email Already Verified
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This email address has already been verified and your student account is active. You do not need to click this link again.
            </p>
            {verifiedEmail && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300">
                {verifiedEmail}
              </div>
            )}

            <div className="pt-2 space-y-2.5">
              <button
                id="btn-verified-go-dashboard-dup"
                onClick={onGoToDashboard}
                className="w-full py-3.5 px-6 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Go to My Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onBackToHome}
                className="w-full py-2.5 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                Back to Home
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
              Verification Link Required
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {message}
            </p>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-left space-y-1.5">
              <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 block uppercase tracking-wider">
                Strict Security Policy
              </span>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                To prevent unauthorized access and fake accounts, email verification must be completed strictly by clicking the activation link sent directly to your personal email inbox.
              </p>
            </div>

            <div className="pt-3 space-y-2">
              <button
                onClick={onGoToDashboard}
                className="w-full py-3 px-6 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Go to Sign In
              </button>
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
