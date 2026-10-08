import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  ShieldCheck, 
  Crown, 
  Mail, 
  User, 
  Lock, 
  Briefcase, 
  AlertCircle, 
  Loader2, 
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { AdminUser } from '../../types';
import { DEFAULT_SUPER_ADMIN_EMAIL } from '../../lib/firebase';

interface AdminUserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Partial<AdminUser>) => Promise<void>;
  initialUser?: AdminUser | null;
  isSuperAdmin: boolean;
  currentAdminEmail?: string;
}

const DEPARTMENT_SUGGESTIONS = [
  'Executive Administration',
  'Curriculum & Education',
  'Student Admissions & Payments',
  'Operations & Student Success',
  'Technical Infrastructure & LMS'
];

export const AdminUserFormModal: React.FC<AdminUserFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialUser,
  isSuperAdmin,
  currentAdminEmail
}) => {
  const isEditing = Boolean(initialUser);
  const isTargetPrimarySuperAdmin = initialUser?.email?.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'superadmin'>('admin');
  const [department, setDepartment] = useState(DEPARTMENT_SUGGESTIONS[1]);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'active' | 'suspended'>('active');
  const [showPassword, setShowPassword] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialUser) {
      setName(initialUser.name || '');
      setEmail(initialUser.email || '');
      setRole(initialUser.role || 'admin');
      setDepartment(initialUser.department || DEPARTMENT_SUGGESTIONS[0]);
      setPassword(initialUser.password || '');
      setStatus(initialUser.status || 'active');
    } else {
      setName('');
      setEmail('');
      setRole('admin');
      setDepartment(DEPARTMENT_SUGGESTIONS[1]);
      setPassword('admin2026');
      setStatus('active');
    }
    setErrorMessage(null);
    setShowPassword(false);
  }, [initialUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanName) {
      setErrorMessage('Please provide a full name for this administrator.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!isEditing && !cleanPass) {
      setErrorMessage('Please provide an initial login passcode or password.');
      return;
    }

    if (cleanPass && cleanPass.length < 4) {
      setErrorMessage('Passcode must be at least 4 characters long.');
      return;
    }

    const payload: Partial<AdminUser> = {
      ...(initialUser ? { id: initialUser.id } : {}),
      name: cleanName,
      email: cleanEmail,
      role: isTargetPrimarySuperAdmin ? 'superadmin' : role,
      department: department.trim() || 'General Administration',
      status: isTargetPrimarySuperAdmin ? 'active' : status,
      ...(cleanPass ? { password: cleanPass } : {})
    };

    setIsSaving(true);
    try {
      await onSave(payload);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save administrator user.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-850/60">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              role === 'superadmin' 
                ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400' 
                : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
            }`}>
              {role === 'superadmin' ? <Crown className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Edit Administrator User' : 'Register New Admin User'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing 
                  ? 'Update dashboard role permissions and account status' 
                  : 'Grant administrator access to the Lafole Academy dashboard'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Full Name <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Abdullahi Nur"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="email"
              required
              disabled={isTargetPrimarySuperAdmin}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. nur@lafole.so"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono text-xs"
            />
            {isTargetPrimarySuperAdmin && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400">
                Primary Super Admin root email cannot be altered.
              </p>
            )}
          </div>

          {/* Role Privilege Selection */}
          <div className="space-y-2 pt-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Administrative Role & Clearance</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Regular Admin Option */}
              <div 
                onClick={() => {
                  if (!isTargetPrimarySuperAdmin) setRole('admin');
                }}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                  role === 'admin' 
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-xs' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 opacity-80'
                } ${isTargetPrimarySuperAdmin ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Administrator</span>
                  </div>
                  {role === 'admin' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Manages payments, course curriculum, orders, and student enrollments.
                </p>
              </div>

              {/* Super Admin Option */}
              <div 
                onClick={() => setRole('superadmin')}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                  role === 'superadmin' 
                    ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 shadow-xs' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Super Admin</span>
                  </div>
                  {role === 'superadmin' && <Check className="w-4 h-4 text-purple-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Full clearance: Can create, update, or revoke administrator user access.
                </p>
              </div>
            </div>
          </div>

          {/* Department / Position */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Department / Job Title</span>
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Student Admissions & Payments"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {DEPARTMENT_SUGGESTIONS.map((dep) => (
                <button
                  type="button"
                  key={dep}
                  onClick={() => setDepartment(dep)}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                    department === dep 
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent font-semibold' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {dep}
                </button>
              ))}
            </div>
          </div>

          {/* Passcode / Password */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {isEditing ? 'Reset Access Passcode (Optional)' : 'Login Passcode / Password'}
                  {!isEditing && <span className="text-rose-500"> *</span>}
                </span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Min 4 chars</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required={!isEditing}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEditing ? 'Leave blank to keep existing passcode' : 'e.g. admin2026'}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              This user will enter their email and this passcode to unlock the <code className="text-emerald-600 font-mono">/admin</code> dashboard.
            </p>
          </div>

          {/* Status (Active / Suspended) */}
          <div className="space-y-1.5 pt-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Account Status
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 text-xs cursor-pointer">
                <input
                  type="radio"
                  name="userStatus"
                  value="active"
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-semibold text-emerald-600">Active (Access Allowed)</span>
              </label>

              <label className={`flex items-center space-x-2 text-xs ${isTargetPrimarySuperAdmin ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                  type="radio"
                  name="userStatus"
                  value="suspended"
                  disabled={isTargetPrimarySuperAdmin}
                  checked={status === 'suspended'}
                  onChange={() => setStatus('suspended')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span className="font-semibold text-rose-600">Suspended (Access Revoked)</span>
              </label>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold transition-all shadow-sm flex items-center space-x-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Administrator...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Create Administrator'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
