import React, { useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  Book,
  ShoppingBag,
  Shield,
  Cpu,
  CreditCard,
  Download,
  User,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ArrowLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Course, CourseProgress, StudentProfile } from '../../types';
import { DashboardHome } from './DashboardHome';
import { DashboardMyLearning } from './DashboardMyLearning';
import { DashboardDiplomas } from './DashboardDiplomas';
import { DashboardCertificates } from './DashboardCertificates';
import { DashboardBooks } from './DashboardBooks';
import { DashboardOrders } from './DashboardOrders';
import { DashboardPayments } from './DashboardPayments';
import { DashboardDownloads } from './DashboardDownloads';
import { DashboardProfile } from './DashboardProfile';
import { DashboardHelpCenter } from './DashboardHelpCenter';
import { DashboardLabs } from './DashboardLabs';

export type DashboardTab =
  | 'dashboard'
  | 'mylearning'
  | 'learning-path'
  | 'certificates'
  | 'books'
  | 'orders'
  | 'cyber-labs'
  | 'networking-labs'
  | 'payments'
  | 'downloads'
  | 'settings'
  | 'help';

interface DashboardLayoutProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onBackToHome: () => void;
  onExploreCourses: () => void;
  onExploreDiplomas: () => void;
  onBrowseBooks: () => void;
  onResumeCourse: (course: Course) => void;
  onViewCourseDetails: (course: Course) => void;
  onOpenCertificate: (course: Course) => void;
  enrolledCourses: Course[];
  courseProgressMap: Record<string, CourseProgress>;
  userName: string;
  userEmail: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onSignOut: () => void;
  onUpdateName?: (name: string) => void;
  showToast?: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onTabChange,
  onBackToHome,
  onExploreCourses,
  onExploreDiplomas,
  onBrowseBooks,
  onResumeCourse,
  onViewCourseDetails,
  onOpenCertificate,
  enrolledCourses,
  courseProgressMap,
  userName,
  userEmail,
  isDarkMode,
  onToggleDarkMode,
  onSignOut,
  onUpdateName,
  showToast
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation Items matching reference screenshots exactly
  const mainNavItems: { tab: DashboardTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { tab: 'mylearning', label: 'My Courses', icon: GraduationCap },
    { tab: 'learning-path', label: 'My Diplomas', icon: Award },
    { tab: 'certificates', label: 'My Certificates', icon: Award },
    { tab: 'books', label: 'My Books', icon: Book },
    { tab: 'orders', label: 'My Orders', icon: ShoppingBag },
    { tab: 'cyber-labs', label: 'Cyber Labs', icon: Shield },
    { tab: 'networking-labs', label: 'Networking Labs', icon: Cpu },
    { tab: 'payments', label: 'Payments', icon: CreditCard },
    { tab: 'downloads', label: 'Downloads', icon: Download }
  ];

  const settingsNavItems: { tab: DashboardTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: 'settings', label: 'Profile', icon: User },
    { tab: 'help', label: 'Help Center', icon: HelpCircle }
  ];

  const handleNavClick = (tab: DashboardTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  const displayName = userName || (userEmail ? userEmail.split('@')[0] : 'Student');
  const nameParts = displayName.split(' ');
  const initials = `${nameParts[0] ? nameParts[0][0] : 'N'}${nameParts[1] ? nameParts[1][0] : 'N'}`.toUpperCase();

  return (
    <div className="min-h-[calc(100vh-68px)] bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row text-slate-800 dark:text-slate-200 transition-colors duration-200 font-geist">
      
      {/* Mobile Sub-Navigation & Drawer Bar (Under Main Header) */}
      <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30 px-3 py-2 flex items-center justify-between gap-2 shadow-2xs">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-[13px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex-shrink-0 cursor-pointer"
        >
          <Menu className="w-4 h-4 text-[#22C55E]" />
          <span>Dashboard Menu</span>
        </button>

        {/* Scrollable quick pills on mobile */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs touch-pan-x">
          {[...mainNavItems, ...settingsNavItems].map(item => {
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer text-[13px] flex-shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar Overlay on Mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-fadeIn"
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[68px] left-0 h-screen lg:h-[calc(100vh-68px)] w-72 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 lg:z-30 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Mobile-only Drawer Header */}
          <div className="lg:hidden p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#22C55E]/10 dark:bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center font-black text-sm">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <div>
                <div className="font-[600] text-xs tracking-tight uppercase text-slate-900 dark:text-white leading-none">
                  Student Portal
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-normal">
                  Lafole Academy
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              title="Close menu"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links Group */}
          <nav className="p-3.5 space-y-1.5">
            {mainNavItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.tab;

              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`w-full flex items-center space-x-3.5 px-3.5 py-3 rounded-xl text-[15px] font-[500] transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#22C55E]' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span className="leading-none">{item.label}</span>
                </button>
              );
            })}

            {/* SETTINGS Header */}
            <div className="pt-5 pb-1.5 px-3.5">
              <span className="text-[11px] font-[700] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                SETTINGS
              </span>
            </div>

            {settingsNavItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.tab;

              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`w-full flex items-center space-x-3.5 px-3.5 py-3 rounded-xl text-[15px] font-[500] transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#22C55E]' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span className="leading-none">{item.label}</span>
                </button>
              );
            })}

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              className="w-full flex items-center space-x-3.5 px-3.5 py-3 rounded-xl text-[15px] font-[500] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="leading-none">Sign out</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Theme Toggle & Student Profile Card */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
          
          {/* Theme switcher */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs">
            <span className="font-[500] text-slate-600 dark:text-slate-400 text-[13px]">Theme</span>
            <button
              onClick={onToggleDarkMode}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 shadow-2xs cursor-pointer hover:border-[#22C55E]"
            >
              {isDarkMode ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[12px] font-[500]">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[12px] font-[500]">Light</span>
                </>
              )}
            </button>
          </div>

          {/* Student Profile Pill */}
          <button
            onClick={() => handleNavClick('settings')}
            className="w-full flex items-center space-x-3 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-[600] text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="font-[500] text-[14.5px] text-slate-900 dark:text-white truncate group-hover:text-[#22C55E] transition-colors leading-snug">
                {displayName}
              </div>
              <div className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-700 text-[10px] font-[700] uppercase tracking-wider">
                STUDENT
              </div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardHome
              userName={displayName}
              enrolledCourses={enrolledCourses}
              courseProgressMap={courseProgressMap}
              onNavigateToTab={handleNavClick}
              onExploreCourses={onExploreCourses}
              onExploreDiplomas={onExploreDiplomas}
              onResumeCourse={onResumeCourse}
            />
          )}

          {currentTab === 'mylearning' && (
            <DashboardMyLearning
              enrolledCourses={enrolledCourses}
              courseProgressMap={courseProgressMap}
              onResumeCourse={onResumeCourse}
              onExploreCourses={onExploreCourses}
              onViewCourseDetails={onViewCourseDetails}
              onOpenCertificate={onOpenCertificate}
            />
          )}

          {currentTab === 'learning-path' && (
            <DashboardDiplomas
              onExploreDiplomas={onExploreDiplomas}
              onBrowseCourses={onExploreCourses}
            />
          )}

          {currentTab === 'certificates' && (
            <DashboardCertificates
              enrolledCourses={enrolledCourses}
              courseProgressMap={courseProgressMap}
              userName={displayName}
              onBrowseCourses={onExploreCourses}
              onOpenCertificateModal={onOpenCertificate}
            />
          )}

          {currentTab === 'books' && (
            <DashboardBooks
              onBrowseBooks={onBrowseBooks}
            />
          )}

          {currentTab === 'orders' && (
            <DashboardOrders
              onExploreCourses={onExploreCourses}
              onViewReceipt={(order) => {
                handleNavClick('payments');
              }}
            />
          )}

          {(currentTab === 'cyber-labs' || currentTab === 'networking-labs') && (
            <DashboardLabs
              initialType={currentTab === 'cyber-labs' ? 'cyber' : 'networking'}
            />
          )}

          {currentTab === 'payments' && (
            <DashboardPayments
              userEmail={userEmail}
              userName={displayName}
            />
          )}

          {currentTab === 'downloads' && (
            <DashboardDownloads />
          )}

          {currentTab === 'settings' && (
            <DashboardProfile
              userEmail={userEmail}
              userName={displayName}
              onUpdateName={onUpdateName}
              showToast={showToast}
            />
          )}

          {currentTab === 'help' && (
            <DashboardHelpCenter onNavigateTab={onTabChange} />
          )}
        </div>
      </main>
    </div>
  );
};
