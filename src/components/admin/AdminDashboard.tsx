import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard,
  ShoppingBag,
  GraduationCap,
  Users,
  Settings,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  Eye,
  EyeOff,
  Check,
  Copy,
  LogOut,
  BookOpen,
  Smartphone,
  Mail,
  Lock,
  Layers,
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Tag,
  UserCog,
  Crown,
  KeyRound,
  ShieldAlert,
  UserCheck,
  UserX
} from 'lucide-react';
import {
  PaymentTableRecord,
  getAdminPayments,
  approveAdminPayment,
  rejectAdminPayment,
  saveCourseToFirestore,
  deleteCourseFromFirestore,
  getAdminUsersFromFirestore,
  saveAdminUserToFirestore,
  deleteAdminUserFromFirestore,
  DEFAULT_SUPER_ADMIN_EMAIL
} from '../../lib/firebase';
import { PaymentDetailModal } from './PaymentDetailModal';
import { CourseFormModal } from './CourseFormModal';
import { DeleteCourseModal } from './DeleteCourseModal';
import { AdminUserFormModal } from './AdminUserFormModal';
import { DeleteAdminUserModal } from './DeleteAdminUserModal';
import { AdminAuthSession } from './AdminAuthGate';
import { Course, AdminUser } from '../../types';
import { getAll93Courses } from '../../data/catalog93';

const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Lafole%2FLogo-02.png?alt=media&token=a877d4d0-4c4e-43f4-bb92-b9cce99580ef";

interface AdminDashboardProps {
  onBackToHome: () => void;
  onNavigateToCourse?: (courseId: string) => void;
  onNavigateToStudentDashboard?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  adminSession?: AdminAuthSession | null;
  onSignOutAdmin?: () => void;
  courses?: Course[];
  onCoursesChange?: (updatedCourses: Course[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToHome,
  onNavigateToCourse,
  onNavigateToStudentDashboard,
  isDarkMode = false,
  onToggleDarkMode,
  adminSession,
  onSignOutAdmin,
  courses: externalCourses,
  onCoursesChange
}) => {
  const [payments, setPayments] = useState<PaymentTableRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentTableRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState<'payments' | 'orders' | 'courses' | 'students' | 'users' | 'settings'>('payments');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [list, admins] = await Promise.all([
        getAdminPayments().catch(() => []),
        getAdminUsersFromFirestore().catch(() => [])
      ]);
      setPayments(list);
      setAdminUsersList(admins);
    } catch (err) {
      console.warn("Could not load dashboard data:", err);
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyRef = (ref: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(ref);
      setCopiedRef(ref);
      setTimeout(() => setCopiedRef(null), 2000);
    }
  };

  const handleApprove = async (paymentId: string) => {
    try {
      const res = await approveAdminPayment(paymentId, adminSession?.name || 'Administrator');
      if (res.success) {
        showToast(res.message);
        // Refresh local list state
        setPayments(prev =>
          prev.map(p =>
            p.id === paymentId
              ? { ...p, status: 'approved', verified_at: new Date().toISOString() }
              : p
          )
        );
        if (selectedPayment && selectedPayment.id === paymentId) {
          setSelectedPayment(prev => prev ? { ...prev, status: 'approved', verified_at: new Date().toISOString() } : null);
        }
      }
    } catch (err: any) {
      showToast('Error approving payment: ' + (err?.message || 'Please retry.'));
    }
  };

  const handleReject = async (paymentId: string, reason?: string) => {
    try {
      const res = await rejectAdminPayment(paymentId, adminSession?.name || 'Administrator', reason);
      if (res.success) {
        showToast('Payment marked as rejected');
        setPayments(prev =>
          prev.map(p =>
            p.id === paymentId
              ? { ...p, status: 'rejected', verified_at: new Date().toISOString() }
              : p
          )
        );
        if (selectedPayment && selectedPayment.id === paymentId) {
          setSelectedPayment(prev => prev ? { ...prev, status: 'rejected', verified_at: new Date().toISOString() } : null);
        }
      }
    } catch (err: any) {
      showToast('Error rejecting payment: ' + (err?.message || 'Please retry.'));
    }
  };

  // Real Data Stat Calculations directly from Firestore database
  const stats = useMemo(() => {
    const pendingCount = payments.filter(p => p.status === 'pending').length;
    const approvedCount = payments.filter(p => p.status === 'approved' || p.status === 'paid').length;
    const rejectedCount = payments.filter(p => p.status === 'rejected').length;

    const totalPaidAmount = payments
      .filter(p => p.status === 'approved' || p.status === 'paid')
      .reduce((sum, p) => {
        const amt = typeof p.amount === 'number' ? p.amount : parseFloat(String(p.amount).replace(/[^0-9.]/g, '')) || 0;
        return sum + amt;
      }, 0);

    return {
      total: `$${totalPaidAmount.toLocaleString()}`,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount
    };
  }, [payments]);

  // Derived orders from payments
  const ordersList = useMemo(() => {
    return payments.map(p => ({
      id: p.order_id || `ord_${p.id}`,
      student_name: p.student_name,
      student_email: p.student_email,
      course_title: p.course_title,
      amount: typeof p.amount === 'number' ? p.amount : parseFloat(String(p.amount)) || 0,
      currency: p.currency || 'USD',
      method: p.payment_method,
      reference: p.transaction_reference,
      status: p.status === 'approved' || p.status === 'paid' ? 'completed' : p.status === 'rejected' ? 'rejected' : 'awaiting_verification',
      created_at: p.submitted_at,
      payment: p
    }));
  }, [payments]);

