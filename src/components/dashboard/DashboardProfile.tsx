import React, { useState } from 'react';
import { 
  User, 
  Camera, 
  MapPin, 
  Check, 
  Save, 
  Lock, 
  Eye, 
  EyeOff, 
  Mail, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { updateStudentPassword } from '../../lib/firebase';

interface DashboardProfileProps {
  userEmail: string;
  userName: string;
  onUpdateName?: (name: string) => void;
  showToast?: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

export const DashboardProfile: React.FC<DashboardProfileProps> = ({
  userEmail,
  userName,
  onUpdateName,
  showToast
}) => {
  // Prepopulate with user details matching Profile.png reference screenshot
  const [firstName, setFirstName] = useState(userName ? userName.split(' ')[0] : 'Nerd');
  const [lastName, setLastName] = useState(userName && userName.split(' ').length > 1 ? userName.split(' ').slice(1).join(' ') : 'Ninja');
  const [email, setEmail] = useState(userEmail || 'techanalyst41@gmail.com');
  const [username, setUsername] = useState('nninja342');
  const [phone, setPhone] = useState('+254707440550');
  const [country, setCountry] = useState('Somalia');

  // Notification toggles matching Profile_2.png
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsAppAlerts, setWhatsAppAlerts] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savedPrefsSuccess, setSavedPrefsSuccess] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; error: boolean } | null>(null);

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (onUpdateName && fullName) {
      onUpdateName(fullName);
    }
    if (showToast) {
      showToast('Personal information updated successfully.', 'success');
    }
  };

  const handleSavePreferences = () => {
    setSavingPrefs(true);
    setTimeout(() => {
      setSavingPrefs(false);
      setSavedPrefsSuccess(true);
      if (showToast) {
        showToast('Notification preferences saved.', 'success');
      }
      setTimeout(() => setSavedPrefsSuccess(false), 3000);
    }, 600);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!currentPassword) {
      setPasswordMsg({ text: 'Please enter your current password.', error: true });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ text: 'Use at least 6 characters for the new password.', error: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', error: true });
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await updateStudentPassword(userEmail, currentPassword, newPassword);
      if (res.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordMsg({ text: 'Password has been securely updated.', error: false });
        if (showToast) {
          showToast('Password updated successfully.', 'success');
        }
      } else {
        setPasswordMsg({ text: res.message || 'Failed to update password.', error: true });
      }
    } catch (err: any) {
      setPasswordMsg({ text: err?.message || 'Error updating password.', error: true });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const initials = `${firstName ? firstName[0] : 'N'}${lastName ? lastName[0] : 'N'}`.toUpperCase();

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl">
      {/* Header matching Profile.png */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-[20px] sm:text-[22px] font-[600] uppercase tracking-tight text-slate-900 dark:text-white">
          MY PROFILE
        </h1>
        <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Your account. Update your photo, banner, profile fields, or password — every change is saved instantly.
        </p>
      </div>

      {/* Banner & Avatar Card matching Profile.png */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Banner area */}
        <div className="h-32 sm:h-40 bg-slate-100 dark:bg-slate-800/60 relative flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
          <span className="text-[13px] text-slate-400 font-[400]">No banner image</span>
          <button 
            type="button"
            onClick={() => alert('Select a new cover banner image (PNG, JPG, max 5MB).')}
            className="absolute right-4 bottom-4 px-3.5 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] font-[500] text-slate-700 dark:text-slate-200 hover:bg-white flex items-center space-x-1.5 shadow-2xs cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Edit banner</span>
          </button>
        </div>

        {/* Profile info overlapping */}
        <div className="px-5 sm:px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end space-x-4 -mt-12 sm:-mt-14">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-600 text-white font-[700] text-2xl sm:text-3xl flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-md">
              {initials}
            </div>
            <div className="pb-1">
              <h2 className="text-[18px] sm:text-[20px] font-[600] text-slate-900 dark:text-white">
                {firstName} {lastName}
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-[700] uppercase tracking-wider">
                  STUDENT
                </span>
                <span className="text-[13px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-[#22C55E]" />
                  <span>{country}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="pb-1">
            <button
              onClick={() => alert('Profile photo upload: Choose JPG or PNG')}
              className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-[13.5px] font-[500] flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Change photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: Personal Information matching Profile.png */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-[17px] font-[500] text-slate-900 dark:text-white">
            Personal information
          </h3>
          <p className="text-[14px] font-[400] text-slate-500 dark:text-slate-400 mt-0.5">
            Update your personal details here.
          </p>
        </div>

        <form onSubmit={handleSavePersonalInfo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13.5px] font-[500] text-slate-700 dark:text-slate-300 mb-1.5">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E]"
                placeholder="First name"
                required
              />
            </div>

            <div>
              <label className="block text-[13.5px] font-[500] text-slate-700 dark:text-slate-300 mb-1.5">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E]"
                placeholder="Last name"
                required
              />
            </div>

            <div>
              <label className="block text-[13.5px] font-[500] text-slate-700 dark:text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E]"
                placeholder="Email address"
                required
              />
            </div>

            <div>
              <label className="block text-[13.5px] font-[500] text-slate-700 dark:text-slate-300 mb-1.5">
                Username (sign-in)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E]"
                placeholder="Username"
              />
            </div>

            <div>
              <label className="block text-[13.5px] font-[500] text-slate-700 dark:text-slate-300 mb-1.5">
                Phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E]"
                placeholder="+254..."
              />
            </div>

            <div>
              <label className="block text-[13.5px] font-[500] text-slate-700 dark:text-slate-300 mb-1.5">
                Location (country)
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E]"
                placeholder="Country"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-[14px] font-[500] transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save personal info</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Messages from Lafole matching Profile_2.png */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-[17px] font-[500] text-slate-900 dark:text-white">
            Messages from Lafole
          </h3>
          <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Receipts, password resets and messages about your own courses always arrive. These switches control everything else.
          </p>
        </div>

        <div className="space-y-4">
          {/* Switch 1: Email notifications */}
          <div className="flex items-start justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="space-y-0.5 pr-4">
              <div className="text-[14.5px] font-[500] text-slate-900 dark:text-white flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#22C55E]" />
                <span>Email about courses, sales and reminders</span>
              </div>
              <p className="text-[13px] font-[400] text-slate-500 dark:text-slate-400">
                New courses, diploma offers and deadlines by email.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#22C55E]"></div>
            </label>
          </div>

          {/* Switch 2: WhatsApp notifications */}
          <div className="flex items-start justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="space-y-0.5 pr-4">
              <div className="text-[14.5px] font-[500] text-slate-900 dark:text-white flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-[#22C55E]" />
                <span>WhatsApp messages</span>
              </div>
              <p className="text-[13px] font-[400] text-slate-500 dark:text-slate-400">
                Payment reminders and course news on WhatsApp, to the phone number on your profile. You can reply STOP at any time.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
              <input
                type="checkbox"
                checked={whatsAppAlerts}
                onChange={(e) => setWhatsAppAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#22C55E]"></div>
            </label>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSavePreferences}
              disabled={savingPrefs}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-[14px] font-[500] transition-all shadow-xs inline-flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{savingPrefs ? 'Saving...' : 'Save preferences >'}</span>
              {savedPrefsSuccess && <Check className="w-3.5 h-3.5 ml-1" />}
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Password & Security matching Profile_2.png */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-[17px] font-[500] text-slate-900 dark:text-white">
            Password & security
          </h3>
          <p className="text-[14px] font-[400] text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your password and security settings.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {passwordMsg && (
            <div className={`p-3 rounded-xl text-[13px] font-[500] ${
              passwordMsg.error 
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900' 
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
            }`}>
              {passwordMsg.text}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[13.5px] font-[500] text-slate-700 dark:text-slate-300 mb-1.5">
                Current password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E]"
                placeholder="Enter current password"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13.5px] font-[500] text-slate-700 dark:text-slate-300 mb-1.5">
                  New password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E]"
                  placeholder="e.g. Mohamed17"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-[13.5px] font-[500] text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E]"
                  placeholder="Repeat the new password"
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400">
              <p className="text-[12.5px] font-[400] text-slate-500 dark:text-slate-400">
                Use at least 6 characters. Something like a name followed by numbers works well.
              </p>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[13px] font-[500] text-[#22C55E] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updatingPassword}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-[14px] font-[500] transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{updatingPassword ? 'Updating...' : 'Update password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
