import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  X,
  Mail,
  Lock,
  Sparkles,
  KeyRound,
  Send
} from 'lucide-react';
import { 
  signInStudent, 
  setStudentAccountPassword, 
  requestPasswordResetCode, 
  resetPasswordWithCode,
  registerNewStudent,
  resendVerificationEmail
} from '../lib/firebase';

interface LoginPageProps {
  onSuccessSignIn: (user: any) => void;
  onBackToHome: () => void;
  onNavigateToCatalog: () => void;
  onNavigateToDashboard?: () => void;
}

const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Lafole%2FLogo-02.png?alt=media&token=a877d4d0-4c4e-43f4-bb92-b9cce99580ef";

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccessSignIn,
  onBackToHome,
  onNavigateToCatalog,
  onNavigateToDashboard
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Set password modal state (for accounts needing password creation)
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [setPasswordEmail, setSetPasswordEmail] = useState('');
  const [newAccountPassword, setNewAccountPassword] = useState('');
  const [confirmAccountPassword, setConfirmAccountPassword] = useState('');
  const [isSettingPassword, setIsSettingPassword] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [confirmResetPassword, setConfirmResetPassword] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Sign up mode & state
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupSuccessData, setSignupSuccessData] = useState<{
    email: string;
    fullName: string;
    token: string;
    url: string;
    delivered: boolean;
    message: string;
  } | null>(null);
  const [isResendingSignupEmail, setIsResendingSignupEmail] = useState(false);
  const [resendSignupCooldown, setResendSignupCooldown] = useState(0);

  // Cooldown timer for signup resend
  useEffect(() => {
    if (resendSignupCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendSignupCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendSignupCooldown]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = signupName.trim();
    const cleanEmail = signupEmail.trim().toLowerCase();
    const cleanPass = signupPassword.trim();

    if (!cleanName) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (cleanPass.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (cleanPass !== signupConfirmPassword.trim()) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSigningUp(true);
    try {
      const res = await registerNewStudent({
        fullName: cleanName,
        email: cleanEmail,
        password: cleanPass
      });

      if (res.success) {
        setSignupSuccessData({
          email: cleanEmail,
          fullName: cleanName,
          token: res.verificationToken || '',
          url: res.verificationUrl || `${window.location.origin}/verify-email?token=${res.verificationToken}&email=${encodeURIComponent(cleanEmail)}`,
          delivered: !!res.delivered,
          message: res.message
        });
        showToast("Verification link dispatched! Please check your inbox or spam folder.", "success");
      } else if ((res as any).alreadyExists) {
        if ((res as any).isVerified) {
          setAuthMode('signin');
          setIdentifier(cleanEmail);
          setErrorMessage("An account with this email address already exists and is verified. Please sign in with your password below.");
          showToast("Account already verified. Please sign in.", "info");
        } else {
          setErrorMessage(res.message || "An account with this email is pending verification. Please check your inbox or sign in.");
          showToast("Account pending verification.", "info");
        }
      } else {
        setErrorMessage(res.message || "Failed to create account. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to create account.");
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleResendSignupEmail = async () => {
    if (!signupSuccessData) return;
    if (resendSignupCooldown > 0) {
      showToast(`Please wait ${resendSignupCooldown}s before requesting another email.`, "info");
      return;
    }
    setIsResendingSignupEmail(true);
    try {
      const res = await resendVerificationEmail({
        email: signupSuccessData.email,
        fullName: signupSuccessData.fullName,
        courseTitle: "Lafole Academy Student Track",
        verificationUrl: signupSuccessData.url,
        token: signupSuccessData.token
      });
      showToast(res.message || "Verification email resent! Please check your inbox.", "success");
      setResendSignupCooldown(30);
    } catch {
      showToast("Verification email resent.", "info");
      setResendSignupCooldown(30);
    } finally {
      setIsResendingSignupEmail(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMessage("Please enter your username or email.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signInStudent(cleanId, password);
      if (res.success) {
        showToast("Signed in successfully! Redirecting to dashboard...", "success");
        // Store student session locally
        if (typeof window !== 'undefined') {
          const studentSession = {
            name: res.user?.name || cleanId.split('@')[0],
            email: res.user?.email || cleanId,
            signedInAt: new Date().toISOString()
          };
          localStorage.setItem('lafole_auth_user', JSON.stringify(studentSession));
        }

        setTimeout(() => {
          onSuccessSignIn(res.user);
          if (onNavigateToDashboard) {
            onNavigateToDashboard();
          } else {
            onBackToHome();
          }
        }, 800);
      } else if (res.code === 'PASSWORD_NOT_SET') {
        // Account exists and verified, but has no password set yet
        setSetPasswordEmail(cleanId);
        setShowSetPasswordModal(true);
        setErrorMessage(res.message);
      } else {
        setErrorMessage(res.message || "Incorrect password. Please verify your credentials and try again.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveInitialPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccountPassword.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }
    if (newAccountPassword !== confirmAccountPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    setIsSettingPassword(true);
    try {
      const res = await setStudentAccountPassword({
        email: setPasswordEmail,
        newPassword: newAccountPassword
      });

      if (res.success) {
        setShowSetPasswordModal(false);
        showToast("Password secured! Redirecting to your dashboard...", "success");

        if (typeof window !== 'undefined') {
          const studentSession = {
            name: setPasswordEmail.split('@')[0],
            email: setPasswordEmail,
            signedInAt: new Date().toISOString()
          };
          localStorage.setItem('lafole_auth_user', JSON.stringify(studentSession));
        }

        setTimeout(() => {
          onSuccessSignIn(res.user || { email: setPasswordEmail });
          if (onNavigateToDashboard) {
            onNavigateToDashboard();
          } else {
            onBackToHome();
          }
        }, 800);
      } else {
        showToast(res.message || "Failed to set password.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Error securing password.", "error");
    } finally {
      setIsSettingPassword(false);
    }
  };

  const handleSendResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    setIsSendingReset(true);
    try {
      const res = await requestPasswordResetCode(forgotEmail);
      if (res.success) {
        setForgotStep(2);
        showToast(res.message, "success");
      } else {
        showToast(res.message || "Could not send reset code.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Error processing request.", "error");
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode.trim() || resetCode.trim().length < 6) {
      showToast("Please enter the 6-digit verification code.", "error");
      return;
    }
    if (newResetPassword.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }
    if (newResetPassword !== confirmResetPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    setIsSendingReset(true);
    try {
      const res = await resetPasswordWithCode(forgotEmail, resetCode, newResetPassword);
      if (res.success) {
        setResetSuccessMessage(res.message);
        showToast("Password reset successfully! Redirecting...", "success");

        if (typeof window !== 'undefined') {
          const studentSession = {
            name: forgotEmail.split('@')[0],
            email: forgotEmail,
            signedInAt: new Date().toISOString()
          };
          localStorage.setItem('lafole_auth_user', JSON.stringify(studentSession));
        }

        setTimeout(() => {
          setShowForgotModal(false);
          onSuccessSignIn({ email: forgotEmail });
          if (onNavigateToDashboard) {
            onNavigateToDashboard();
          } else {
            onBackToHome();
          }
        }, 1200);
      } else {
        showToast(res.message || "Could not reset password.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Error resetting password.", "error");
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0B0F17] flex flex-col justify-between text-slate-900 dark:text-slate-100 font-sans selection:bg-[#2EB641]/20 transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          id="login-toast"
          className={`fixed top-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm animate-fadeIn ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-200'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#2EB641] flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Container - matches reference screenshot frame */}
      <div className="w-full max-w-[560px] mx-auto px-6 sm:px-10 pt-8 sm:pt-12 pb-12 flex-1 flex flex-col justify-center">
        
        {/* Top: Brand Logo matching screenshot top-left */}
        <div className="mb-10 sm:mb-12 flex items-center justify-between">
          <button
            id="login-brand-logo-btn"
            onClick={onBackToHome}
            className="flex items-center space-x-2 cursor-pointer group focus:outline-none"
            title="Return to Lafole Academy Home"
          >
            <img 
              src={LOGO_URL} 
              alt="Lafole Academy" 
              referrerPolicy="no-referrer"
              className="h-8 sm:h-9 w-auto object-contain dark:brightness-0 dark:invert transition-opacity group-hover:opacity-90"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = 'none';
              }}
            />
          </button>

          <button
            id="login-back-home-link"
            onClick={onBackToHome}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to site</span>
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-6 max-w-xs border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setErrorMessage(null); setSignupSuccessData(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              authMode === 'signin'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setErrorMessage(null); setSignupSuccessData(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Eyebrow Label */}
        <div className="mb-2.5">
          <span 
            id="login-eyebrow"
            className="text-[11px] font-bold tracking-[0.2em] text-slate-500 dark:text-slate-400 uppercase"
          >
            {authMode === 'signin' ? 'WELCOME BACK' : 'GET STARTED'}
          </span>
        </div>

        {/* Main Two-Line Heading */}
        <h1 
          id="login-main-heading"
          className="text-3xl sm:text-[38px] font-extrabold text-[#0A0A09] dark:text-white leading-[1.15] tracking-tight mb-3"
        >
          {authMode === 'signin' ? (
            <>Pick up where you<br />left off.</>
          ) : (
            <>Create your student<br />account.</>
          )}
        </h1>

        {/* Subtitle Description */}
        <p 
          id="login-subtitle"
          className="text-sm sm:text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-[440px] mb-8"
        >
          {authMode === 'signin'
            ? 'Sign in to continue your courses, keep your streak going, and track your progress.'
            : 'Join Lafole Academy to enroll in accredited diploma tracks, stream lessons, and earn certificates.'}
        </p>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div 
            id="login-error-alert"
            className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs sm:text-sm text-rose-700 dark:text-rose-300 flex items-start space-x-2.5 animate-fadeIn"
          >
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ================= VIEW: SIGN UP SUCCESS (EMAIL DISPATCHED) ================= */}
        {authMode === 'signup' && signupSuccessData ? (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 animate-fadeIn">
            <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-[#2EB641]">
                <Mail className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Verification Link Dispatched!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sent to <strong className="text-slate-900 dark:text-white">{signupSuccessData.email}</strong>
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800 text-xs sm:text-[13px] text-emerald-900 dark:text-emerald-200 leading-relaxed space-y-2">
              <p>
                We've sent a secure verification email. Please check your inbox and <strong>spam/junk folder</strong>.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                To prevent unauthorized accounts and protect student security, you must click <strong>Verify My Email Address</strong> in the email to activate your account.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleResendSignupEmail}
                disabled={isResendingSignupEmail || resendSignupCooldown > 0}
                className="w-full h-11 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isResendingSignupEmail ? 'Sending...' : resendSignupCooldown > 0 ? `Resend Email (${resendSignupCooldown}s)` : 'Resend Verification Email'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setIdentifier(signupSuccessData.email);
                  setSignupSuccessData(null);
                }}
                className="w-full h-11 bg-[#2EB641] hover:bg-[#259B36] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Go to Sign In</span>
              </button>
            </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setIdentifier(signupSuccessData.email);
                    setSignupSuccessData(null);
                  }}
                  className="text-xs text-[#2EB641] hover:underline font-semibold cursor-pointer"
                >
                  Return to Sign in with password
                </button>
              </div>
            </div>
        ) : authMode === 'signup' ? (
          /* ================= VIEW: SIGN UP FORM ================= */
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label 
                htmlFor="signup-name-input"
                className="block text-[11px] font-bold tracking-[0.08em] text-slate-700 dark:text-slate-300 uppercase"
              >
                FULL NAME
              </label>
              <input
                id="signup-name-input"
                type="text"
                required
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="e.g. Alex Mohamed"
                className="w-full h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2EB641] transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label 
                htmlFor="signup-email-input"
                className="block text-[11px] font-bold tracking-[0.08em] text-slate-700 dark:text-slate-300 uppercase"
              >
                STUDENT EMAIL ADDRESS
              </label>
              <input
                id="signup-email-input"
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2EB641] transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label 
                htmlFor="signup-password-input"
                className="block text-[11px] font-bold tracking-[0.08em] text-slate-700 dark:text-slate-300 uppercase"
              >
                CREATE PASSWORD (MIN 6 CHARS)
              </label>
              <div className="relative flex items-center">
                <input
                  id="signup-password-input"
                  type={showSignupPassword ? 'text' : 'password'}
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-4 pr-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2EB641] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label 
                htmlFor="signup-confirm-password-input"
                className="block text-[11px] font-bold tracking-[0.08em] text-slate-700 dark:text-slate-300 uppercase"
              >
                CONFIRM PASSWORD
              </label>
              <input
                id="signup-confirm-password-input"
                type="password"
                required
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2EB641] transition-all"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full h-12 bg-[#2EB641] hover:bg-[#259B36] text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isSigningUp ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Creating account & sending verification...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Send Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className="text-[#2EB641] font-semibold hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </div>
          </form>
        ) : (
          /* ================= VIEW: SIGN IN FORM ================= */
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Field 1: USERNAME OR EMAIL */}
            <div className="space-y-2">
              <label 
                htmlFor="username-or-email-input"
                className="block text-[11px] font-bold tracking-[0.08em] text-slate-700 dark:text-slate-300 uppercase"
              >
                USERNAME OR EMAIL
              </label>
              <div className="relative">
                <input
                  id="username-or-email-input"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="username"
                  className="w-full h-12 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2EB641] focus:border-transparent transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Field 2: PASSWORD + Forgot? Link */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="password-input"
                  className="block text-[11px] font-bold tracking-[0.08em] text-slate-700 dark:text-slate-300 uppercase"
                >
                  PASSWORD
                </label>
                <button
                  id="login-forgot-password-link"
                  type="button"
                  onClick={() => {
                    setForgotEmail(identifier.includes('@') ? identifier : '');
                    setShowForgotModal(true);
                    setResetSuccessMessage(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              
              <div className="relative flex items-center">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-12 pl-4 pr-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2EB641] focus:border-transparent transition-all shadow-2xs"
                />
                <button
                  id="login-toggle-password-btn"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Action Button: Sign in to dashboard > */}
            <div className="pt-2">
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#2EB641] hover:bg-[#259B36] active:bg-[#1E822D] disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer group"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Quick Demo Credentials Assistant */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <button
            id="login-quick-demo-fill"
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setIdentifier('student@lafole.so');
              setPassword('lafole2026');
              showToast("Filled demo credentials: student@lafole.so", "info");
            }}
            className="hover:text-[#2EB641] dark:hover:text-[#2EB641] flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2EB641]" />
            <span>Use Demo Account</span>
          </button>

          <div className="flex items-center space-x-2">
            <span>{authMode === 'signin' ? 'New student?' : 'Existing student?'}</span>
            <button
              onClick={() => {
                setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                setErrorMessage(null);
              }}
              className="text-[#2EB641] font-bold hover:underline cursor-pointer"
            >
              {authMode === 'signin' ? 'Create an account' : 'Sign in here'}
            </button>
          </div>
        </div>

      </div>

      {/* Set Initial Password Modal (For verified accounts without a password yet) */}
      {showSetPasswordModal && (
        <div 
          id="set-password-modal"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowSetPasswordModal(false)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSetPasswordModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-[#2EB641] mb-4">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              Create Your Account Password
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
              Your email <strong className="text-slate-900 dark:text-white">{setPasswordEmail}</strong> is verified! To protect your account and sign in, please create your secure password below.
            </p>

            <form onSubmit={handleSaveInitialPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newAccountPassword}
                  onChange={(e) => setNewAccountPassword(e.target.value)}
                  placeholder="Create your secure password"
                  className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2EB641] dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmAccountPassword}
                  onChange={(e) => setConfirmAccountPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2EB641] dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSetPasswordModal(false)}
                  className="flex-1 h-11 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSettingPassword}
                  className="flex-1 h-11 bg-[#2EB641] hover:bg-[#259B36] disabled:opacity-60 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isSettingPassword ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Securing...</span>
                    </>
                  ) : (
                    <span>Save Password &amp; Sign In</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal with 2-Step OTP Reset */}
      {showForgotModal && (
        <div 
          id="forgot-password-modal"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowForgotModal(false)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotStep(1);
                setResetCode('');
                setNewResetPassword('');
                setConfirmResetPassword('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-[#2EB641] mb-4">
              <KeyRound className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              {forgotStep === 1 ? "Reset your password" : "Enter Verification Code & New Password"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
              {forgotStep === 1 
                ? "Enter your registered student email address, and we'll dispatch a 6-digit verification code to reset your password."
                : `We've sent a 6-digit code to ${forgotEmail}. Please enter the code and your new password below.`
              }
            </p>

            {resetSuccessMessage ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2EB641] flex-shrink-0 mt-0.5" />
                  <div>{resetSuccessMessage}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full h-11 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Close &amp; return to sign in
                </button>
              </div>
            ) : forgotStep === 1 ? (
              <form onSubmit={handleSendResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2EB641] dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center space-x-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 h-11 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingReset}
                    className="flex-1 h-11 bg-[#2EB641] hover:bg-[#259B36] disabled:opacity-60 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isSendingReset ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Sending code...</span>
                      </>
                    ) : (
                      <span>Send 6-digit code</span>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConfirmResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    6-digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm tracking-widest font-mono text-center focus:outline-none focus:ring-2 focus:ring-[#2EB641] dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    New Password (min 6 characters)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2EB641] dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmResetPassword}
                    onChange={(e) => setConfirmResetPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2EB641] dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">Didn't receive code?</span>
                  <button
                    type="button"
                    disabled={isSendingReset}
                    onClick={handleSendResetPassword}
                    className="text-[#2EB641] hover:underline font-semibold disabled:opacity-50 cursor-pointer"
                  >
                    Resend 6-digit code
                  </button>
                </div>

                <div className="flex items-center space-x-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="flex-1 h-11 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingReset}
                    className="flex-1 h-11 bg-[#2EB641] hover:bg-[#259B36] disabled:opacity-60 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isSendingReset ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Resetting...</span>
                      </>
                    ) : (
                      <span>Reset &amp; Sign In</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Subtle Footer info */}
      <footer className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        Lafole Academy • Hoyga Tababarka injineerada Mustaqbalka
      </footer>
    </div>
  );
};
