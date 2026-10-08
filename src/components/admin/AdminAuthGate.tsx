import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Key,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { signInStudent, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Lafole%2FLogo-02.png?alt=media&token=a877d4d0-4c4e-43f4-bb92-b9cce99580ef";

export interface AdminAuthSession {
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  authenticatedAt: number;
  lastActiveAt: number;
}

interface AdminAuthGateProps {
  onAuthenticated: (session: AdminAuthSession) => void;
  onBackToHome: () => void;
  currentUserEmail?: string;
  currentUserName?: string;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({
  onAuthenticated,
  onBackToHome,
  currentUserEmail
}) => {
  const [identifier, setIdentifier] = useState(currentUserEmail || 'techanalyst41@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If user changes email prop, sync identifier
  useEffect(() => {
    if (currentUserEmail) {
      setIdentifier(currentUserEmail);
    }
  }, [currentUserEmail]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const cleanEmail = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your administrator email.');
      setIsLoading(false);
      return;
    }

    if (!cleanPass) {
      setErrorMessage('Please enter your password or security passcode.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Check if master administrative passcode
      const isMasterKey = cleanPass === 'lafole2026' || cleanPass === 'admin2026' || cleanPass === 'lafole@admin2026';
      const isPrimarySuperAdmin = cleanEmail === 'techanalyst41@gmail.com';
      const isAuthorizedEmail = 
        isPrimarySuperAdmin ||
        cleanEmail === 'admin@lafole.so' ||
        cleanEmail === 'admin@lafole.academy' ||
        cleanEmail === 'admissions@lafole.net' ||
        cleanEmail.includes('admin');

      if (isMasterKey && isAuthorizedEmail) {
        const session: AdminAuthSession = {
          email: cleanEmail,
          name: isPrimarySuperAdmin ? 'Alex ASIAGO' : 'Abdifatah Jama',
          role: isPrimarySuperAdmin ? 'superadmin' : 'admin',
          authenticatedAt: Date.now(),
          lastActiveAt: Date.now()
        };
        try {
          sessionStorage.setItem('lafole_admin_auth', JSON.stringify(session));
          localStorage.removeItem('lafole_admin_auth');
        } catch {}
        onAuthenticated(session);
        return;
      }

      // 2. Validate against Firestore admins & local admin cache
      const userDocId = cleanEmail.replace(/[^a-z0-9_-]/g, '_');
      let isAdminRole = false;
      let adminName = 'Administrator';
      let adminRole: 'superadmin' | 'admin' = isPrimarySuperAdmin ? 'superadmin' : 'admin';
      let directPasswordMatch = false;

      // Check local cache first for instant response
      if (typeof window !== 'undefined') {
        try {
          const cachedAdmins = JSON.parse(localStorage.getItem('lafole_admin_users') || '[]');
          const foundLocal = Array.isArray(cachedAdmins) ? cachedAdmins.find((u: any) => u.email?.toLowerCase() === cleanEmail) : null;
          if (foundLocal) {
            if (foundLocal.status === 'suspended') {
              setErrorMessage('Access restricted: This administrator account has been suspended. Please contact the Super Admin.');
              setIsLoading(false);
              return;
            }
            isAdminRole = true;
            adminName = foundLocal.name || adminName;
            adminRole = foundLocal.role === 'superadmin' || isPrimarySuperAdmin ? 'superadmin' : 'admin';
            if (foundLocal.password && cleanPass === foundLocal.password) {
              directPasswordMatch = true;
            }
          }
        } catch {}
      }

      // Check Firestore admins collection
      try {
        const adminDoc = await getDoc(doc(db, 'admins', userDocId));
        if (adminDoc.exists()) {
          const aData = adminDoc.data();
          if (aData?.isDeleted) {
            setErrorMessage('Access restricted: This administrator account has been revoked.');
            setIsLoading(false);
            return;
          }
          if (aData?.status === 'suspended') {
            setErrorMessage('Access restricted: This administrator account has been suspended. Please contact the Super Admin.');
            setIsLoading(false);
            return;
          }
          isAdminRole = true;
          adminName = aData?.name || aData?.fullName || adminName;
          adminRole = aData?.role === 'superadmin' || isPrimarySuperAdmin ? 'superadmin' : 'admin';
          if (aData?.password && cleanPass === aData.password) {
            directPasswordMatch = true;
          }
        } else {
          const userDoc = await getDoc(doc(db, 'users', userDocId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data?.role === 'admin' || data?.role === 'superadmin' || data?.isAdmin === true || isAuthorizedEmail) {
              isAdminRole = true;
              adminName = data?.fullName || adminName;
              adminRole = data?.role === 'superadmin' || isPrimarySuperAdmin ? 'superadmin' : 'admin';
            }
          }
        }
      } catch (err) {
        if (isAuthorizedEmail) {
          isAdminRole = true;
        }
      }

      // If direct admin password matches (created by Super Admin)
      if (directPasswordMatch || (isMasterKey && isAdminRole)) {
        const session: AdminAuthSession = {
          email: cleanEmail,
          name: adminName,
          role: adminRole,
          authenticatedAt: Date.now(),
          lastActiveAt: Date.now()
        };
        try {
          sessionStorage.setItem('lafole_admin_auth', JSON.stringify(session));
          localStorage.removeItem('lafole_admin_auth');
        } catch {}
        onAuthenticated(session);
        return;
      }

      // Otherwise check student auth credentials
      const authResult = await signInStudent(cleanEmail, cleanPass);

      if (authResult.success) {
        if (!isAdminRole && !isAuthorizedEmail) {
          setErrorMessage('Access restricted: This account does not have administrator privileges.');
          setIsLoading(false);
          return;
        }

        const session: AdminAuthSession = {
          email: cleanEmail,
          name: adminName !== 'Administrator' ? adminName : (authResult.user?.displayName || 'Administrator'),
          role: adminRole,
          authenticatedAt: Date.now(),
          lastActiveAt: Date.now()
        };

        try {
          sessionStorage.setItem('lafole_admin_auth', JSON.stringify(session));
          localStorage.removeItem('lafole_admin_auth');
        } catch {}
        onAuthenticated(session);
      } else {
        setErrorMessage(authResult.message || 'Invalid administrator credentials. Please check your email and password.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 font-geist text-slate-800 dark:text-slate-100">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img 
              src={LOGO_URL} 
              alt="Lafole Academy" 
              referrerPolicy="no-referrer"
              className="h-10 sm:h-12 w-auto max-w-[220px] object-contain cursor-pointer dark:brightness-0 dark:invert transition-all"
              onClick={onBackToHome}
            />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-300 dark:border-emerald-800 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Access Control</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Administration Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sign in with your authorized administrator credentials to manage courses, enrollments, and payments.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center space-x-2.5 text-xs text-rose-800 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@lafole.so"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password / Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Administrator...</span>
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>Sign In to Admin Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onBackToHome}
            className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main Website</span>
          </button>
          <span className="text-[11px] text-slate-400">
            Lafole Security
          </span>
        </div>
      </div>
    </div>
  );
};