  // Courses catalog state with CRUD synchronization
  const [coursesList, setCoursesList] = useState<Course[]>(() => {
    return (externalCourses && externalCourses.length > 0) ? externalCourses : getAll93Courses();
  });

  useEffect(() => {
    if (externalCourses && externalCourses.length > 0) {
      setCoursesList(externalCourses);
    }
  }, [externalCourses]);

  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [courseCategoryFilter, setCourseCategoryFilter] = useState('all');
  const [courseLevelFilter, setCourseLevelFilter] = useState('all');
  const [courseSearch, setCourseSearch] = useState('');
  const [visibleCourseCount, setVisibleCourseCount] = useState(24);

  const handleOpenAddCourse = () => {
    setCourseToEdit(null);
    setIsCourseFormOpen(true);
  };

  const handleOpenEditCourse = (course: Course, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCourseToEdit(course);
    setIsCourseFormOpen(true);
  };

  const handleOpenDeleteCourse = (course: Course, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCourse = async (courseData: Partial<Course>) => {
    const res = await saveCourseToFirestore(courseData);
    if (res.success && res.course) {
      const savedCourse = res.course;
      const isExisting = coursesList.some(c => c.id === savedCourse.id);
      let updated: Course[];
      if (isExisting) {
        updated = coursesList.map(c => c.id === savedCourse.id ? savedCourse : c);
      } else {
        updated = [savedCourse, ...coursesList];
      }
      setCoursesList(updated);
      onCoursesChange?.(updated);
      showToast(isExisting ? `Course "${savedCourse.title}" updated successfully.` : `Course "${savedCourse.title}" created successfully.`);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    const res = await deleteCourseFromFirestore(courseId);
    if (res.success) {
      const updated = coursesList.filter(c => c.id !== courseId);
      setCoursesList(updated);
      onCoursesChange?.(updated);
      showToast('Course successfully deleted from catalog and front end.');
    }
  };

  // Super Admin Privilege Check (Single Super Admin control)
  const isSuperAdmin = useMemo(() => {
    if (!adminSession) return false;
    return (
      adminSession.role === 'superadmin' ||
      adminSession.email?.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase()
    );
  }, [adminSession]);

  // Admin Users state & management
  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>([]);
  const [isAdminUsersLoading, setIsAdminUsersLoading] = useState(false);
  const [adminUserSearch, setAdminUserSearch] = useState('');
  const [adminUserRoleFilter, setAdminUserRoleFilter] = useState<'all' | 'superadmin' | 'admin'>('all');
  const [adminUserStatusFilter, setAdminUserStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [revealedPasswordEmail, setRevealedPasswordEmail] = useState<string | null>(null);

  const [isAdminUserModalOpen, setIsAdminUserModalOpen] = useState(false);
  const [adminUserToEdit, setAdminUserToEdit] = useState<AdminUser | null>(null);
  const [isDeleteAdminUserModalOpen, setIsDeleteAdminUserModalOpen] = useState(false);
  const [adminUserToDelete, setAdminUserToDelete] = useState<AdminUser | null>(null);

  const loadAdminUsers = async () => {
    setIsAdminUsersLoading(true);
    try {
      const list = await getAdminUsersFromFirestore();
      setAdminUsersList(list);
    } catch (err) {
      console.warn("Could not load admin users:", err);
    } finally {
      setIsAdminUsersLoading(false);
    }
  };

  const handleOpenAddAdminUser = () => {
    if (!isSuperAdmin) {
      showToast(`Access Restricted: Only Super Admin (${DEFAULT_SUPER_ADMIN_EMAIL}) can add dashboard users.`);
      return;
    }
    setAdminUserToEdit(null);
    setIsAdminUserModalOpen(true);
  };

  const handleOpenEditAdminUser = (user: AdminUser, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isSuperAdmin) {
      showToast(`Access Restricted: Only Super Admin (${DEFAULT_SUPER_ADMIN_EMAIL}) can edit dashboard users.`);
      return;
    }
    setAdminUserToEdit(user);
    setIsAdminUserModalOpen(true);
  };

  const handleOpenDeleteAdminUser = (user: AdminUser, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isSuperAdmin) {
      showToast(`Access Restricted: Only Super Admin (${DEFAULT_SUPER_ADMIN_EMAIL}) can revoke dashboard users.`);
      return;
    }
    if (user.email.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase()) {
      showToast('The primary root Super Admin account cannot be revoked.');
      return;
    }
    setAdminUserToDelete(user);
    setIsDeleteAdminUserModalOpen(true);
  };

  const handleToggleAdminUserStatus = async (user: AdminUser, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isSuperAdmin) {
      showToast('Only the Super Admin can toggle user account status.');
      return;
    }
    if (user.email.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase()) {
      showToast('Cannot suspend the primary root Super Admin.');
      return;
    }
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await saveAdminUserToFirestore(
        { ...user, status: newStatus },
        adminSession?.email || 'Super Admin'
      );
      if (res.success) {
        setAdminUsersList(prev => prev.map(u => u.email.toLowerCase() === user.email.toLowerCase() ? res.user : u));
        showToast(`User ${user.name} is now ${newStatus === 'active' ? 'Active' : 'Suspended'}.`);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update user status.');
    }
  };

