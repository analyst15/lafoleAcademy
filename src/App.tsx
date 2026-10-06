import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Check, 
  BookOpen, 
  Clock, 
  Share2,
  Award,
  Search,
  X,
  Play,
  ShieldCheck
} from 'lucide-react';
import { Course, Lesson, LessonProgress, CourseProgress, QuizAttempt, StudentProfile, CartItem } from './types';
import { INITIAL_COURSES, INITIAL_STUDENT_PROFILE } from './data/courses';
import { 
  getStoredLessonProgress, 
  updateVideoWatchProgress, 
  recordQuizAttempt, 
  calculateCourseProgress, 
  resetCourseProgress,
  saveLessonProgress 
} from './utils/progressStorage';
import { getStoredCart, addCourseToCart, removeCourseFromCart, clearCart } from './utils/cartUtils';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LatestCoursesSection } from './components/LatestCoursesSection';
import { CourseCatalog } from './components/CourseCatalog';
import { DiplomaProgramsSection } from './components/DiplomaProgramsSection';
import { CatalogPage } from './components/CatalogPage';
import { DiplomasPage } from './components/DiplomasPage';
import { BooksPage } from './components/BooksPage';
import { ContactPage } from './components/ContactPage';
import { CourseDetailsPage } from './components/CourseDetailsPage';
import { CheckoutPage } from './components/CheckoutPage';
import { VerifyEmailPage } from './components/VerifyEmailPage';
import { LoginPage } from './components/LoginPage';
import { getAll93Courses } from './data/catalog93';
import { VideoPlayer } from './components/VideoPlayer';
import { QuizEngine } from './components/QuizEngine';
import { CourseCurriculum } from './components/CourseCurriculum';
import { ProgressDashboard } from './components/ProgressDashboard';
import { InstructorStudio } from './components/InstructorStudio';
import { CertificateModal } from './components/CertificateModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DashboardLayout, DashboardTab } from './components/dashboard/DashboardLayout';
import { 
  getStudentEnrolledCourseIds, 
  getStudentProfile, 
  updateStudentProfile,
  validateStudentVerificationStatus,
  signOutStudent
} from './lib/firebase';
import { formatStudentDisplayName } from './utils/userUtils';

export type AppView = 'home' | 'catalog' | 'learn' | 'progress' | 'instructor' | 'diplomas' | 'books' | 'course-details' | 'checkout' | 'verify-email' | 'login' | 'cart' | 'dashboard' | 'contact' | 'admin';

