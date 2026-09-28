import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Moon, 
  Sun, 
  ShoppingCart, 
  ChevronDown, 
  ArrowRight,
  Award,
  Sparkles,
  BookOpen,
  Terminal,
  Cpu,
  BarChart3,
  GraduationCap,
  CheckCircle2,
  LogOut,
  UserCheck
} from 'lucide-react';
import { Course, CourseProgress, StudentProfile, CartItem } from '../types';
import { PromoAlertBar } from './PromoAlertBar';
import { getEmailInitials, formatStudentDisplayName } from '../utils/userUtils';
import { CartDropdown } from './CartDropdown';

interface NavbarProps {
  activeView: 'home' | 'catalog' | 'learn' | 'progress' | 'instructor' | 'diplomas' | 'books' | 'course-details' | 'checkout' | 'verify-email' | 'login' | 'cart' | 'dashboard';
  setActiveView: (view: 'home' | 'catalog' | 'learn' | 'progress' | 'instructor' | 'diplomas' | 'books' | 'course-details' | 'checkout' | 'verify-email' | 'login' | 'cart' | 'dashboard') => void;
  onNavigateToDashboard?: () => void;
  courses: Course[];
  activeCourse: Course;
  onSelectCourse: (course: Course) => void;
  courseProgress: CourseProgress;
  studentProfile: StudentProfile;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  cartCount: number;
  cartItems?: CartItem[];
  onRemoveFromCart?: (courseId: string) => void;
  onCheckoutCart?: () => void;
  onViewCart?: () => void;
  onShopNow?: () => void;
  isEmailVerified?: boolean;
  verifiedUserEmail?: string;
  verifiedUserName?: string;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onNavigateToDashboard,
  courses,
  activeCourse,
  onSelectCourse,
  courseProgress,
  studentProfile,
  searchQuery,
  setSearchQuery,
  onOpenSearch,
  isDarkMode,
  setIsDarkMode,
  cartCount,
  cartItems = [],
  onRemoveFromCart,
  onCheckoutCart,
  onViewCart,
  onShopNow,
  isEmailVerified = false,
  verifiedUserEmail = '',
  verifiedUserName = '',
  onSignOut
}) => {
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);
  const [labsDropdownOpen, setLabsDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const learnRef = useRef<HTMLDivElement>(null);
  const labsRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  const learnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const labsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resourcesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute initials from verified email or full name (only when authenticated)
  const effectiveEmail = isEmailVerified ? (verifiedUserEmail || studentProfile.email) : '';
  const effectiveName = isEmailVerified ? formatStudentDisplayName(verifiedUserName || studentProfile.name, effectiveEmail) : '';
  const initials = getEmailInitials(effectiveEmail, effectiveName);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (learnRef.current && !learnRef.current.contains(event.target as Node)) {
        setLearnDropdownOpen(false);
      }
      if (labsRef.current && !labsRef.current.contains(event.target as Node)) {
        setLabsDropdownOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setResourcesDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (learnTimerRef.current) clearTimeout(learnTimerRef.current);
      if (labsTimerRef.current) clearTimeout(labsTimerRef.current);
      if (resourcesTimerRef.current) clearTimeout(resourcesTimerRef.current);
    };
  }, []);

  const handleLearnMouseEnter = () => {
    if (learnTimerRef.current) clearTimeout(learnTimerRef.current);
    setLearnDropdownOpen(true);
    setLabsDropdownOpen(false);
    setResourcesDropdownOpen(false);
  };

  const handleLearnMouseLeave = () => {
    learnTimerRef.current = setTimeout(() => {
      setLearnDropdownOpen(false);
    }, 150);
  };

  const handleLabsMouseEnter = () => {
    if (labsTimerRef.current) clearTimeout(labsTimerRef.current);
    setLabsDropdownOpen(true);
    setLearnDropdownOpen(false);
    setResourcesDropdownOpen(false);
  };

  const handleLabsMouseLeave = () => {
    labsTimerRef.current = setTimeout(() => {
      setLabsDropdownOpen(false);
    }, 150);
  };

  const handleResourcesMouseEnter = () => {
    if (resourcesTimerRef.current) clearTimeout(resourcesTimerRef.current);
    setResourcesDropdownOpen(true);
    setLearnDropdownOpen(false);
    setLabsDropdownOpen(false);
  };

  const handleResourcesMouseLeave = () => {
    resourcesTimerRef.current = setTimeout(() => {
      setResourcesDropdownOpen(false);
    }, 150);
  };

  const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Lafole%2FLogo-02.png?alt=media&token=a877d4d0-4c4e-43f4-bb92-b9cce99580ef";

  return (
    <header className="sticky top-0 z-50 bg-[#F9F9F8] dark:bg-[#0B0F17] transition-colors">
      <div className="border-b border-[#E5E5E3] dark:border-slate-800">
        <div className={`mx-auto ${activeView === 'dashboard' ? 'w-full px-3.5 sm:px-5 lg:px-6' : 'max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10'}`}>
          <div className="flex items-center justify-between h-16 sm:h-[68px]">
          
          {/* Left: Brand Logo & Navigation Links */}
          <div className="flex items-center space-x-3.5 sm:space-x-4 lg:space-x-5 xl:space-x-6 flex-shrink-0">
            {/* Logo: Lafole Academy Logo */}
            <div 
              id="navbar-brand-logo"
              onClick={() => setActiveView('home')}
              className="cursor-pointer flex items-center space-x-2 flex-shrink-0 group py-1"
              title="Lafole Academy - Home"
            >
              <div className="h-8 sm:h-9 flex items-center group-hover:opacity-90 transition-opacity">
                <img 
                  src={LOGO_URL} 
                  alt="Lafole Academy" 
                  referrerPolicy="no-referrer"
                  className="h-7 sm:h-8 w-auto max-w-[180px] sm:max-w-[210px] object-contain dark:brightness-0 dark:invert transition-all"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 xl:space-x-2 text-[14.5px] sm:text-[15px] font-[500] text-[#374151] dark:text-slate-200">
              
              {/* Learn Dropdown (Opens on hover as well as click) */}
              <div 
                className="relative py-2" 
                ref={learnRef}
                onMouseEnter={handleLearnMouseEnter}
                onMouseLeave={handleLearnMouseLeave}
              >
                <button
                  id="nav-dropdown-learn-trigger"
                  onClick={() => setLearnDropdownOpen(!learnDropdownOpen)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[14.5px] sm:text-[15px] font-[500] transition-colors hover:text-black dark:hover:text-white cursor-pointer ${
                    activeView === 'learn' || activeView === 'catalog' || activeView === 'diplomas' || activeView === 'books'
                      ? 'text-[#22C55E] dark:text-[#22C55E] font-[600]' 
                      : 'text-[#374151] dark:text-slate-200'
                  }`}
                >
                  <span>Learn</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#52525B] dark:text-slate-400 transition-transform duration-200 ${learnDropdownOpen ? 'rotate-180 text-[#22C55E]' : ''}`} />
                </button>

                {/* Dropdown Menu: Courses, Diplomas, Books (Clean, without badges or resume section) */}
                {learnDropdownOpen && (
                  <div 
                    id="nav-dropdown-learn-menu"
                    onMouseEnter={handleLearnMouseEnter}
                    onMouseLeave={handleLearnMouseLeave}
                    className="absolute left-0 top-full -mt-1 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fadeIn"
                  >
                    <div className="space-y-1">
                      
                      {/* 1. Courses */}
                      <button
                        id="dropdown-item-courses"
                        onClick={() => {
                          setActiveView('catalog');
                          setLearnDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors flex items-center space-x-3 cursor-pointer group ${
                          activeView === 'catalog'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#22C55E]'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-[#22C55E] flex-shrink-0 group-hover:scale-105 transition-transform">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[13px] text-slate-900 dark:text-white">
                            Courses
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            Explore all practitioner-led courses
                          </div>
                        </div>
                      </button>

                      {/* 2. Diplomas */}
                      <button
                        id="dropdown-item-diplomas"
                        onClick={() => {
                          setActiveView('diplomas');
                          setLearnDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors flex items-center space-x-3 cursor-pointer group ${
                          activeView === 'diplomas'
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[13px] text-slate-900 dark:text-white">
                            Diplomas
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            Multi-course paths into a real job
                          </div>
                        </div>
                      </button>

                      {/* 3. Books */}
                      <button
                        id="dropdown-item-books"
                        onClick={() => {
                          setActiveView('books');
                          setLearnDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors flex items-center space-x-3 cursor-pointer group ${
                          activeView === 'books'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[13px] text-slate-900 dark:text-white">
                            Books
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            Technical manuals
                          </div>
                        </div>
                      </button>

                    </div>
                  </div>
                )}
              </div>

              {/* Labs Dropdown (Hover & Click) */}
              <div 
                className="relative py-2" 
                ref={labsRef}
                onMouseEnter={handleLabsMouseEnter}
                onMouseLeave={handleLabsMouseLeave}
              >
                <button
                  onClick={() => setLabsDropdownOpen(!labsDropdownOpen)}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[14.5px] sm:text-[15px] font-[500] transition-colors hover:text-black dark:hover:text-white text-[#374151] dark:text-slate-200 cursor-pointer"
                >
                  <span>Labs</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#52525B] dark:text-slate-400 transition-transform duration-200 ${labsDropdownOpen ? 'rotate-180 text-[#22C55E]' : ''}`} />
                </button>

                {labsDropdownOpen && (
                  <div 
                    onMouseEnter={handleLabsMouseEnter}
                    onMouseLeave={handleLabsMouseLeave}
                    className="absolute left-0 top-full -mt-1 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fadeIn space-y-1"
                  >
                    <button 
                      onClick={() => { 
                        setActiveView('learn'); 
                        setLabsDropdownOpen(false); 
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <Terminal className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="font-semibold">Cloud Linux Terminal</div>
                        <div className="text-[10px] text-slate-400">Ubuntu / Debian Bash container</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => { 
                        setActiveView('learn'); 
                        setLabsDropdownOpen(false); 
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <Cpu className="w-4 h-4 text-indigo-500" />
                      <div>
                        <div className="font-semibold">Network Topology Lab</div>
                        <div className="text-[10px] text-slate-400">Cisco Packet Tracer simulation</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Hardware Link */}
              <button 
                onClick={() => {
                  alert('Lafole Hardware Lab: Real server racks, Cisco 2960 switches, and MikroTik CCR routers available for enrolled students.');
                }}
                className="px-2.5 py-1.5 rounded-lg text-[14.5px] sm:text-[15px] font-[500] transition-colors hover:text-black dark:hover:text-white text-[#374151] dark:text-slate-200 cursor-pointer"
              >
                Hardware
              </button>

              {/* Resources Dropdown (Hover & Click) */}
              <div 
                className="relative py-2" 
                ref={resourcesRef}
                onMouseEnter={handleResourcesMouseEnter}
                onMouseLeave={handleResourcesMouseLeave}
              >
                <button
                  onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[14.5px] sm:text-[15px] font-[500] transition-colors hover:text-black dark:hover:text-white cursor-pointer ${
                    activeView === 'progress' || activeView === 'instructor' ? 'text-[#22C55E] dark:text-[#22C55E] font-[600]' : 'text-[#374151] dark:text-slate-200'
                  }`}
                >
                  <span>Resources</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#52525B] dark:text-slate-400 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180 text-[#22C55E]' : ''}`} />
                </button>

                {resourcesDropdownOpen && (
                  <div 
                    onMouseEnter={handleResourcesMouseEnter}
                    onMouseLeave={handleResourcesMouseLeave}
                    className="absolute left-0 top-full -mt-1 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fadeIn space-y-1"
                  >
                    <button 
                      onClick={() => { 
                        if (onNavigateToDashboard) onNavigateToDashboard();
                        else setActiveView('dashboard');
                        setResourcesDropdownOpen(false); 
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2.5 text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 text-[#22C55E]" />
                      <div>
                        <div className="font-semibold">My Student Dashboard</div>
                        <div className="text-[10px] text-slate-400">Courses, diplomas, certificates & labs</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setActiveView('instructor'); setResourcesDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2.5 text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <div>
                        <div className="font-semibold">Instructor Studio</div>
                        <div className="text-[10px] text-slate-400">Video hosting & quiz builder</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Contact Link */}
              <button 
                onClick={() => alert('Contact Lafole Academy: info@lafole.net / +252 61 92909900')}
                className="px-2.5 py-1.5 rounded-lg text-[14.5px] sm:text-[15px] font-[500] transition-colors hover:text-black dark:hover:text-white text-[#374151] dark:text-slate-200 cursor-pointer"
              >
                Contact
              </button>
            </nav>
          </div>

          {/* Right: Search Bar, Dark Mode, Cart, Sign In, Start Learning CTA */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* Search Input Bar */}
            <div className="relative hidden lg:block">
              <div 
                onClick={onOpenSearch}
                className="flex items-center space-x-2 w-48 xl:w-56 h-9 px-3 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600 border border-[#E4E4E7] dark:border-slate-700/80 rounded-lg cursor-pointer transition-colors shadow-2xs"
              >
                <Search className="w-3.5 h-3.5 text-[#71717A] flex-shrink-0" />
                <span className="truncate text-[#9CA3AF] text-[13px]">Search courses, paths...</span>
                <kbd className="inline-block ml-auto px-1.5 py-0.5 text-[10px] font-mono font-medium bg-[#F4F4F5] dark:bg-slate-800 text-[#52525B] dark:text-slate-400 rounded border border-[#E4E4E7] dark:border-slate-700">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              id="btn-toggle-darkmode"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle dark mode"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-[#E4E4E7] dark:border-slate-800 text-[#27272A] dark:text-slate-200 transition-colors shadow-2xs cursor-pointer flex-shrink-0"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Cart Button & Dropdown */}
            <div className="relative" ref={cartRef}>
              <button
                id="btn-shopping-cart"
                onClick={() => setCartOpen(!cartOpen)}
                aria-label="Shopping cart"
                aria-expanded={cartOpen}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-[#E4E4E7] dark:border-slate-800 text-[#27272A] dark:text-slate-200 transition-colors shadow-2xs cursor-pointer flex-shrink-0"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#22C55E] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              <CartDropdown
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
                cartItems={cartItems}
                onRemoveItem={(courseId) => {
                  onRemoveFromCart?.(courseId);
                }}
                onCheckout={() => {
                  setCartOpen(false);
                  if (onCheckoutCart) {
                    onCheckoutCart();
                  } else {
                    setActiveView('cart');
                  }
                }}
                onViewCart={() => {
                  setCartOpen(false);
                  if (onViewCart) {
                    onViewCart();
                  } else {
                    setActiveView('cart');
                  }
                }}
              />
            </div>

            {/* Conditional Authentication View: Verified Student Avatar + My Dashboard OR Sign In + Start Learning */}
            {isEmailVerified ? (
              <>
                {/* Avatar with initials of their verified email (Matches user screenshot) */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    id="navbar-user-avatar"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="Student profile menu"
                    title={`Verified Email: ${effectiveEmail} (${initials})`}
                    className="w-9 h-9 rounded-full bg-[#F4F4EF] dark:bg-slate-800 border border-[#E5E5DE] dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 flex items-center justify-center text-[#52525B] dark:text-slate-200 font-semibold text-xs tracking-wider transition-all shadow-2xs cursor-pointer flex-shrink-0 select-none hover:scale-105"
                  >
                    <span>{initials}</span>
                  </button>

                  {/* Profile & Session Popover */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3.5 z-50 animate-fadeIn space-y-2.5">
                      <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-full bg-[#F4F4EF] dark:bg-slate-800 border border-[#E5E5DE] dark:border-slate-700 flex items-center justify-center text-[#52525B] dark:text-slate-200 font-bold text-sm tracking-wider flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {effectiveName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {effectiveEmail}
                          </div>
                          <div className="inline-flex items-center space-x-1 mt-1 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                            <span>Email Verified</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            if (onNavigateToDashboard) onNavigateToDashboard();
                            else setActiveView('dashboard');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <span className="font-medium">My Dashboard</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveView('learn');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <span className="font-medium">Course Classroom & Labs</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </div>

                      {onSignOut && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => {
                              onSignOut();
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium flex items-center space-x-1.5 cursor-pointer transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Primary Action Button: My Dashboard (Matches user screenshot) */}
                <button
                  id="btn-my-dashboard"
                  onClick={() => {
                    if (onNavigateToDashboard) onNavigateToDashboard();
                    else setActiveView('dashboard');
                  }}
                  className={`flex items-center space-x-1.5 h-9 px-3.5 sm:px-4 text-white text-[14px] font-[500] rounded-lg shadow-xs transition-all hover:scale-[1.01] flex-shrink-0 cursor-pointer whitespace-nowrap ${
                    activeView === 'dashboard'
                      ? 'bg-[#16A34A] ring-2 ring-[#22C55E]/40 font-[600]'
                      : 'bg-[#22C55E] hover:bg-[#16A34A]'
                  }`}
                >
                  <span>My Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                </button>
              </>
            ) : (
              <>
                {/* Sign In Text Link */}
                <button
                  id="btn-sign-in"
                  onClick={() => setActiveView('login')}
                  className={`hidden sm:inline-flex items-center h-9 px-2.5 text-[14.5px] font-[500] transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 ${
                    activeView === 'login'
                      ? 'text-[#22C55E] font-[600]'
                      : 'text-[#09090B] hover:text-[#22C55E] dark:text-slate-200 dark:hover:text-white'
                  }`}
                >
                  Sign in
                </button>

                {/* Primary Action Button: Start learning */}
                <button
                  id="btn-start-learning"
                  onClick={() => setActiveView('catalog')}
                  className="flex items-center space-x-1.5 h-9 px-3.5 sm:px-4 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[14px] font-[500] rounded-lg shadow-xs transition-all hover:scale-[1.01] flex-shrink-0 cursor-pointer whitespace-nowrap"
                >
                  <span>Start learning</span>
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Alert Bar just below the header (hidden on dashboard, catalog, diplomas, books, course-details, checkout, and cart pages) */}
    {activeView !== 'dashboard' && activeView !== 'catalog' && activeView !== 'diplomas' && activeView !== 'books' && activeView !== 'course-details' && activeView !== 'checkout' && activeView !== 'cart' && (
      <PromoAlertBar onShopNow={onShopNow} />
    )}
  </header>
  );
};