  const handleSaveAdminUser = async (userData: Partial<AdminUser>) => {
    const res = await saveAdminUserToFirestore(userData, adminSession?.email || 'Super Admin');
    if (res.success) {
      const isExisting = adminUsersList.some(u => u.email.toLowerCase() === res.user.email.toLowerCase());
      let updated: AdminUser[];
      if (isExisting) {
        updated = adminUsersList.map(u => u.email.toLowerCase() === res.user.email.toLowerCase() ? res.user : u);
      } else {
        updated = [res.user, ...adminUsersList];
      }
      setAdminUsersList(updated);
      showToast(res.message);
    }
  };

  const handleDeleteAdminUser = async (email: string) => {
    const res = await deleteAdminUserFromFirestore(email, adminSession?.email || 'Super Admin');
    if (res.success) {
      setAdminUsersList(prev => prev.filter(u => u.email.toLowerCase() !== email.toLowerCase()));
      showToast(res.message);
    } else {
      showToast(res.message);
    }
  };

  const filteredAdminUsers = useMemo(() => {
    return adminUsersList.filter(u => {
      if (adminUserRoleFilter !== 'all' && u.role !== adminUserRoleFilter) return false;
      if (adminUserStatusFilter !== 'all' && u.status !== adminUserStatusFilter) return false;
      if (!adminUserSearch.trim()) return true;
      const q = adminUserSearch.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.department && u.department.toLowerCase().includes(q))
      );
    });
  }, [adminUsersList, adminUserRoleFilter, adminUserStatusFilter, adminUserSearch]);

  const adminUserStats = useMemo(() => {
    const total = adminUsersList.length;
    const superAdmins = adminUsersList.filter(u => u.role === 'superadmin').length;
    const active = adminUsersList.filter(u => u.status === 'active').length;
    const suspended = adminUsersList.filter(u => u.status === 'suspended').length;
    return { total, superAdmins, active, suspended };
  }, [adminUsersList]);

  // Derived unique students
  const studentsList = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      email: string;
      phone: string;
      courses: string[];
      totalSpent: number;
      status: 'active' | 'pending';
    }>();

    payments.forEach(p => {
      const email = p.student_email.toLowerCase();
      const existing = map.get(email);
      const amt = typeof p.amount === 'number' ? p.amount : parseFloat(String(p.amount)) || 0;
      if (existing) {
        if (!existing.courses.includes(p.course_title)) existing.courses.push(p.course_title);
        if (p.status === 'approved' || p.status === 'paid') {
          existing.totalSpent += amt;
          existing.status = 'active';
        }
      } else {
        map.set(email, {
          id: email,
          name: p.student_name,
          email: p.student_email,
          phone: p.sender_phone,
          courses: [p.course_title],
          totalSpent: p.status === 'approved' || p.status === 'paid' ? amt : 0,
          status: p.status === 'approved' || p.status === 'paid' ? 'active' : 'pending'
        });
      }
    });

    return Array.from(map.values());
  }, [payments]);

  // Filtered payments list
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      if (statusFilter !== 'all') {
        if (statusFilter === 'approved' && p.status !== 'approved' && p.status !== 'paid') return false;
        if (statusFilter === 'pending' && p.status !== 'pending') return false;
        if (statusFilter === 'rejected' && p.status !== 'rejected') return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.student_name.toLowerCase().includes(q) ||
          p.student_email.toLowerCase().includes(q) ||
          p.course_title.toLowerCase().includes(q) ||
          p.transaction_reference.toLowerCase().includes(q) ||
          p.sender_phone.toLowerCase().includes(q) ||
          p.payment_method.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [payments, statusFilter, searchQuery]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return ordersList.filter(o => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.student_name.toLowerCase().includes(q) ||
        o.student_email.toLowerCase().includes(q) ||
        o.course_title.toLowerCase().includes(q) ||
        o.reference.toLowerCase().includes(q)
      );
    });
  }, [ordersList, searchQuery]);

  // Unique categories list
  const courseCategories = useMemo(() => {
    const set = new Set<string>();
    coursesList.forEach(c => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [coursesList]);

  // Filtered courses list
  const filteredCourses = useMemo(() => {
    const activeSearch = (courseSearch || searchQuery).trim().toLowerCase();
    return coursesList.filter(c => {
      if (courseCategoryFilter !== 'all' && c.category !== courseCategoryFilter) {
        return false;
      }
      if (courseLevelFilter !== 'all' && c.level !== courseLevelFilter) {
        return false;
      }
      if (!activeSearch) return true;
      return (
        c.title.toLowerCase().includes(activeSearch) ||
        (c.category && c.category.toLowerCase().includes(activeSearch)) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(activeSearch)) ||
        (c.instructor?.name && c.instructor.name.toLowerCase().includes(activeSearch)) ||
        (c.tags && c.tags.some(t => t.toLowerCase().includes(activeSearch)))
      );
    });
  }, [coursesList, courseCategoryFilter, courseLevelFilter, courseSearch, searchQuery]);

  // Derived course statistics
  const courseStats = useMemo(() => {
    const total = coursesList.length;
    const categoriesCount = courseCategories.length;
    const totalLessons = coursesList.reduce((acc, c) => acc + (c.totalLessonsCount || 0), 0);
    const avgPrice = total > 0 ? Math.round(coursesList.reduce((acc, c) => acc + (c.price || 0), 0) / total) : 0;
    return { total, categoriesCount, totalLessons, avgPrice };
  }, [coursesList, courseCategories]);

  // Filtered students list
  const filteredStudents = useMemo(() => {
    return studentsList.filter(s => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.courses.some(c => c.toLowerCase().includes(q))
      );
    });
  }, [studentsList, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-geist">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs sm:text-sm font-medium animate-fadeIn border border-slate-700 dark:border-slate-300">
          <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar with Lafole Academy Logo */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center">
            <button
              onClick={onBackToHome}
              className="flex items-center cursor-pointer group"
              title="Lafole Academy - Return to Home"
            >
              <img
                src={LOGO_URL}
                alt="Lafole Academy"
                referrerPolicy="no-referrer"
                className="h-8 sm:h-9 w-auto max-w-[170px] object-contain dark:brightness-0 dark:invert transition-transform group-hover:scale-105"
              />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={onBackToHome}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Student Portal</span>
          </button>

          {onNavigateToStudentDashboard && (
            <button
              onClick={onNavigateToStudentDashboard}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
            >
              <span>My Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-2xs"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-[57px] bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <p className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Operations
              </p>
              <nav className="space-y-1">
                {/* Payments */}
                <button
                  onClick={() => {
                    setActiveSidebarItem('payments');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeSidebarItem === 'payments'
                      ? 'bg-[#22C55E]/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className={`w-4 h-4 ${activeSidebarItem === 'payments' ? 'text-[#22C55E]' : ''}`} />
                    <span>Payments</span>
                  </div>
                  {stats.pending > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400">
                      {stats.pending}
                    </span>
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      {payments.length}
                    </span>
                  )}
                </button>

                {/* Orders */}
                <button
                  onClick={() => {
                    setActiveSidebarItem('orders');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeSidebarItem === 'orders'
                      ? 'bg-[#22C55E]/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className={`w-4 h-4 ${activeSidebarItem === 'orders' ? 'text-[#22C55E]' : ''}`} />
                    <span>Orders</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    {ordersList.length}
                  </span>
                </button>

                {/* Courses */}
                <button
                  onClick={() => {
                    setActiveSidebarItem('courses');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeSidebarItem === 'courses'
                      ? 'bg-[#22C55E]/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <GraduationCap className={`w-4 h-4 ${activeSidebarItem === 'courses' ? 'text-[#22C55E]' : ''}`} />
                    <span>Courses</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    {coursesList.length}
                  </span>
                </button>

                {/* Students */}
                <button
                  onClick={() => {
                    setActiveSidebarItem('students');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeSidebarItem === 'students'
                      ? 'bg-[#22C55E]/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Users className={`w-4 h-4 ${activeSidebarItem === 'students' ? 'text-[#22C55E]' : ''}`} />
                    <span>Students</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    {studentsList.length}
                  </span>
                </button>

                {/* Users (Admin Team) */}
                <button
                  onClick={() => {
                    setActiveSidebarItem('users');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeSidebarItem === 'users'
                      ? 'bg-[#22C55E]/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <UserCog className={`w-4 h-4 ${activeSidebarItem === 'users' ? 'text-[#22C55E]' : ''}`} />
                    <span>Users</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    {adminUsersList.length}
                  </span>
                </button>

                {/* Settings */}
                <button
                  onClick={() => {
                    setActiveSidebarItem('settings');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeSidebarItem === 'settings'
                      ? 'bg-[#22C55E]/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Settings className={`w-4 h-4 ${activeSidebarItem === 'settings' ? 'text-[#22C55E]' : ''}`} />
                    <span>Settings</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Admin User Card at Sidebar Bottom */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                {(adminSession?.name || 'Admin').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {adminSession?.name || 'Administrator'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {adminSession?.email || 'admin@lafole.so'}
                </p>
              </div>
            </div>

            {onSignOutAdmin && (
              <button
                type="button"
                onClick={onSignOutAdmin}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Admin</span>
              </button>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {activeSidebarItem === 'payments' && 'Payments Dashboard'}
                {activeSidebarItem === 'orders' && 'Orders Management'}
                {activeSidebarItem === 'courses' && 'Courses & Curriculum'}
                {activeSidebarItem === 'students' && 'Students Directory'}
                {activeSidebarItem === 'users' && 'Admin Users & Team Access'}
                {activeSidebarItem === 'settings' && 'Administration Settings'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {activeSidebarItem === 'payments' && 'Review, approve, and manage student course payment transactions'}
                {activeSidebarItem === 'orders' && 'Registry of student course enrollments, invoices, and fulfillment records'}
                {activeSidebarItem === 'courses' && 'Lafole Academy technical curriculum, diploma tracks, and lecture modules'}
                {activeSidebarItem === 'students' && 'Verified student directory and course access entitlements'}
                {activeSidebarItem === 'users' && 'Manage administrator dashboard credentials, role privileges, and team access'}
                {activeSidebarItem === 'settings' && 'Academy payment gateway setups, merchant numbers, and security controls'}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {activeSidebarItem === 'users' && isSuperAdmin && (
                <button
                  onClick={handleOpenAddAdminUser}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:shadow-emerald-500/25 hover:scale-[1.02] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Admin User</span>
                </button>
              )}
              <button
                onClick={loadData}
                disabled={isLoading}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>

          {/* TAB 1: PAYMENTS */}
          {activeSidebarItem === 'payments' && (
            <div className="space-y-6">
              {/* Cards requested in brief:
                  TOTAL PAYMENTS: $12,450
                  PENDING: 23
                  APPROVED: 341
                  REJECTED: 7
              */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                {/* TOTAL PAYMENTS */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                      TOTAL PAYMENTS
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                    {stats.total}
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Verified mobile receipts
                  </p>
                </div>

                {/* PENDING */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-2xs space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between text-amber-700 dark:text-amber-400">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                      PENDING
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-800 dark:text-amber-300 font-mono tracking-tight">
                    {stats.pending}
                  </div>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    Awaiting admin review
                  </p>
                </div>

                {/* APPROVED */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-2xs space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                      APPROVED
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 font-mono tracking-tight">
                    {stats.approved}
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Active enrollments
                  </p>
                </div>

                {/* REJECTED */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-2xs space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between text-rose-700 dark:text-rose-400">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                      REJECTED
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 flex items-center justify-center">
                      <XCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 dark:text-rose-300 font-mono tracking-tight">
                    {stats.rejected}
                  </div>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                    Declined transactions
                  </p>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by student name, course, reference code, phone number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => {
                    const isActive = statusFilter === filter;
                    return (
                      <button
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer capitalize ${
                          isActive
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payments Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-855/60 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                        <th className="py-3.5 px-4 sm:px-6 w-12">#</th>
                        <th className="py-3.5 px-4 sm:px-6">Student Name</th>
                        <th className="py-3.5 px-4 sm:px-6">Course</th>
                        <th className="py-3.5 px-4 sm:px-6">Amount</th>
                        <th className="py-3.5 px-4 sm:px-6">Method</th>
                        <th className="py-3.5 px-4 sm:px-6">Reference</th>
                        <th className="py-3.5 px-4 sm:px-6">Status</th>
                        <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {filteredPayments.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-16 text-center text-slate-400 dark:text-slate-500">
                            <div className="max-w-md mx-auto space-y-2.5 px-4">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                                <CreditCard className="w-6 h-6" />
                              </div>
                              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                {searchQuery || statusFilter !== 'all' ? 'No matching payment records' : 'No payment records found'}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {searchQuery || statusFilter !== 'all'
                                  ? 'Try adjusting your search query or status filter.'
                                  : 'Real student payment submissions made via EVC Plus, eDahab, or ZAAD at checkout will appear here for verification.'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredPayments.map((item, index) => {
                          const isPending = item.status === 'pending';
                          const isApproved = item.status === 'approved' || item.status === 'paid';
                          const isRejected = item.status === 'rejected';

                          return (
                            <tr
                              key={item.id}
                              className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors group cursor-pointer"
                              onClick={() => {
                                setSelectedPayment(item);
                                setIsDetailModalOpen(true);
                              }}
                            >
                              {/* Number */}
                              <td className="py-4 px-4 sm:px-6 text-slate-400 font-mono text-xs">
                                {index + 1}.
                              </td>

                              {/* Student Name */}
                              <td className="py-4 px-4 sm:px-6">
                                <div className="flex items-center space-x-2.5">
                                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
                                    {item.student_name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white truncate">
                                      {item.student_name}
                                    </p>
                                    <p className="text-[11px] text-slate-400 truncate">
                                      {item.student_email}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Course */}
                              <td className="py-4 px-4 sm:px-6 text-slate-700 dark:text-slate-300">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {item.course_title}
                                </span>
                              </td>

                              {/* Amount */}
                              <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900 dark:text-white">
                                ${item.amount.toFixed(0)}
                              </td>

                              {/* Method */}
                              <td className="py-4 px-4 sm:px-6">
                                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span>{item.payment_method}</span>
                                </span>
                              </td>

                              {/* Reference */}
                              <td className="py-4 px-4 sm:px-6">
                                <div className="flex items-center space-x-1.5">
                                  <span className="font-mono font-bold tracking-wider text-slate-900 dark:text-white">
                                    {item.transaction_reference}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleCopyRef(item.transaction_reference, e)}
                                    title="Copy reference"
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                  >
                                    {copiedRef === item.transaction_reference ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </td>

                              {/* Status */}
                              <td className="py-4 px-4 sm:px-6">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                  isApproved
                                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                    : isRejected
                                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                                    : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                }`}>
                                  {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending'}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-4 sm:px-6 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  {/* Primary Action Button requested: "View Payment" */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPayment(item);
                                      setIsDetailModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center space-x-1"
                                  >
                                    <span>View Payment</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeSidebarItem === 'orders' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-slate-400">Total Orders</span>
                  <div className="text-2xl font-black font-mono">{ordersList.length}</div>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-emerald-600">Completed Orders</span>
                  <div className="text-2xl font-black font-mono text-emerald-600">
                    {ordersList.filter(o => o.status === 'completed').length}
                  </div>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-amber-600">Awaiting Verification</span>
                  <div className="text-2xl font-black font-mono text-amber-600">
                    {ordersList.filter(o => o.status === 'awaiting_verification').length}
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 text-slate-500 uppercase text-[11px] tracking-wider font-semibold">
                        <th className="py-3.5 px-4 sm:px-6">Order ID</th>
                        <th className="py-3.5 px-4 sm:px-6">Student</th>
                        <th className="py-3.5 px-4 sm:px-6">Course</th>
                        <th className="py-3.5 px-4 sm:px-6">Total</th>
                        <th className="py-3.5 px-4 sm:px-6">Status</th>
                        <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            No student orders recorded yet.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(ord => (
                          <tr key={ord.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40">
                            <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900 dark:text-white">
                              {ord.id}
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <div className="font-bold text-slate-900 dark:text-white">{ord.student_name}</div>
                              <div className="text-[11px] text-slate-400">{ord.student_email}</div>
                            </td>
                            <td className="py-4 px-4 sm:px-6">{ord.course_title}</td>
                            <td className="py-4 px-4 sm:px-6 font-mono font-bold">${ord.amount}</td>
                            <td className="py-4 px-4 sm:px-6">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                ord.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                  : ord.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                              }`}>
                                {ord.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 sm:px-6 text-right">
                              <button
                                onClick={() => {
                                  setSelectedPayment(ord.payment);
                                  setIsDetailModalOpen(true);
                                }}
                                className="text-xs font-semibold text-[#22C55E] hover:underline cursor-pointer"
                              >
                                View Payment
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COURSES (FULL CRUD MANAGEMENT) */}
          {activeSidebarItem === 'courses' && (
            <div className="space-y-6">
              {/* Header & Add Course Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Course Catalog & Curriculum Manager
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Manage {coursesList.length} academy courses with live real-time synchronization across the student frontend catalog, cart, and dashboard.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleOpenAddCourse}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:shadow-emerald-500/25 hover:scale-[1.02] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Course</span>
                  </button>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Total Courses</span>
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">{courseStats.total}</div>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-emerald-600 tracking-wider">Active Subjects</span>
                  <div className="text-2xl font-black font-mono text-emerald-600">{courseStats.categoriesCount}</div>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-blue-600 tracking-wider">Total Lessons</span>
                  <div className="text-2xl font-black font-mono text-blue-600">{courseStats.totalLessons}</div>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-purple-600 tracking-wider">Avg Course Price</span>
                  <div className="text-2xl font-black font-mono text-purple-600">${courseStats.avgPrice}</div>
                </div>
              </div>

              {/* Search & Filters Toolbar */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search courses by title, subject, instructor name, or tag..."
                      value={courseSearch}
                      onChange={(e) => {
                        setCourseSearch(e.target.value);
                        setVisibleCourseCount(24);
                      }}
                      className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    />
                    {courseSearch && (
                      <button
                        onClick={() => setCourseSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="w-full md:w-56">
                    <select
                      value={courseCategoryFilter}
                      onChange={(e) => {
                        setCourseCategoryFilter(e.target.value);
                        setVisibleCourseCount(24);
                      }}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="all">All Subjects ({coursesList.length})</option>
                      {courseCategories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat} ({coursesList.filter(c => c.category === cat).length})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Level Filter */}
                  <div className="w-full md:w-44">
                    <select
                      value={courseLevelFilter}
                      onChange={(e) => {
                        setCourseLevelFilter(e.target.value);
                        setVisibleCourseCount(24);
                      }}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="all">All Difficulty Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Clear Filters Button if any active */}
                  {(courseSearch || courseCategoryFilter !== 'all' || courseLevelFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setCourseSearch('');
                        setCourseCategoryFilter('all');
                        setCourseLevelFilter('all');
                      }}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span>
                    Showing <strong className="text-slate-900 dark:text-white">{Math.min(filteredCourses.length, visibleCourseCount)}</strong> of <strong className="text-slate-900 dark:text-white">{filteredCourses.length}</strong> filtered courses ({coursesList.length} total)
                  </span>
                </div>
              </div>

              {/* Courses Grid */}
              {filteredCourses.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">No courses found</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      No courses match your current search query or filter criteria.
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-3 pt-2">
                    <button
                      onClick={() => {
                        setCourseSearch('');
                        setCourseCategoryFilter('all');
                        setCourseLevelFilter('all');
                      }}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Clear Search & Filters
                    </button>
                    <button
                      onClick={handleOpenAddCourse}
                      className="px-4 py-2 rounded-xl bg-[#22C55E] text-white text-xs font-bold hover:bg-[#16A34A] transition-colors cursor-pointer"
                    >
                      + Add New Course
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCourses.slice(0, visibleCourseCount).map(c => (
                    <div 
                      key={c.id} 
                      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col overflow-hidden"
                    >
                      {/* Thumbnail & Overlays */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={c.thumbnail || 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc'}
                          alt={c.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc';
                          }}
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 flex-wrap gap-1">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white uppercase tracking-wider shadow-xs">
                            {c.category}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wider shadow-xs">
                            {c.level}
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-xs text-white font-mono font-bold text-xs flex items-center space-x-1.5 shadow-sm">
                          <span className="text-emerald-400">${c.price}</span>
                          {c.originalPrice && c.originalPrice > c.price && (
                            <span className="text-[10px] line-through text-slate-400 font-normal">
                              ${c.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {c.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {c.description || c.subtitle}
                          </p>
                        </div>

                        {/* Metadata & Actions */}
                        <div className="space-y-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="truncate max-w-[140px] font-medium text-slate-700 dark:text-slate-300">
                              👤 {c.instructor?.name || 'Abdifatah Jama'}
                            </span>
                            <div className="flex items-center space-x-2 text-[11px] font-mono">
                              <span>⏱️ {c.estimatedHours || 12}h</span>
                              <span>•</span>
                              <span>📚 {c.totalLessonsCount || 20} lessons</span>
                            </div>
                          </div>

                          {/* Full CRUD Actions Toolbar */}
                          <div className="grid grid-cols-3 gap-2 pt-1">
                            <button
                              onClick={(e) => handleOpenEditCourse(c, e)}
                              className="flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer border border-transparent hover:border-emerald-500/30"
                              title="Edit Course Details & Metadata"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={(e) => handleOpenDeleteCourse(c, e)}
                              className="flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer border border-transparent hover:border-rose-500/30"
                              title="Delete Course from Catalog"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>

                            {onNavigateToCourse && (
                              <button
                                onClick={() => onNavigateToCourse(c.id)}
                                className="flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-semibold text-xs transition-colors cursor-pointer border border-emerald-500/20"
                                title="Preview Course on Front End"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Preview</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {filteredCourses.length > visibleCourseCount && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => setVisibleCourseCount(prev => prev + 24)}
                    className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                  >
                    Load More Courses ({filteredCourses.length - visibleCourseCount} remaining)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: STUDENTS */}
          {activeSidebarItem === 'students' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-slate-400">Total Enrolled Students</span>
                  <div className="text-2xl font-black font-mono">{studentsList.length}</div>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-emerald-600">Active Students</span>
                  <div className="text-2xl font-black font-mono text-emerald-600">
                    {studentsList.filter(s => s.status === 'active').length}
                  </div>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-amber-600">Pending Review</span>
                  <div className="text-2xl font-black font-mono text-amber-600">
                    {studentsList.filter(s => s.status === 'pending').length}
                  </div>
                </div>
              </div>

              {/* Students Directory Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 text-slate-500 uppercase text-[11px] tracking-wider font-semibold">
                        <th className="py-3.5 px-4 sm:px-6">Student Name</th>
                        <th className="py-3.5 px-4 sm:px-6">Email Address</th>
                        <th className="py-3.5 px-4 sm:px-6">Phone Number</th>
                        <th className="py-3.5 px-4 sm:px-6">Courses</th>
                        <th className="py-3.5 px-4 sm:px-6">Total Paid</th>
                        <th className="py-3.5 px-4 sm:px-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            No student enrollments registered yet.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map(st => (
                          <tr key={st.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40">
                            <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">
                              {st.name}
                            </td>
                            <td className="py-4 px-4 sm:px-6 text-slate-500">{st.email}</td>
                            <td className="py-4 px-4 sm:px-6 font-mono">{st.phone || '—'}</td>
                            <td className="py-4 px-4 sm:px-6">
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {st.courses.join(', ')}
                              </span>
                            </td>
                            <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900 dark:text-white">
                              ${st.totalSpent}
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                st.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                              }`}>
                                {st.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: USERS (ADMIN ACCESS CONTROL & TEAM MANAGEMENT) */}
          {activeSidebarItem === 'users' && (
            <div className="space-y-6">
              {/* Top Action Bar */}
              {isSuperAdmin && (
                <div className="flex items-center justify-end">
                  <button
                    onClick={handleOpenAddAdminUser}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:shadow-emerald-500/25 hover:scale-[1.02] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Admin User</span>
                  </button>
                </div>
              )}

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Total Administrators</span>
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">{adminUserStats.total}</div>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-purple-600 tracking-wider">Super Admins</span>
                  <div className="text-2xl font-black font-mono text-purple-600">{adminUserStats.superAdmins}</div>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-emerald-600 tracking-wider">Active Accounts</span>
                  <div className="text-2xl font-black font-mono text-emerald-600">{adminUserStats.active}</div>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-amber-600 tracking-wider">Suspended</span>
                  <div className="text-2xl font-black font-mono text-amber-600">{adminUserStats.suspended}</div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search administrator by name, email, or department..."
                      value={adminUserSearch}
                      onChange={(e) => setAdminUserSearch(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    />
                    {adminUserSearch && (
                      <button
                        onClick={() => setAdminUserSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="w-full sm:w-44">
                    <select
                      value={adminUserRoleFilter}
                      onChange={(e) => setAdminUserRoleFilter(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="all">All Roles</option>
                      <option value="superadmin">Super Admin</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div className="w-full sm:w-44">
                    <select
                      value={adminUserStatusFilter}
                      onChange={(e) => setAdminUserStatusFilter(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active Only</option>
                      <option value="suspended">Suspended Only</option>
                    </select>
                  </div>

                  {(adminUserSearch || adminUserRoleFilter !== 'all' || adminUserStatusFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setAdminUserSearch('');
                        setAdminUserRoleFilter('all');
                        setAdminUserStatusFilter('all');
                      }}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span>
                    Showing <strong className="text-slate-900 dark:text-white">{filteredAdminUsers.length}</strong> of <strong className="text-slate-900 dark:text-white">{adminUsersList.length}</strong> administrator accounts
                  </span>
                </div>
              </div>

              {/* Admin Users Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 text-slate-500 uppercase text-[11px] tracking-wider font-semibold">
                        <th className="py-3.5 px-4 sm:px-6">Administrator</th>
                        <th className="py-3.5 px-4 sm:px-6">Role Clearance</th>
                        <th className="py-3.5 px-4 sm:px-6">Department</th>
                        <th className="py-3.5 px-4 sm:px-6">Access Passcode</th>
                        <th className="py-3.5 px-4 sm:px-6">Status</th>
                        <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {filteredAdminUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            No administrator accounts found matching filters.
                          </td>
                        </tr>
                      ) : (
                        filteredAdminUsers.map(user => {
                          const isPrimarySuper = user.email.toLowerCase() === DEFAULT_SUPER_ADMIN_EMAIL.toLowerCase();
                          const isShowingPassword = revealedPasswordEmail === user.email.toLowerCase();

                          return (
                            <tr key={user.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                              {/* Administrator Name & Email */}
                              <td className="py-4 px-4 sm:px-6">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                                    user.role === 'superadmin'
                                      ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                      : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  }`}>
                                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD'}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                                      <span>{user.name}</span>
                                      {isPrimarySuper && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                                          Super Admin
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono">{user.email}</div>
                                  </div>
                                </div>
                              </td>

                              {/* Role Clearance */}
                              <td className="py-4 px-4 sm:px-6">
                                <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  user.role === 'superadmin'
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                }`}>
                                  {user.role === 'superadmin' ? <Crown className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                                  <span>{user.role === 'superadmin' ? 'Super Admin' : 'Administrator'}</span>
                                </span>
                              </td>

                              {/* Department */}
                              <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-300 text-xs">
                                {user.department || 'General Administration'}
                              </td>

                              {/* Passcode / Password */}
                              <td className="py-4 px-4 sm:px-6">
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                    {isShowingPassword ? (user.password || 'admin2026') : '••••••••'}
                                  </span>
                                  {isSuperAdmin && (
                                    <button
                                      onClick={() => setRevealedPasswordEmail(isShowingPassword ? null : user.email.toLowerCase())}
                                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer"
                                      title={isShowingPassword ? "Hide passcode" : "Reveal passcode"}
                                    >
                                      {isShowingPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                  )}
                                </div>
                              </td>

                              {/* Status */}
                              <td className="py-4 px-4 sm:px-6">
                                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  user.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                  <span className="capitalize">{user.status}</span>
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-4 sm:px-6 text-right">
                                {isSuperAdmin ? (
                                  <div className="flex items-center justify-end space-x-1.5">
                                    {/* Toggle Active / Suspended */}
                                    {!isPrimarySuper && (
                                      <button
                                        onClick={(e) => handleToggleAdminUserStatus(user, e)}
                                        className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                                          user.status === 'active'
                                            ? 'text-amber-600 border-amber-200 dark:border-amber-900/60 hover:bg-amber-50 dark:hover:bg-amber-950/50'
                                            : 'text-emerald-600 border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                                        }`}
                                        title={user.status === 'active' ? 'Suspend account access' : 'Activate account access'}
                                      >
                                        {user.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                                      </button>
                                    )}

                                    {/* Edit User */}
                                    <button
                                      onClick={(e) => handleOpenEditAdminUser(user, e)}
                                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 transition-colors cursor-pointer"
                                      title="Edit administrator details"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Delete User */}
                                    {!isPrimarySuper && (
                                      <button
                                        onClick={(e) => handleOpenDeleteAdminUser(user, e)}
                                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                                        title="Revoke administrator access"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400 font-normal italic">
                                    Read-only
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeSidebarItem === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Mobile Money Merchant Accounts</h3>
                    <p className="text-xs text-slate-500">Official merchant numbers displayed to students at checkout</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">EVC Plus (Hormuud)</span>
                    <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">*712*615000000*AMOUNT#</div>
                    <div className="text-[11px] text-slate-400">Somalia National</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">eDahab (Dahabshiil)</span>
                    <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">*789*625000000*AMOUNT#</div>
                    <div className="text-[11px] text-slate-400">Regional Gateway</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">ZAAD (Telesom)</span>
                    <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">*222*635000000*AMOUNT#</div>
                    <div className="text-[11px] text-slate-400">Somaliland Gateway</div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Administrator Session</h3>
                    <p className="text-xs text-slate-500">Security credentials & administrative authority</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">Administrator Name:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{adminSession?.name || 'Administrator'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">Administrator Email:</span>
                    <span className="font-mono text-slate-900 dark:text-white">{adminSession?.email || 'admin@lafole.so'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">Role / Clearance:</span>
                    <span className="font-bold text-emerald-600 uppercase">{adminSession?.role || 'admin'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">Session Status:</span>
                    <span className="text-emerald-600 font-bold flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Authenticated & Verified</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Payment Detail Modal */}
      <PaymentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        payment={selectedPayment}
        onApprove={handleApprove}
        onReject={handleReject}
        onNavigateToCourse={onNavigateToCourse}
      />

      {/* Course Form Modal (Create & Edit) */}
      <CourseFormModal
        isOpen={isCourseFormOpen}
        onClose={() => {
          setIsCourseFormOpen(false);
          setCourseToEdit(null);
        }}
        onSave={handleSaveCourse}
        initialCourse={courseToEdit}
      />

      {/* Course Deletion Confirmation Modal */}
      <DeleteCourseModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCourseToDelete(null);
        }}
        course={courseToDelete}
        onConfirmDelete={handleDeleteCourse}
      />

      {/* Admin User Form Modal (Create & Edit) */}
      <AdminUserFormModal
        isOpen={isAdminUserModalOpen}
        onClose={() => {
          setIsAdminUserModalOpen(false);
          setAdminUserToEdit(null);
        }}
        onSave={handleSaveAdminUser}
        initialUser={adminUserToEdit}
        isSuperAdmin={isSuperAdmin}
        currentAdminEmail={adminSession?.email}
      />

      {/* Delete Admin User Modal */}
      <DeleteAdminUserModal
        isOpen={isDeleteAdminUserModalOpen}
        onClose={() => {
          setIsDeleteAdminUserModalOpen(false);
          setAdminUserToDelete(null);
        }}
        user={adminUserToDelete}
        onConfirmDelete={handleDeleteAdminUser}
      />
    </div>
  );
};