export function parseRouteFromLocation(): {
  view: AppView;
  dashboardTab: DashboardTab;
  isCheckout: boolean;
  courseParamId?: string;
} {
  if (typeof window === 'undefined') {
    return { view: 'home', dashboardTab: 'dashboard', isCheckout: false };
  }
  const rawPath = window.location.pathname.toLowerCase();
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath;

  // Support hash routing fallback (e.g. /#/catalog, /#/verify-email?token=..., #catalog, #/admin)
  const hashRaw = window.location.hash.toLowerCase().replace(/^#\/?/, '').split('?')[0];
  const hashRoute = hashRaw ? (hashRaw.startsWith('/') ? hashRaw : '/' + hashRaw).replace(/\/+$/, '') : '';

  const effectiveRoute = (path !== '/' ? path : hashRoute) || '/';

  // Read query params from both search and hash
  const searchParams = new URLSearchParams(window.location.search);
  const hashQuery = window.location.hash.includes('?') 
    ? window.location.hash.substring(window.location.hash.indexOf('?')) 
    : '';
  const hashParams = new URLSearchParams(hashQuery);
  const isCheckout = searchParams.get('checkout') === '1' || hashParams.get('checkout') === '1' || effectiveRoute.startsWith('/checkout');

  let dashboardTab: DashboardTab = 'dashboard';
  if (effectiveRoute === '/dashboard/mylearning') dashboardTab = 'mylearning';
  else if (effectiveRoute === '/dashboard/learning-path') dashboardTab = 'learning-path';
  else if (effectiveRoute === '/dashboard/certificates') dashboardTab = 'certificates';
  else if (effectiveRoute === '/dashboard/books') dashboardTab = 'books';
  else if (effectiveRoute === '/dashboard/orders') dashboardTab = 'orders';
  else if (effectiveRoute === '/dashboard/cyber-labs') dashboardTab = 'cyber-labs';
  else if (effectiveRoute === '/dashboard/networking-labs') dashboardTab = 'networking-labs';
  else if (effectiveRoute === '/dashboard/payments') dashboardTab = 'payments';
  else if (effectiveRoute === '/dashboard/downloads') dashboardTab = 'downloads';
  else if (effectiveRoute === '/dashboard/settings') dashboardTab = 'settings';
  else if (effectiveRoute === '/dashboard/help') dashboardTab = 'help';

  let view: AppView = 'home';
  let courseParamId: string | undefined = undefined;

  if (effectiveRoute === '/admin' || effectiveRoute.startsWith('/admin')) {
    view = 'admin';
  } else if (effectiveRoute === '/dashboard' || effectiveRoute.startsWith('/dashboard')) {
    view = 'dashboard';
  } else if (effectiveRoute === '/cart' || effectiveRoute.startsWith('/cart') || effectiveRoute.startsWith('/checkout')) {
    view = 'cart';
    if (effectiveRoute.startsWith('/checkout/')) {
      courseParamId = effectiveRoute.replace('/checkout/', '').trim();
    }
  } else if (effectiveRoute === '/catalog' || effectiveRoute.startsWith('/catalog')) {
    view = 'catalog';
  } else if (effectiveRoute === '/diplomas' || effectiveRoute.startsWith('/diplomas')) {
    view = 'diplomas';
  } else if (effectiveRoute === '/books' || effectiveRoute.startsWith('/books')) {
    view = 'books';
  } else if (effectiveRoute === '/login' || effectiveRoute.startsWith('/login')) {
    view = 'login';
  } else if (effectiveRoute.startsWith('/learn')) {
    view = 'learn';
  } else if (effectiveRoute.startsWith('/course/')) {
    view = 'course-details';
    courseParamId = effectiveRoute.replace('/course/', '').trim();
  } else if (effectiveRoute === '/verify-email' || effectiveRoute.startsWith('/verify-email') || effectiveRoute.startsWith('/verify')) {
    view = 'verify-email';
  } else if (effectiveRoute === '/contact' || effectiveRoute.startsWith('/contact')) {
    view = 'contact';
  }

  return { view, dashboardTab, isCheckout, courseParamId };
}

export default function App() {
  const [courses, setCourses] = useState<Course[]>(() => getAll93Courses());
  const initialRoute = useMemo(() => parseRouteFromLocation(), []);

  const [activeCourse, setActiveCourse] = useState<Course>(() => {
    if (initialRoute.courseParamId) {
      const all = getAll93Courses();
      const match = all.find(c => c.id === initialRoute.courseParamId || c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === initialRoute.courseParamId);
      if (match) return match;
    }
    return INITIAL_COURSES[0];
  });

  const [activeLesson, setActiveLesson] = useState<Lesson>(() => {
    if (activeCourse.modules && activeCourse.modules.length > 0 && activeCourse.modules[0].lessons.length > 0) {
      return activeCourse.modules[0].lessons[0];
    }
    return INITIAL_COURSES[0].modules[0].lessons[0];
  });
  
  // Dashboard Sub-route Tab state
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>(() => initialRoute.dashboardTab);

  // Active view: 'home' | 'catalog' | 'learn' | 'progress' | 'instructor' | 'diplomas' | 'books' | 'course-details' | 'checkout' | 'verify-email' | 'login' | 'cart' | 'dashboard'
  const [activeView, setActiveView] = useState<AppView>(() => initialRoute.view);

  const [isCheckoutMode, setIsCheckoutMode] = useState<boolean>(() => initialRoute.isCheckout);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lafole_theme') === 'dark';
    }
    return false;
  });
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getStoredCart());
  const cartCount = cartItems.length;

  useEffect(() => {
    const handleCartSync = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCartItems(e.detail);
      } else {
        setCartItems(getStoredCart());
      }
    };
    window.addEventListener('lafole_cart_updated', handleCartSync);
    return () => window.removeEventListener('lafole_cart_updated', handleCartSync);
  }, []);

  const [studentProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [lessonProgressMap, setLessonProgressMap] = useState<Record<string, LessonProgress>>({});
  const [courseProgress, setCourseProgress] = useState<CourseProgress>({
    courseId: INITIAL_COURSES[0].id,
    percentComplete: 0,
    completedLessonsCount: 0,
    totalLessonsCount: 0,
    totalTimeSpentSeconds: 0,
    lastAccessedAt: new Date().toISOString(),
    isCertificateUnlocked: false
  });

  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Session inactivity timeout: 15 minutes of inactivity for account safety
  const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;

  // Validation in progress state (checking database for verified flag)
  const [isValidatingAuth, setIsValidatingAuth] = useState<boolean>(false);

  // Email verification session state (triggers post-verification navbar with initials & My Dashboard)
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const isVerified = localStorage.getItem('lafole_email_verified') === 'true';
      if (!isVerified) return false;

      const lastActiveStr = localStorage.getItem('lafole_last_active_time');
      if (lastActiveStr) {
        const lastActive = parseInt(lastActiveStr, 10);
        if (!isNaN(lastActive) && Date.now() - lastActive > INACTIVITY_TIMEOUT_MS) {
          // Session expired due to inactivity while user was away
          localStorage.removeItem('lafole_email_verified');
          localStorage.removeItem('lafole_verified_email');
          localStorage.removeItem('lafole_verified_fullname');
          localStorage.removeItem('lafole_auth_user');
          localStorage.removeItem('lafole_cart_items');
          localStorage.removeItem('lafole_last_active_time');
          return false;
        }
      }
      return true;
    }
    return false;
  });

  const [verifiedEmail, setVerifiedEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const isVerified = localStorage.getItem('lafole_email_verified') === 'true';
      if (!isVerified) return '';
      const email = localStorage.getItem('lafole_verified_email');
      if (email) return email;
    }
    return '';
  });

  const [verifiedFullName, setVerifiedFullName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const isVerified = localStorage.getItem('lafole_email_verified') === 'true';
      if (!isVerified) return '';
      const name = localStorage.getItem('lafole_verified_fullname');
      if (name && !['verified student', 'nerd ninja'].includes(name.toLowerCase())) return name;
    }
    return '';
  });

  // CRITICAL DATABASE VALIDATION: Validate student's verified status directly against Firestore
  // Only runs when the user has an active authenticated session (isEmailVerified)
  // Never re-authenticates a signed out user on page refresh
  useEffect(() => {
    // If the student is signed out, ensure no background auto-sign-in happens
    const isActivelyLoggedIn = typeof window !== 'undefined' && localStorage.getItem('lafole_email_verified') === 'true';
    if (!isEmailVerified || !isActivelyLoggedIn) {
      return;
    }

    const candidateEmail = (
      verifiedEmail || 
      (typeof window !== 'undefined' ? localStorage.getItem('lafole_verified_email') : '') || 
      ''
    ).trim().toLowerCase();

    if (!candidateEmail) {
      setIsEmailVerified(false);
      return;
    }

    let isMounted = true;
    validateStudentVerificationStatus(candidateEmail).then((res) => {
      if (!isMounted) return;
      if (res.verified) {
        setIsEmailVerified(true);
        if (res.fullName && !['verified student', 'nerd ninja'].includes(res.fullName.toLowerCase())) {
          setVerifiedFullName(res.fullName);
          if (typeof window !== 'undefined') {
            localStorage.setItem('lafole_verified_fullname', res.fullName);
          }
        }
      } else {
        // Database confirms user is NOT verified! Revoke false local storage state
        setIsEmailVerified(false);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('lafole_email_verified');
          localStorage.removeItem('lafole_verified_email');
          localStorage.removeItem('lafole_verified_fullname');
          localStorage.removeItem('lafole_auth_user');
          const lastEnroll = localStorage.getItem('last_lafole_enrollment');
          if (lastEnroll) {
            try {
              const parsed = JSON.parse(lastEnroll);
              parsed.emailVerified = false;
              localStorage.setItem('last_lafole_enrollment', JSON.stringify(parsed));
            } catch {}
          }
        }
      }
    }).catch((err) => {
      console.warn("Database status verification check error on mount:", err);
    });

    return () => {
      isMounted = false;
    };
  }, [verifiedEmail, isEmailVerified]);

  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lafole_enrolled_course_ids');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
      // Check last_lafole_enrollment ONLY IF status is explicitly 'enrolled' (not a new account registration)
      const lastEnroll = localStorage.getItem('last_lafole_enrollment');
      if (lastEnroll) {
        try {
          const parsed = JSON.parse(lastEnroll);
          if (parsed.status === 'enrolled' && parsed.courseId && parsed.courseId !== 'general-student') {
            return [parsed.courseId];
          }
        } catch {}
      }
    }
    return [];
  });

  const enrolledCourses = useMemo(() => {
    return courses.filter(c => enrolledCourseIds.includes(c.id));
  }, [courses, enrolledCourseIds]);

  // Sync confirmed course enrollments & authentic student profile from Firestore for logged-in student
  useEffect(() => {
    if (!isEmailVerified || !verifiedEmail) {
      return;
    }
    let isMounted = true;
    
    // 1. Sync student profile (real name, phone, etc.)
    getStudentProfile(verifiedEmail)
      .then((profile) => {
        if (!isMounted || !profile) return;
        if (profile.fullName && !['verified student', 'nerd ninja'].includes(profile.fullName.toLowerCase())) {
          setVerifiedFullName(profile.fullName);
          if (typeof window !== 'undefined') {
            localStorage.setItem('lafole_verified_fullname', profile.fullName);
          }
        }
      })
      .catch((err) => {
        console.warn("Could not sync student profile from Firestore:", err);
      });

    // 2. Sync enrolled course IDs
    getStudentEnrolledCourseIds(verifiedEmail)
      .then((ids) => {
        if (!isMounted) return;
        setEnrolledCourseIds((prev) => {
          const merged = Array.from(new Set([...prev, ...ids]));
          if (typeof window !== 'undefined') {
            localStorage.setItem('lafole_enrolled_course_ids', JSON.stringify(merged));
          }
          return merged;
        });
      })
      .catch((err) => {
        console.warn("Could not sync student enrolled courses from Firestore:", err);
      });
    return () => {
      isMounted = false;
    };
  }, [isEmailVerified, verifiedEmail]);

  // Unique course page navigation with dedicated URL
  const navigateToCourse = useCallback((course: Course) => {
    setActiveCourse(course);
    if (course.modules && course.modules.length > 0 && course.modules[0].lessons.length > 0) {
      setActiveLesson(course.modules[0].lessons[0]);
    }
    setActiveView('course-details');
    if (typeof window !== 'undefined') {
      const coursePath = `/course/${course.id}`;
      if (window.location.pathname !== coursePath) {
        window.history.pushState({ view: 'course-details', courseId: course.id }, '', coursePath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Dedicated Cart & Checkout page navigation supporting /cart and /cart?checkout=1
  const navigateToCart = useCallback((checkout: boolean = false, course?: Course) => {
    if (course) {
      setActiveCourse(course);
      if (course.modules && course.modules.length > 0 && course.modules[0].lessons.length > 0) {
        setActiveLesson(course.modules[0].lessons[0]);
      }
    }
    setIsCheckoutMode(checkout);
    setActiveView('cart');
    if (typeof window !== 'undefined') {
      const targetUrl = checkout ? '/cart?checkout=1' : '/cart';
      if (window.location.pathname + window.location.search !== targetUrl) {
        window.history.pushState({ view: 'cart', checkout }, '', targetUrl);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const navigateToCheckout = useCallback((course: Course) => {
    navigateToCart(true, course);
  }, [navigateToCart]);

  // Dedicated Dashboard Navigation supporting /dashboard and all subroutes
  // Validates the student's status with the Firestore database rather than relying solely on local storage state
  const navigateToDashboard = useCallback((tab: DashboardTab = 'dashboard', overrideEmail?: string) => {
    const emailToValidate = (
      overrideEmail || 
      verifiedEmail || 
      (typeof window !== 'undefined' ? localStorage.getItem('lafole_verified_email') : '') || 
      ''
    ).trim().toLowerCase();

    if (!emailToValidate) {
      setIsEmailVerified(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('lafole_email_verified');
      }
      showToast('Please sign in or verify your email to access the student dashboard.', 'info');
      setActiveView('login');
      if (typeof window !== 'undefined') {
        window.history.pushState({ view: 'login' }, '', '/login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    setIsValidatingAuth(true);

    validateStudentVerificationStatus(emailToValidate)
      .then((res) => {
        if (res.verified) {
          setIsEmailVerified(true);
          setVerifiedEmail(emailToValidate);
          if (res.fullName && !['verified student', 'nerd ninja'].includes(res.fullName.toLowerCase())) {
            setVerifiedFullName(res.fullName);
            if (typeof window !== 'undefined') {
              localStorage.setItem('lafole_verified_fullname', res.fullName);
            }
          }
          if (typeof window !== 'undefined') {
            localStorage.setItem('lafole_email_verified', 'true');
            localStorage.setItem('lafole_verified_email', emailToValidate);
            localStorage.setItem('lafole_last_active_time', String(Date.now()));
          }

          setDashboardTab(tab);
          setActiveView('dashboard');
          if (typeof window !== 'undefined') {
            const tabPaths: Record<DashboardTab, string> = {
              'dashboard': '/dashboard',
              'mylearning': '/dashboard/mylearning',
              'learning-path': '/dashboard/learning-path',
              'certificates': '/dashboard/certificates',
              'books': '/dashboard/books',
              'orders': '/dashboard/orders',
              'cyber-labs': '/dashboard/cyber-labs',
              'networking-labs': '/dashboard/networking-labs',
              'payments': '/dashboard/payments',
              'downloads': '/dashboard/downloads',
              'settings': '/dashboard/settings',
              'help': '/dashboard/help'
            };
            const targetPath = tabPaths[tab] || '/dashboard';
            if (window.location.pathname !== targetPath) {
              window.history.pushState({ view: 'dashboard', tab }, '', targetPath);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          // Rejection from database: user is NOT verified!
          setIsEmailVerified(false);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('lafole_email_verified');
            const lastEnroll = localStorage.getItem('last_lafole_enrollment');
            if (lastEnroll) {
              try {
                const parsed = JSON.parse(lastEnroll);
                parsed.emailVerified = false;
                localStorage.setItem('last_lafole_enrollment', JSON.stringify(parsed));
              } catch {}
            }
          }
          showToast('Verification check: Your account is not verified in our database yet. Please click the verification link sent to your email.', 'info');
          setActiveView('login');
          if (typeof window !== 'undefined') {
            window.history.pushState({ view: 'login' }, '', '/login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      })
      .catch((err) => {
        console.warn("Could not validate status with database:", err);
        setIsEmailVerified(false);
        showToast('Could not validate student status with database. Please try signing in.', 'info');
        setActiveView('login');
      })
      .finally(() => {
        setIsValidatingAuth(false);
      });
  }, [verifiedEmail]);

  const navigateTo = useCallback((view: AppView) => {
    if (view === 'cart') {
      navigateToCart(false, activeCourse);
      return;
    }
    if (view === 'checkout') {
      navigateToCart(true, activeCourse);
      return;
    }
    if (view === 'dashboard' || view === 'progress') {
      navigateToDashboard('dashboard');
      return;
    }
    setActiveView(view);
    if (typeof window !== 'undefined') {
      const targetPath = view === 'catalog' 
        ? '/catalog' 
        : view === 'diplomas' 
        ? '/diplomas' 
        : view === 'books' 
        ? '/books' 
        : view === 'learn' 
        ? '/learn' 
        : view === 'course-details'
        ? `/course/${activeCourse.id}`
        : view === 'verify-email'
        ? '/verify-email'
        : view === 'login'
        ? '/login'
        : view === 'contact'
        ? '/contact'
        : view === 'admin'
        ? '/admin'
        : '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view }, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeCourse, navigateToCart, navigateToDashboard]);

  // Handle direct URL loading, hash changes, and browser forward/backward navigation
  useEffect(() => {
    const handleRouteSync = () => {
      const current = parseRouteFromLocation();
      setDashboardTab(current.dashboardTab);
      setIsCheckoutMode(current.isCheckout);

      if (current.view === 'dashboard') {
        // Validate with database rather than assuming local state
        navigateToDashboard(current.dashboardTab);
      } else {
        setActiveView(current.view);
      }

      if (current.courseParamId) {
        const found = courses.find(c => 
          c.id === current.courseParamId || 
          c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === current.courseParamId
        );
        if (found) {
          setActiveCourse(found);
          if (found.modules && found.modules[0]?.lessons[0]) {
            setActiveLesson(found.modules[0].lessons[0]);
          }
        }
      }
    };

    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, [courses, navigateToDashboard]);

  // If initial route is dashboard, validate against database immediately on mount
  useEffect(() => {
    if (initialRoute.view === 'dashboard') {
      navigateToDashboard(initialRoute.dashboardTab);
    }
  }, [initialRoute, navigateToDashboard]);

  // Sync dark mode class with root and localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('lafole_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('lafole_theme', 'light');
    }
  }, [isDarkMode]);

  // Keyboard shortcut for Cmd+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute all lesson IDs for active course
  const getAllLessonIds = useCallback((course: Course): string[] => {
    return course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  }, []);

  // Refresh progress from storage
  const refreshProgress = useCallback((courseToCalc = activeCourse) => {
    const allStored = getStoredLessonProgress();
    setLessonProgressMap(allStored);

    const allIds = getAllLessonIds(courseToCalc);
    const summary = calculateCourseProgress(courseToCalc.id, allIds.length, allIds);
    setCourseProgress(summary);
  }, [activeCourse, getAllLessonIds]);

  useEffect(() => {
    refreshProgress(activeCourse);
  }, [activeCourse, refreshProgress]);

  // Toast notification
  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Email verification success handler: validates student's status with Firestore database
  const handleEmailVerificationSuccess = useCallback((email: string, fullName?: string, verifiedCourseId?: string) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanDisplayName = formatStudentDisplayName(fullName, cleanEmail);
    if (cleanEmail) setVerifiedEmail(cleanEmail);
    if (cleanDisplayName) setVerifiedFullName(cleanDisplayName);

    // Validate against database to guarantee persistence and verified status
    if (cleanEmail) {
      validateStudentVerificationStatus(cleanEmail).then((res) => {
        if (res.verified) {
          setIsEmailVerified(true);
          if (res.fullName && !['verified student', 'nerd ninja'].includes(res.fullName.toLowerCase())) {
            setVerifiedFullName(res.fullName);
            if (typeof window !== 'undefined') {
              localStorage.setItem('lafole_verified_fullname', res.fullName);
            }
          }
        }
      }).catch(() => {});
    }

    setIsEmailVerified(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lafole_email_verified', 'true');
      localStorage.setItem('lafole_last_active_time', String(Date.now()));
      if (cleanEmail) localStorage.setItem('lafole_verified_email', cleanEmail);
      if (cleanDisplayName) localStorage.setItem('lafole_verified_fullname', cleanDisplayName);
      const lastEnroll = localStorage.getItem('last_lafole_enrollment');
      if (lastEnroll) {
        try {
          const parsed = JSON.parse(lastEnroll);
          parsed.emailVerified = true;
          if (cleanEmail) parsed.email = cleanEmail;
          if (cleanDisplayName) parsed.fullName = cleanDisplayName;
          localStorage.setItem('last_lafole_enrollment', JSON.stringify(parsed));
        } catch {}
      }
    }

    showToast(`🎉 Email verified! Welcome aboard.`, 'success');
  }, []);

  const handleRemoveFromCart = useCallback((courseId: string) => {
    const updated = removeCourseFromCart(courseId);
    setCartItems(updated);
    showToast('Course removed from cart.', 'info');
  }, []);

  const handleViewCart = useCallback(() => {
    let targetCourse = activeCourse;
    if (cartItems.length > 0) {
      const firstCourseId = cartItems[0].courseId;
      const matched = courses.find(c => c.id === firstCourseId);
      if (matched) targetCourse = matched;
    }
    navigateToCart(false, targetCourse);
  }, [cartItems, courses, activeCourse, navigateToCart]);

  const handleCheckoutCart = useCallback(() => {
    let targetCourse = activeCourse;
    if (cartItems.length > 0) {
      const firstCourseId = cartItems[0].courseId;
      const matched = courses.find(c => c.id === firstCourseId);
      if (matched) targetCourse = matched;
    }
    navigateToCart(true, targetCourse);
  }, [cartItems, courses, activeCourse, navigateToCart]);

  const handleSignOut = useCallback((reason?: string) => {
    setIsEmailVerified(false);
    setVerifiedEmail('');
    setVerifiedFullName('');
    setEnrolledCourseIds([]);
    clearCart();
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lafole_email_verified');
      localStorage.removeItem('lafole_verified_email');
      localStorage.removeItem('lafole_verified_fullname');
      localStorage.removeItem('lafole_auth_user');
      localStorage.removeItem('lafole_enrolled_course_ids');
      localStorage.removeItem('lafole_cart_items');
      localStorage.removeItem('lafole_last_active_time');
      localStorage.removeItem('last_lafole_enrollment');
      sessionStorage.clear();
    }
    signOutStudent().catch(() => {});
    if (activeView === 'dashboard' || activeView === 'instructor') {
      navigateTo('home');
    }
    const message = reason || 'Signed out of student session. Cart cleared.';
    showToast(message, 'info');
  }, [activeView, navigateTo]);

  // Session Inactivity Monitor: Auto sign-out after 15 minutes of inactivity for safety
  useEffect(() => {
    if (!isEmailVerified) return;

    let lastRecordedActivity = Date.now();
    try {
      const stored = localStorage.getItem('lafole_last_active_time');
      if (stored) {
        const parsedTime = parseInt(stored, 10);
        if (!isNaN(parsedTime) && Date.now() - parsedTime > INACTIVITY_TIMEOUT_MS) {
          handleSignOut('🔒 For your security, you were automatically signed out due to inactivity.');
          return;
        }
      }
      localStorage.setItem('lafole_last_active_time', String(Date.now()));
    } catch {}

    const recordActivity = () => {
      const now = Date.now();
      if (now - lastRecordedActivity > 10000) {
        lastRecordedActivity = now;
        try {
          localStorage.setItem('lafole_last_active_time', String(now));
        } catch {}
      }
    };

    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click', 'mousemove'];
    activityEvents.forEach((evt) => {
      window.addEventListener(evt, recordActivity, { passive: true });
    });

    // Check every 15 seconds if session has exceeded inactivity threshold
    const interval = setInterval(() => {
      try {
        const stored = localStorage.getItem('lafole_last_active_time');
        const lastActive = stored ? parseInt(stored, 10) : lastRecordedActivity;
        if (!isNaN(lastActive) && Date.now() - lastActive > INACTIVITY_TIMEOUT_MS) {
          handleSignOut('🔒 For your security, you were automatically signed out due to inactivity.');
        }
      } catch {}
    }, 15000);

    // Also check on tab focus or visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        try {
          const stored = localStorage.getItem('lafole_last_active_time');
          const lastActive = stored ? parseInt(stored, 10) : lastRecordedActivity;
          if (!isNaN(lastActive) && Date.now() - lastActive > INACTIVITY_TIMEOUT_MS) {
            handleSignOut('🔒 For your security, you were automatically signed out due to inactivity.');
          } else {
            recordActivity();
          }
        } catch {}
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, recordActivity);
      });
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [isEmailVerified, handleSignOut, INACTIVITY_TIMEOUT_MS]);

  // Video watch progress handler with 90% completion trigger
  const handleVideoProgressUpdate = (currentTime: number, duration: number) => {
    if (!activeLesson || activeLesson.type !== 'video') return;
    const { progress, justCompleted } = updateVideoWatchProgress(
      activeLesson.id,
      activeLesson.moduleId,
      activeCourse.id,
      currentTime,
      duration,
      90 // 90% threshold for automated completion
    );

    setLessonProgressMap((prev) => ({
      ...prev,
      [activeLesson.id]: progress
    }));

    if (justCompleted) {
      showToast(`🎉 Automated Tracking: "${activeLesson.title}" marked complete (≥90% watched)!`);
      const allIds = getAllLessonIds(activeCourse);
      const summary = calculateCourseProgress(activeCourse.id, allIds.length, allIds);
      setCourseProgress(summary);
    }
  };

  const handleVideoAutoCompleted = () => {
    refreshProgress(activeCourse);
  };

  // Quiz completed handler
  const handleQuizCompleted = (attempt: QuizAttempt, passed: boolean) => {
    if (!activeLesson || activeLesson.type !== 'quiz' || !activeLesson.quiz) return;

    const { progress, justPassed } = recordQuizAttempt(
      activeLesson.id,
      activeLesson.moduleId,
      activeCourse.id,
      attempt,
      activeLesson.quiz.passingScorePercent
    );

    setLessonProgressMap((prev) => ({
      ...prev,
      [activeLesson.id]: progress
    }));

    const allIds = getAllLessonIds(activeCourse);
    const summary = calculateCourseProgress(activeCourse.id, allIds.length, allIds);
    setCourseProgress(summary);

    if (justPassed) {
      showToast(`🏆 Technical Assessment Passed (${attempt.score}%)! Course credits updated.`);
    }
  };

  // Reset course progress to test automated triggers
  const handleResetProgress = () => {
    if (window.confirm('Reset progress for this diploma track to test automated tracking triggers?')) {
      const allIds = getAllLessonIds(activeCourse);
      resetCourseProgress(activeCourse.id, allIds);
      refreshProgress(activeCourse);
      showToast('Course progress reset. Video tracking and quizzes ready to test!', 'info');
    }
  };

  // Add lesson from instructor studio
  const handleAddLessonToCourse = (moduleId: string, newLesson: Lesson) => {
    setCourses((prevCourses) => {
      return prevCourses.map((c) => {
        if (c.id !== activeCourse.id) return c;
        const updatedModules = c.modules.map((m) => {
          if (m.id !== moduleId) return m;
          return {
            ...m,
            lessons: [...m.lessons, newLesson]
          };
        });
        const updatedCourse = { ...c, modules: updatedModules };
        setActiveCourse(updatedCourse);
        return updatedCourse;
      });
    });
    showToast(`Published "${newLesson.title}" to curriculum!`);
  };

  // Lesson traversal
  const allFlattenedLessons = activeCourse.modules.flatMap((m) => m.lessons);
  const currentLessonIndex = allFlattenedLessons.findIndex((l) => l.id === activeLesson.id);
  const prevLesson = currentLessonIndex > 0 ? allFlattenedLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < allFlattenedLessons.length - 1
      ? allFlattenedLessons[currentLessonIndex + 1]
      : null;

  const currentProgress = lessonProgressMap[activeLesson.id];
  const isCurrentLessonComplete = currentProgress?.status === 'completed';

  // Quick manual completion toggle override
  const handleToggleManualCompletion = () => {
    const all = getStoredLessonProgress();
    const existing = all[activeLesson.id] || {
      lessonId: activeLesson.id,
      moduleId: activeLesson.moduleId,
      courseId: activeCourse.id,
      status: 'in_progress',
      videoWatchSeconds: 0,
      videoDurationSeconds: 0,
      maxPercentageWatched: 0,
      lastPlaybackPositionSeconds: 0,
      quizAttempts: []
    };

    const nextStatus = existing.status === 'completed' ? 'in_progress' : 'completed';
    const updated: LessonProgress = {
      ...existing,
      status: nextStatus,
      maxPercentageWatched: nextStatus === 'completed' ? 100 : existing.maxPercentageWatched,
      completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined
    };

    all[activeLesson.id] = updated;
    saveLessonProgress(all);
    setLessonProgressMap(all);

    const allIds = getAllLessonIds(activeCourse);
    const summary = calculateCourseProgress(activeCourse.id, allIds.length, allIds);
    setCourseProgress(summary);

    showToast(
      nextStatus === 'completed'
        ? `Marked "${activeLesson.title}" as completed!`
        : `Marked "${activeLesson.title}" as in progress.`,
      'info'
    );
  };

  // Transition to classroom learning view
  const handleEnrollAndLearn = useCallback((course: Course) => {
    setEnrolledCourseIds((prev) => {
      if (prev.includes(course.id)) return prev;
      const updated = [...prev, course.id];
      if (typeof window !== 'undefined') {
        localStorage.setItem('lafole_enrolled_course_ids', JSON.stringify(updated));
      }
      return updated;
    });
    setActiveCourse(course);
    if (course.modules && course.modules.length > 0 && course.modules[0].lessons.length > 0) {
      setActiveLesson(course.modules[0].lessons[0]);
    }
    setActiveView('learn');
    if (typeof window !== 'undefined') {
      const learnPath = `/learn?course=${course.id}`;
      window.history.pushState({ view: 'learn', courseId: course.id }, '', learnPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const scrollToCatalog = () => {
    navigateTo('catalog');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-[#22C55E]/20">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 bg-slate-950 text-white rounded-2xl shadow-2xl border border-slate-800 animate-slideUp">
          <Sparkles className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Validating Student Status Loading Overlay */}
      {isValidatingAuth && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-[#22C55E]">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Validating Account Verification</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Verifying your status with the database before opening your dashboard...</p>
            </div>
          </div>
        </div>
      )}

      {/* Global Quick Navigation Bar (Reference Navbar with Lafole Academy Logo) */}
      {activeView !== 'login' && activeView !== 'admin' && (
        <Navbar
          activeView={activeView}
          setActiveView={navigateTo}
          onNavigateToDashboard={() => navigateToDashboard('dashboard')}
          courses={courses}
          activeCourse={activeCourse}
          onSelectCourse={navigateToCourse}
          courseProgress={courseProgress}
          studentProfile={studentProfile}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSearch={() => setSearchModalOpen(true)}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          cartCount={cartCount}
          cartItems={cartItems}
          onRemoveFromCart={handleRemoveFromCart}
          onCheckoutCart={handleCheckoutCart}
          onViewCart={handleViewCart}
          onShopNow={scrollToCatalog}
          isEmailVerified={isEmailVerified}
          verifiedUserEmail={verifiedEmail}
          verifiedUserName={verifiedFullName}
          onSignOut={handleSignOut}
        />
      )}

      {/* View 1: Clean Slate Home View (Featuring Exact Reference Hero & Lafole Logo) */}
      {activeView === 'home' && (
        <main className="flex-1 flex flex-col w-full max-w-full min-w-0 overflow-x-hidden">
          {/* Exact Reference Hero Component */}
          <HeroSection
            onBrowseCourses={() => navigateTo('catalog')}
            onViewTracks={() => navigateTo('diplomas')}
            onSelectFeaturedCourse={navigateToCourse}
            featuredCourse={courses[0]}
          />

          {/* Latest Courses Section (recreated with exact inspiration) */}
          <LatestCoursesSection
            courses={courses}
            onSelectCourse={navigateToCourse}
            onOpenFullCatalog={() => navigateTo('catalog')}
          />

          {/* Interactive Course Catalog Section */}
          <CourseCatalog
            courses={courses}
            activeCourse={activeCourse}
            onSelectCourse={navigateToCourse}
            onStartCourse={navigateToCourse}
            courseProgress={courseProgress}
            lessonProgressMap={lessonProgressMap}
          />

          {/* Lafole Diploma Programs Section (recreated from inspiration) */}
          <DiplomaProgramsSection
            onSelectTrack={(trackName) => {
              const matching = courses.find((c) => 
                c.title.toLowerCase().includes(trackName.toLowerCase().slice(0, 7)) ||
                c.tags.some((t) => trackName.toLowerCase().includes(t.toLowerCase())) ||
                trackName.toLowerCase().includes(c.category.toLowerCase())
              );
              if (matching) {
                navigateToCourse(matching);
              } else {
                navigateTo('diplomas');
              }
            }}
            onExploreAll={() => navigateTo('diplomas')}
          />

          {/* Footer Note */}
          <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900/50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Lafole Academy</span>
                <span>•</span>
                <span>Hoyga Tababarka injineerada Mustaqbalka</span>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => navigateTo('diplomas')} className="hover:text-[#22C55E]">
                  Diploma Tracks
                </button>
                <button onClick={() => navigateTo('catalog')} className="hover:text-[#22C55E]">
                  Courses
                </button>
                <button onClick={() => navigateTo('progress')} className="hover:text-[#22C55E]">
                  Progress Tracker
                </button>
                <button onClick={() => navigateTo('instructor')} className="hover:text-[#22C55E]">
                  Instructor Studio
                </button>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#22C55E]">
                  Contact
                </button>
                <button onClick={handleResetProgress} className="hover:text-amber-500">
                  Reset Demo State
                </button>
              </div>
            </div>
          </footer>
        </main>
      )}

      {/* View: Dedicated /diplomas Page (Directly matches reference screenshot) */}
      {activeView === 'diplomas' && (
        <div className="flex-1 flex flex-col">
          <DiplomasPage
            courses={courses}
            onSelectTrack={(track) => {
              const matched = courses.find(c => 
                c.title.toLowerCase().includes(track.courseNames[0].toLowerCase().slice(0, 10)) ||
                c.category.toLowerCase().includes(track.category.toLowerCase().slice(0, 5))
              ) || courses[0];
              navigateToCourse(matched);
            }}
            onStartCourse={navigateToCourse}
            onBackToHome={() => navigateTo('home')}
          />
          <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900/50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Lafole Academy</span>
                <span>•</span>
                <span>Hoyga Tababarka injineerada Mustaqbalka</span>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => navigateTo('home')} className="hover:text-[#22C55E]">
                  Home
                </button>
                <button onClick={() => navigateTo('catalog')} className="hover:text-[#22C55E]">
                  Course Catalog
                </button>
                <button onClick={() => navigateTo('progress')} className="hover:text-[#22C55E]">
                  Progress Tracker
                </button>
                <button onClick={() => navigateTo('instructor')} className="hover:text-[#22C55E]">
                  Instructor Studio
                </button>
                <button onClick={handleResetProgress} className="hover:text-amber-500">
                  Reset Demo State
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* View: Dedicated /catalog Page (Separate Page with Alert and All 93 Courses) */}
      {activeView === 'catalog' && (
        <div className="flex-1 flex flex-col">
          <CatalogPage
            courses={courses}
            onSelectCourse={navigateToCourse}
            onBackToHome={() => navigateTo('home')}
          />
          <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900/50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Lafole Academy</span>
                <span>•</span>
                <span>Hoyga Tababarka injineerada Mustaqbalka</span>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => navigateTo('home')} className="hover:text-[#22C55E]">
                  Home
                </button>
                <button onClick={() => navigateTo('diplomas')} className="hover:text-[#22C55E]">
                  8 Diploma Tracks
                </button>
                <button onClick={() => navigateTo('books')} className="hover:text-[#22C55E]">
                  Books & Manuals
                </button>
                <button onClick={() => navigateTo('progress')} className="hover:text-[#22C55E]">
                  Progress Tracker
                </button>
                <button onClick={() => navigateTo('instructor')} className="hover:text-[#22C55E]">
                  Instructor Studio
                </button>
                <button onClick={handleResetProgress} className="hover:text-amber-500">
                  Reset Demo State
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* View: Dedicated /course/:id Page with Unique Link and Custom Course Details UI */}
      {activeView === 'course-details' && (
        <div className="flex-1 flex flex-col">
          <CourseDetailsPage
            course={activeCourse}
            onEnroll={navigateToCheckout}
            onBackToCatalog={() => navigateTo('catalog')}
            onBackToHome={() => navigateTo('home')}
          />
          <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900/50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Lafole Academy</span>
                <span>•</span>
                <span>Hoyga Tababarka injineerada Mustaqbalka</span>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => navigateTo('home')} className="hover:text-[#22C55E]">
                  Home
                </button>
                <button onClick={() => navigateTo('catalog')} className="hover:text-[#22C55E]">
                  All Courses
                </button>
                <button onClick={() => navigateTo('diplomas')} className="hover:text-[#22C55E]">
                  8 Diploma Tracks
                </button>
                <button onClick={() => navigateTo('books')} className="hover:text-[#22C55E]">
                  Books & Manuals
                </button>
                <button onClick={() => navigateTo('progress')} className="hover:text-[#22C55E]">
                  Progress Tracker
                </button>
                <button onClick={handleResetProgress} className="hover:text-amber-500">
                  Reset Demo State
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* View: Dedicated /cart and /cart?checkout=1 Page matching reference UI */}
      {(activeView === 'cart' || activeView === 'checkout') && (
        <div className="flex-1 flex flex-col">
          <CheckoutPage
            course={activeCourse}
            onCompleteEnrollment={handleEnrollAndLearn}
            onBackToCourse={() => navigateToCourse(activeCourse)}
            onBackToCatalog={() => navigateTo('catalog')}
            onBackToHome={() => navigateTo('home')}
            onNavigateToLogin={() => navigateTo('login')}
            onEmailVerified={(em, fn) => handleEmailVerificationSuccess(em, fn, activeCourse.id)}
            isUserSignedIn={isEmailVerified}
            userEmail={verifiedEmail}
            userFullName={verifiedFullName}
            cartItems={cartItems}
            onRemoveCartItem={handleRemoveFromCart}
            isCheckoutMode={isCheckoutMode}
            onToggleCheckoutMode={(chk) => navigateToCart(chk, activeCourse)}
          />
          <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900/50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Lafole Academy</span>
                <span>•</span>
                <span>Hoyga Tababarka injineerada Mustaqbalka</span>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => navigateTo('home')} className="hover:text-[#22C55E]">
                  Home
                </button>
                <button onClick={() => navigateTo('catalog')} className="hover:text-[#22C55E]">
                  All Courses
                </button>
                <button onClick={() => navigateTo('diplomas')} className="hover:text-[#22C55E]">
                  8 Diploma Tracks
                </button>
                <button onClick={() => navigateTo('books')} className="hover:text-[#22C55E]">
                  Books & Manuals
                </button>
                <button onClick={() => navigateTo('progress')} className="hover:text-[#22C55E]">
                  Progress Tracker
                </button>
                <button onClick={handleResetProgress} className="hover:text-amber-500">
                  Reset Demo State
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* View: Dedicated /verify-email Token Verification Page */}
      {activeView === 'verify-email' && (
        <div className="flex-1 flex flex-col">
          <VerifyEmailPage
            courses={courses}
            onEmailVerified={handleEmailVerificationSuccess}
            onGoToDashboard={() => navigateToDashboard('dashboard')}
            onContinue={(cId) => {
              const target = courses.find(c => c.id === cId) || activeCourse;
              navigateToCheckout(target);
            }}
            onBackToHome={() => navigateTo('home')}
          />
        </div>
      )}

      {/* View: Dedicated /login Page (Matches reference screenshot) */}
      {activeView === 'login' && (
        <div className="flex-1 flex flex-col">
          <LoginPage
            onSuccessSignIn={(user) => {
              handleEmailVerificationSuccess(user?.email || '', user?.name);
              showToast(`Welcome back, ${formatStudentDisplayName(user?.name, user?.email)}!`, 'info');
              navigateToDashboard('dashboard');
            }}
            onBackToHome={() => navigateTo('home')}
            onNavigateToCatalog={() => navigateTo('catalog')}
            onNavigateToDashboard={() => navigateToDashboard('dashboard')}
          />
        </div>
      )}

      {/* View: Dedicated /books Page */}
      {activeView === 'books' && (
        <div className="flex-1 flex flex-col">
          <BooksPage
            onBackToHome={() => navigateTo('home')}
            onExploreCourses={() => navigateTo('catalog')}
          />
          <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900/50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Lafole Academy</span>
                <span>•</span>
                <span>Hoyga Tababarka injineerada Mustaqbalka</span>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => navigateTo('home')} className="hover:text-[#22C55E]">
                  Home
                </button>
                <button onClick={() => navigateTo('catalog')} className="hover:text-[#22C55E]">
                  Course Catalog
                </button>
                <button onClick={() => navigateTo('diplomas')} className="hover:text-[#22C55E]">
                  8 Diploma Tracks
                </button>
                <button onClick={() => navigateTo('progress')} className="hover:text-[#22C55E]">
                  Progress Tracker
                </button>
                <button onClick={() => navigateTo('instructor')} className="hover:text-[#22C55E]">
                  Instructor Studio
                </button>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#22C55E]">
                  Contact
                </button>
                <button onClick={handleResetProgress} className="hover:text-amber-500">
                  Reset Demo State
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* View: Dedicated /contact Page (Matches reference UI screenshot) */}
      {activeView === 'contact' && (
        <div className="flex-1 flex flex-col">
          <ContactPage
            onBackToHome={() => navigateTo('home')}
            onExploreCourses={() => navigateTo('catalog')}
          />
          <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900/50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">Lafole Academy</span>
                <span>•</span>
                <span>Hoyga Tababarka injineerada Mustaqbalka</span>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => navigateTo('home')} className="hover:text-[#22C55E]">
                  Home
                </button>
                <button onClick={() => navigateTo('catalog')} className="hover:text-[#22C55E]">
                  Course Catalog
                </button>
                <button onClick={() => navigateTo('diplomas')} className="hover:text-[#22C55E]">
                  8 Diploma Tracks
                </button>
                <button onClick={() => navigateTo('books')} className="hover:text-[#22C55E]">
                  Books &amp; Manuals
                </button>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#22C55E] text-[#22C55E] font-semibold">
                  Contact
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* View 2: Student Video Player & Quiz Learning View */}
      {activeView === 'learn' && (
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-6">
          
          {/* Breadcrumbs & Navigation Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                <button 
                  onClick={() => setActiveView('home')} 
                  className="hover:text-[#22C55E] flex items-center space-x-1"
                >
                  <span>Home</span>
                </button>
                <span>/</span>
                <span className="truncate max-w-[150px]">{activeCourse.title}</span>
                <span>/</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                  {activeCourse.modules.find((m) => m.id === activeLesson.moduleId)?.title}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {activeLesson.title}
              </h1>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
              <button
                id="btn-toggle-completion-override"
                onClick={handleToggleManualCompletion}
                title="Toggle completion status manually"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isCurrentLessonComplete
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrentLessonComplete ? 'text-[#22C55E]' : 'text-slate-400'}`} />
                <span>{isCurrentLessonComplete ? 'Completed' : 'Mark Done'}</span>
              </button>

              <button
                onClick={() => setActiveView('progress')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold shadow-2xs"
              >
                <Clock className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>{courseProgress.percentComplete}% Complete</span>
              </button>

              {courseProgress.isCertificateUnlocked && (
                <button
                  onClick={() => setIsCertificateModalOpen(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Diploma Ready</span>
                </button>
              )}
            </div>
          </div>

          {/* Player & Curriculum Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 8 Cols: Video Player or Quiz Engine */}
            <div className="lg:col-span-8 space-y-6">
              {activeLesson.type === 'video' ? (
                <VideoPlayer
                  key={activeLesson.id}
                  lesson={activeLesson}
                  moduleId={activeLesson.moduleId}
                  courseId={activeCourse.id}
                  progress={currentProgress}
                  onUpdateProgress={handleVideoProgressUpdate}
                  onAutoCompleted={handleVideoAutoCompleted}
                />
              ) : (
                <QuizEngine
                  key={activeLesson.id}
                  lesson={activeLesson}
                  moduleId={activeLesson.moduleId}
                  courseId={activeCourse.id}
                  progress={currentProgress}
                  onQuizCompleted={handleQuizCompleted}
                />
              )}

              {/* Lesson Details & Resources Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E]/10 text-[#22C55E]">
                      {activeLesson.type === 'video' ? 'Hosted Lecture' : 'Interactive Assessment'}
                    </span>
                    <span className="text-xs text-slate-400">
                      Duration: {Math.round(activeLesson.durationMinutes)} mins
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Lesson Overview
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeLesson.description}
                  </p>
                </div>

                {/* Downloadable Resources */}
                {((activeLesson.resources && activeLesson.resources.length > 0) || (activeCourse.resources && activeCourse.resources.length > 0)) && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                      <FileText className="w-3.5 h-3.5 mr-1.5 text-[#22C55E]" />
                      Course Notes & Downloadable Materials ({(activeLesson.resources?.length || 0) > 0 ? activeLesson.resources!.length : activeCourse.resources!.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {((activeLesson.resources && activeLesson.resources.length > 0) ? activeLesson.resources : (activeCourse.resources || [])).map((res) => (
                        <a
                          key={res.id}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 hover:border-emerald-300 transition-colors text-xs"
                        >
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                            {res.title}
                          </span>
                          <span className="text-[10px] text-[#22C55E] font-semibold flex items-center flex-shrink-0">
                            {res.size ? res.size : 'Download'}
                            <Download className="w-3 h-3 ml-1" />
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructor Biography Row */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-start space-x-3">
                  <img
                    src={activeCourse.instructor.avatar}
                    alt={activeCourse.instructor.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div className="space-y-0.5 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {activeCourse.instructor.name}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 font-medium">
                      {activeCourse.instructor.role}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug pt-0.5">
                      {activeCourse.instructor.bio}
                    </p>
                  </div>
                </div>

                {/* Previous / Next Lesson Navigation Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {prevLesson ? (
                    <button
                      id="btn-nav-prev-lesson"
                      onClick={() => setActiveLesson(prevLesson)}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="truncate max-w-[140px] sm:max-w-[200px] text-left">
                        {prevLesson.title}
                      </span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {nextLesson && (
                    <button
                      id="btn-nav-next-lesson"
                      onClick={() => setActiveLesson(nextLesson)}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-xs font-semibold shadow-xs transition-all hover:scale-[1.01] cursor-pointer"
                    >
                      <span className="truncate max-w-[140px] sm:max-w-[200px] text-right">
                        Next: {nextLesson.title}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Curriculum Outline Accordion */}
            <div className="lg:col-span-4 sticky top-24">
              <CourseCurriculum
                course={activeCourse}
                activeLessonId={activeLesson.id}
                onSelectLesson={(lesson) => setActiveLesson(lesson)}
                lessonProgressMap={lessonProgressMap}
                courseProgress={courseProgress}
              />
            </div>
          </div>
        </main>
      )}

      {/* View: Dedicated /dashboard Student Dashboard with Sub-Routes matching screenshots */}
      {activeView === 'dashboard' && isEmailVerified && (
        <DashboardLayout
          currentTab={dashboardTab}
          onTabChange={(tab) => navigateToDashboard(tab)}
          onBackToHome={() => navigateTo('home')}
          onExploreCourses={() => navigateTo('catalog')}
          onExploreDiplomas={() => navigateTo('diplomas')}
          onBrowseBooks={() => navigateTo('books')}
          onResumeCourse={(c) => {
            setActiveCourse(c);
            if (c.modules && c.modules[0]?.lessons[0]) {
              setActiveLesson(c.modules[0].lessons[0]);
            }
            navigateTo('learn');
          }}
          onViewCourseDetails={(c) => navigateToCourse(c)}
          onOpenCertificate={(c) => {
            setActiveCourse(c);
            setIsCertificateModalOpen(true);
          }}
          enrolledCourses={enrolledCourses}
          courseProgressMap={
            enrolledCourses.reduce<Record<string, CourseProgress>>((acc, c) => {
              if (c.id === activeCourse.id && courseProgress.percentComplete > 0) {
                acc[c.id] = courseProgress;
              } else {
                acc[c.id] = {
                  courseId: c.id,
                  percentComplete: 0,
                  completedLessonsCount: 0,
                  totalLessonsCount: c.modules.flatMap(m => m.lessons).length,
                  totalTimeSpentSeconds: 0,
                  lastAccessedAt: new Date().toISOString(),
                  isCertificateUnlocked: false
                };
              }
              return acc;
            }, {})
          }
          userName={formatStudentDisplayName(verifiedFullName, verifiedEmail)}
          userEmail={verifiedEmail || ''}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onSignOut={handleSignOut}
          onUpdateName={(name) => {
            const cleanName = formatStudentDisplayName(name, verifiedEmail);
            setVerifiedFullName(cleanName);
            if (typeof window !== 'undefined') {
              localStorage.setItem('lafole_verified_fullname', cleanName);
            }
            if (verifiedEmail) {
              updateStudentProfile(verifiedEmail, { fullName: cleanName }).catch(() => {});
            }
          }}
          showToast={(text, type) => showToast(text, type === 'error' ? 'info' : 'success')}
        />
      )}

      {/* Access Denied Guard if accessing /dashboard while unverified in database */}
      {activeView === 'dashboard' && !isEmailVerified && !isValidatingAuth && (
        <div className="flex-1 flex items-center justify-center p-6 min-h-[60vh]">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-lg space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto text-amber-500">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Email Verification Required</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Access to your student dashboard requires a verified student account. Please verify your email or sign in to continue.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={() => navigateTo('login')}
                className="flex-1 py-2.5 px-4 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigateTo('home')}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View 3: Automated Student Progress Tracking Dashboard */}
      {activeView === 'progress' && (
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6">
          <div className="mb-4">
            <button
              onClick={() => setActiveView('home')}
              className="text-xs text-slate-500 hover:text-[#22C55E] flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </div>
          <ProgressDashboard
            course={activeCourse}
            courseProgress={courseProgress}
            lessonProgressMap={lessonProgressMap}
            studentProfile={studentProfile}
            onOpenCertificate={() => setIsCertificateModalOpen(true)}
            onContinueLearning={() => setActiveView('learn')}
          />
        </main>
      )}

      {/* View 4: Instructor Studio (Video Hosting & Quizzes Management) */}
      {activeView === 'instructor' && (
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6">
          <div className="mb-4">
            <button
              onClick={() => setActiveView('home')}
              className="text-xs text-slate-500 hover:text-[#22C55E] flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </div>
          <InstructorStudio
            course={activeCourse}
            onAddLessonToCourse={handleAddLessonToCourse}
            onSwitchToStudentView={() => navigateTo('learn')}
          />
        </main>
      )}

      {/* View 13: Admin Payments Dashboard (/admin) */}
      {activeView === 'admin' && (
        <AdminDashboard
          onBackToHome={() => navigateTo('home')}
          onNavigateToCourse={(cId) => {
            const found = courses.find(c => c.id === cId || c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cId);
            if (found) navigateToCourse(found);
            else navigateTo('catalog');
          }}
          onNavigateToStudentDashboard={() => navigateToDashboard('mylearning')}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      )}

      {/* Quick Search Modal (Cmd+K) */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search diploma tracks, video lectures, and quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-3 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1">
                Quick Navigation
              </div>
              {courses.slice(0, 10).map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    navigateToCourse(c);
                    setSearchModalOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{c.title}</div>
                    <div className="text-[11px] text-slate-400">{c.category} • {c.level}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-3 text-[11px] text-slate-400">
                <span>Press ESC to close</span>
                <span className="font-semibold text-[#22C55E]">Lafole Academy</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verifiable Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        course={activeCourse}
        studentProfile={studentProfile}
        courseProgress={courseProgress}
      />
    </div>
  );
}
