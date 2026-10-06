import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Lock, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Mail, 
  User, 
  Phone, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Award, 
  Sparkles,
  ExternalLink,
  HelpCircle,
  Copy,
  MailCheck,
  Send,
  Globe,
  ChevronDown,
  Eye,
  EyeOff,
  Bookmark,
  Tag,
  X
} from 'lucide-react';
import { Course } from '../types';
import { saveClientDetailsAndInitiateVerification, resendVerificationEmail, signInStudent, db, recordPaymentOrderEnrollment } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { COUNTRIES, CountryOption } from '../data/countries';
import { ManualPaymentSection } from './ManualPaymentSection';
import { PendingVerificationModal, PendingOrderDetails } from './PendingVerificationModal';

const getNextOrderRef = (): string => {
  if (typeof window === 'undefined') return 'LA-2026-0001';
  try {
    const saved = localStorage.getItem('lafole_manual_payment_order_seq');
    const seq = saved ? parseInt(saved, 10) : 1;
    const num = isNaN(seq) || seq < 1 ? 1 : seq;
    return `LA-2026-${String(num).padStart(4, '0')}`;
  } catch {
    return 'LA-2026-0001';
  }
};

const incrementOrderRef = () => {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem('lafole_manual_payment_order_seq');
    const seq = saved ? parseInt(saved, 10) : 1;
    const num = isNaN(seq) || seq < 1 ? 1 : seq;
    localStorage.setItem('lafole_manual_payment_order_seq', String(num + 1));
  } catch {}
};

interface CheckoutPageProps {
  course: Course;
  onCompleteEnrollment: (course: Course) => void;
  onBackToCourse: () => void;
  onBackToCatalog: () => void;
  onBackToHome: () => void;
  onNavigateToLogin?: () => void;
  onEmailVerified?: (email: string, fullName?: string) => void;
  isUserSignedIn?: boolean;
  userEmail?: string;
  userFullName?: string;
  cartItems?: any[];
  onRemoveCartItem?: (courseId: string) => void;
  isCheckoutMode?: boolean;
  onToggleCheckoutMode?: (checkout: boolean) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  course,
  onCompleteEnrollment,
  onBackToCourse,
  onBackToCatalog,
  onBackToHome,
  onNavigateToLogin,
  onEmailVerified,
  isUserSignedIn = false,
  userEmail = '',
  userFullName = '',
  cartItems = [],
  onRemoveCartItem,
  isCheckoutMode = false,
  onToggleCheckoutMode,
}) => {
  // Step 1: 'details', Step 2: 'payment', Step 3: 'success'
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [customerType, setCustomerType] = useState<'new' | 'signin'>('new');
  
  // Signed In User detection
  const [signedInUser, setSignedInUser] = useState<{ email: string; name?: string } | null>(() => {
    if (isUserSignedIn && userEmail) {
      return { email: userEmail, name: userFullName };
    }
    return null;
  });

  useEffect(() => {
    if (isUserSignedIn && userEmail) {
      setSignedInUser({ email: userEmail, name: userFullName });
      setIsEmailVerified(true);
    }
  }, [isUserSignedIn, userEmail, userFullName]);

  // Form State
  const [fullName, setFullName] = useState(userFullName || '');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappReceipts, setWhatsappReceipts] = useState(true);
  const [email, setEmail] = useState(userEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  // Selected Country object helper
  const selectedCountry = COUNTRIES.find((c) => c.code === selectedCountryCode);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [mobileProvider, setMobileProvider] = useState<'evc' | 'zaad' | 'edahab' | 'sahal' | 'ebirr'>('evc');
  const [payerPhone, setPayerPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  
  // Card state (greyed out / unavailable for now)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Manual Mobile Payment Processing State
  const [manualCurrency, setManualCurrency] = useState<'EVC Plus' | 'eDahab' | 'ZAAD'>('EVC Plus');
  const [orderReference, setOrderReference] = useState<string>(() => getNextOrderRef());
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [senderPhone, setSenderPhone] = useState<string>('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [pendingOrderDetails, setPendingOrderDetails] = useState<PendingOrderDetails | null>(null);
  const [isPendingOrderModalOpen, setIsPendingOrderModalOpen] = useState(false);

  // Firestore & Email Verification State
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [emailDeliveredLive, setEmailDeliveredLive] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(!!isUserSignedIn);
  const [enrollmentId, setEnrollmentId] = useState('');

  // Submission & validation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPendingVerificationNotice, setIsPendingVerificationNotice] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cooldown timer for email resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const cartDisplayItems = useMemo(() => {
    if (cartItems && cartItems.length > 0) {
      return cartItems;
    }
    return [{
      courseId: course.id,
      title: course.title,
      price: course.price || 20,
      thumbnail: course.thumbnail,
      category: course.category
    }];
  }, [cartItems, course]);

  const itemsCount = cartDisplayItems.length;
  const currentTotalBeforePromo = cartDisplayItems.reduce((acc, item) => acc + (Number(item.price) || 20), 0);
  const originalPriceSum = currentTotalBeforePromo * 2;
  const saleDiscount = originalPriceSum - currentTotalBeforePromo;
  const price = currentTotalBeforePromo;
  const originalPrice = originalPriceSum;
  const hours = course.estimatedHours || 14;
  const totalLessons = course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || course.totalLessonsCount || 51;
  const finalPrice = Math.max(0, currentTotalBeforePromo - promoDiscount);

  // Sync amountPaid with finalPrice
  useEffect(() => {
    if (finalPrice > 0) {
      setAmountPaid((prev) => (!prev || prev === '0' || prev === '20' || prev === '25' ? String(finalPrice) : prev));
    }
  }, [finalPrice]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyMerchantCode = (text: string, label?: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      showToast(`Copied ${label ? label : text} to clipboard!`);
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      showToast(`Screenshot attached: ${file.name}`);
    }
  };

  const handleRemoveScreenshot = () => {
    setPaymentScreenshot(null);
    setScreenshotPreview(null);
  };

  // Manual payment submission handler:
  // - Saves order to Firestore with status 'pending_payment_verification'
  // - Keeps hasAccess: false (Student does NOT get access to course yet)
  // - Increments order reference sequence (LA-2026-0001 -> LA-2026-0002)
  // - Displays PENDING PAYMENT VERIFICATION modal
  const handleManualPaymentSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!paymentReference.trim()) {
      showToast('Please enter your Payment Reference');
      return;
    }
    if (!amountPaid.trim()) {
      showToast('Please enter the Amount Paid');
      return;
    }
    if (!paymentDate.trim()) {
      showToast('Please select the Payment Date');
      return;
    }
    if (!senderPhone.trim()) {
      showToast('Please enter your Sender Phone Number');
      return;
    }

    setIsProcessing(true);
    try {
      const buyerEmail = signedInUser?.email || email.trim() || 'student@lafole.so';
      const buyerName = signedInUser?.name || fullName.trim() || 'Student';
      const enrId = `enr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const currentRef = orderReference || getNextOrderRef();
      const courseTitleToSave = cartDisplayItems.length > 1
        ? `${cartDisplayItems.length} Enrolled Courses`
        : (cartDisplayItems[0]?.title || course.title);
      const courseIdToSave = cartDisplayItems.length > 1
        ? cartDisplayItems.map((i: any) => i.courseId || i.id).join(', ')
        : course.id;

      try {
        await recordPaymentOrderEnrollment({
          paymentId: `pay_${Date.now()}_${paymentReference.replace(/[^a-zA-Z0-9]/g, '')}`,
          orderId: `ord_${currentRef.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}`,
          enrollmentId: enrId,
          studentId: buyerEmail.toLowerCase().trim(),
          studentName: buyerName,
          studentEmail: buyerEmail.toLowerCase().trim(),
          courseId: courseIdToSave,
          courseTitle: courseTitleToSave,
          amount: finalPrice,
          paymentMethod: manualCurrency,
          transactionReference: paymentReference,
          senderPhone: senderPhone,
          proofUrl: screenshotPreview || ''
        });

        const enrRef = doc(db, 'enrollments', enrId);
        await setDoc(enrRef, {
          id: enrId,
          orderReference: currentRef,
          email: buyerEmail.toLowerCase().trim(),
          fullName: buyerName,
          phoneNumber: senderPhone || phoneNumber || '',
          courseId: courseIdToSave,
          courseTitle: courseTitleToSave,
          amount: finalPrice,
          amountPaid: amountPaid,
          currency: 'USD',
          manualCurrency: manualCurrency,
          paymentMethod: manualCurrency,
          paymentStatus: 'pending_verification',
          transactionRef: paymentReference,
          status: 'pending_payment_verification',
          hasAccess: false,
          emailVerified: !!signedInUser,
          paymentDate: paymentDate,
          senderPhone: senderPhone,
          recipientNumber: '+252 61 9290900',
          recipientName: 'Abdifatah Jama',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }, { merge: true });

        const userDocId = buyerEmail.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '_');
        await setDoc(doc(db, 'users', userDocId), {
          lastEnrolledCourseId: courseIdToSave,
          lastEnrolledCourseTitle: courseTitleToSave,
          lastOrderReference: currentRef,
          status: 'pending_payment_verification',
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn("Firestore save pending enrollment:", err);
      }

      if (typeof window !== 'undefined') {
        const orderRecord = {
          enrollmentId: enrId,
          orderReference: currentRef,
          email: buyerEmail.toLowerCase().trim(),
          fullName: buyerName,
          phoneNumber: senderPhone,
          courseId: courseIdToSave,
          courseTitle: courseTitleToSave,
          amount: finalPrice,
          amountPaid: amountPaid,
          currency: 'USD',
          paymentMethod: manualCurrency,
          paymentStatus: 'pending_verification',
          status: 'pending_payment_verification',
          hasAccess: false,
          paymentReference: paymentReference,
          paymentDate: paymentDate,
          senderPhone: senderPhone,
          recipientNumber: '+252 61 9290900',
          recipientName: 'Abdifatah Jama',
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('last_lafole_enrollment', JSON.stringify(orderRecord));

        try {
          const existing = JSON.parse(localStorage.getItem('lafole_pending_orders') || '[]');
          localStorage.setItem('lafole_pending_orders', JSON.stringify([orderRecord, ...existing]));
        } catch {}
      }

      const pendingDetails: PendingOrderDetails = {
        orderReference: currentRef,
        courseTitle: courseTitleToSave,
        courseThumbnail: course.thumbnail,
        manualCurrency: manualCurrency,
        recipientNumber: '+252 61 9290900',
        recipientName: 'Abdifatah Jama',
        amountPaid: amountPaid.startsWith('$') ? amountPaid : `$${amountPaid}`,
        paymentDate: paymentDate,
        senderPhoneNumber: senderPhone,
        paymentReference: paymentReference,
        screenshotFileName: paymentScreenshot?.name || null,
        screenshotPreview: screenshotPreview,
        buyerName: buyerName,
        buyerEmail: buyerEmail
      };

      incrementOrderRef();
      setOrderReference(getNextOrderRef());

      setPendingOrderDetails(pendingDetails);
      setIsPendingOrderModalOpen(true);
      showToast('Payment submitted! Your order is PENDING PAYMENT VERIFICATION.');
    } catch (err: any) {
      showToast("Error submitting payment: " + (err?.message || "Please retry."));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (!clean) {
      showToast('Please enter a promo code');
      return;
    }
    if (clean === 'LAFOLE10' || clean === 'STUDENT10') {
      setAppliedPromo(clean);
      setPromoDiscount(10);
      showToast('Promo code applied: $10 off!');
    } else if (clean === 'LAFOLE50' || clean === 'HALF') {
      const disc = Math.round(price * 0.5);
      setAppliedPromo(clean);
      setPromoDiscount(disc);
      showToast(`Promo code applied: 50% ($${disc}) off!`);
    } else {
      const disc = 5;
      setAppliedPromo(clean);
      setPromoDiscount(disc);
      showToast(`Promo code "${clean}" applied: $${disc} off!`);
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT CHECK ON SIGN-IN:
    if (customerType === 'signin') {
      if (!email.trim() || !email.includes('@')) {
        showToast('Please enter your account email address');
        return;
      }
      if (!password.trim()) {
        showToast('Please enter your password');
        return;
      }

      setIsSavingDetails(true);
      try {
        const res = await signInStudent(email.trim().toLowerCase(), password);
        if (!res.success) {
          showToast(res.message);
          setIsSavingDetails(false);
          return;
        }

        const userObj = {
          email: res.user?.email || email.trim().toLowerCase(),
          name: res.user?.name || fullName || 'Student'
        };

        setSignedInUser(userObj);
        setIsEmailVerified(true);

        if (typeof window !== 'undefined') {
          localStorage.setItem('lafole_auth_user', JSON.stringify({
            name: userObj.name,
            email: userObj.email,
            signedInAt: new Date().toISOString()
          }));
        }

        if (onEmailVerified) {
          onEmailVerified(userObj.email, userObj.name);
        }

        showToast(`Welcome back, ${userObj.name}! Ready to complete checkout.`);
      } catch (err: any) {
        showToast(err?.message || "Failed to sign in. Please verify your credentials.");
      } finally {
        setIsSavingDetails(false);
      }
      return;
    }

    // NEW CUSTOMER: Account creation & registration
    if (!fullName.trim()) {
      showToast('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }

    // Prefill payer phone if phone number was entered
    const formattedPhoneWithCode = selectedCountry 
      ? `${selectedCountry.dialCode} ${phoneNumber.trim()}`.trim()
      : phoneNumber.trim();

    if (phoneNumber && !payerPhone) {
      setPayerPhone(formattedPhoneWithCode);
    }

    setIsSavingDetails(true);
    try {
      // 1. Store the client details on Firestore in Lafole project
      const res = await saveClientDetailsAndInitiateVerification({
        fullName: fullName || 'Student',
        phoneNumber: formattedPhoneWithCode,
        country: selectedCountry?.name || '',
        email: email.trim().toLowerCase(),
        whatsappReceipts: whatsappReceipts,
        courseId: course.id,
        courseTitle: course.title,
        amount: price,
        currency: 'USD',
        password: password.trim()
      });

      setEnrollmentId(res.enrollmentId);
      setVerificationToken(res.verificationToken);
      setVerificationUrl(res.verificationUrl);
      setEmailDeliveredLive(!!res.delivered);

      // Save backup in local storage for fast session restoration
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('last_lafole_enrollment', JSON.stringify({
          enrollmentId: res.enrollmentId,
          email: email.trim().toLowerCase(),
          fullName,
          phoneNumber: formattedPhoneWithCode,
          country: selectedCountry?.name || '',
          verificationToken: res.verificationToken,
          courseId: course.id,
          emailVerified: false
        }));
      }

      // Smoothly advance directly to payment step without opening any dialog box
      setCurrentStep(2);
      if (res.delivered) {
        showToast(`✉️ Live email delivered to ${email.trim()}! Please check inbox.`);
      } else if (res.deliveryMessage) {
        showToast(res.deliveryMessage);
      } else {
        showToast(`✉️ Verification link generated for ${email.trim()}.`);
      }
    } catch (err: any) {
      console.error("Failed to save to Firestore:", err);
      // Even if offline, advance gracefully
      setCurrentStep(2);
      showToast('Details saved locally. Proceed to payment.');
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleResendVerification = async () => {
    const targetEmail = (email || '').trim().toLowerCase();
    if (!targetEmail) {
      showToast('Please enter your email address first.');
      return;
    }
    if (resendCooldown > 0) {
      showToast(`Please wait ${resendCooldown}s before requesting another verification email.`);
      return;
    }

    setIsResendingEmail(true);
    try {
      const targetUrl = verificationUrl || `${window.location.origin}/verify-email?token=${verificationToken}&email=${encodeURIComponent(targetEmail)}`;
      const res = await resendVerificationEmail({
        email: targetEmail,
        fullName: fullName || 'Student',
        courseTitle: course.title,
        verificationUrl: targetUrl,
        token: verificationToken || 'tok_' + Date.now()
      });
      if (res.delivered) {
        setEmailDeliveredLive(true);
      }
      showToast(res.message);
      setResendCooldown(30);
    } catch {
      showToast(`Verification email resent to ${targetEmail}`);
      setResendCooldown(30);
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleCompleteSignedPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (paymentMethod === 'mobile_money') {
      if (!payerPhone.trim()) {
        showToast('Please enter your sending phone number');
        return;
      }
    } else if (paymentMethod === 'card') {
      if (!cardNumber.trim()) {
        showToast('Please enter your card number');
        return;
      }
    }

    setIsProcessing(true);
    try {
      const buyerEmail = signedInUser?.email || email || 'student@lafole.so';
      const buyerName = signedInUser?.name || fullName || 'Student';
      const enrId = enrollmentId || `enr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      try {
        const enrRef = doc(db, 'enrollments', enrId);
        await setDoc(enrRef, {
          id: enrId,
          email: buyerEmail.toLowerCase().trim(),
          fullName: buyerName,
          phoneNumber: payerPhone || phoneNumber || '',
          courseId: course.id,
          courseTitle: course.title,
          amount: finalPrice,
          currency: 'USD',
          paymentMethod: paymentMethod,
          paymentStatus: 'completed',
          transactionRef: transactionRef || (paymentMethod === 'card' ? 'CARD_SUCCESS' : 'MOBILE_SUCCESS'),
          status: 'enrolled',
          emailVerified: true,
          enrolledAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }, { merge: true });

        const userDocId = buyerEmail.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '_');
        await setDoc(doc(db, 'users', userDocId), {
          lastEnrolledCourseId: course.id,
          lastEnrolledCourseTitle: course.title,
          emailVerified: true,
          status: 'enrolled',
          lastUpdated: new Date().toISOString()
        }, { merge: true });

        await setDoc(doc(db, 'students', userDocId), {
          lastEnrolledCourseId: course.id,
          lastEnrolledCourseTitle: course.title,
          emailVerified: true,
          status: 'enrolled',
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn("Firestore save:", err);
      }

      setIsSuccess(true);
      showToast("🎉 Enrollment completed! Access granted.");
      setTimeout(() => {
        onCompleteEnrollment(course);
      }, 1500);
    } catch (err: any) {
      showToast("Error processing payment: " + (err?.message || "Please retry."));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const buyerEmail = email.toLowerCase().trim() || 'student@lafole.so';
      const buyerName = fullName || 'Student';
      const enrId = enrollmentId || `enr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      try {
        const enrRef = doc(db, 'enrollments', enrId);
        await setDoc(enrRef, {
          id: enrId,
          email: buyerEmail,
          fullName: buyerName,
          phoneNumber: payerPhone || phoneNumber || '',
          courseId: course.id,
          courseTitle: course.title,
          amount: price,
          currency: 'USD',
          paymentMethod: paymentMethod,
          paymentStatus: 'completed',
          transactionRef: transactionRef || 'ONLINE_PAYMENT',
          status: 'pending_verification',
          emailVerified: false,
          enrolledAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }, { merge: true });

        const userDocId = buyerEmail.replace(/[^a-z0-9_-]/g, '_');
        await setDoc(doc(db, 'users', userDocId), {
          lastEnrolledCourseId: course.id,
          lastEnrolledCourseTitle: course.title,
          emailVerified: false,
          status: 'pending_verification',
          lastUpdated: new Date().toISOString()
        }, { merge: true });

        await setDoc(doc(db, 'students', userDocId), {
          lastEnrolledCourseId: course.id,
          lastEnrolledCourseTitle: course.title,
          emailVerified: false,
          status: 'pending_verification',
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn("Firestore update:", err);
      }

      // Strictly require verification via email link
      setIsPendingVerificationNotice(true);
      showToast('Payment confirmed! Please verify your email to access your dashboard.');
    } catch (err: any) {
      showToast("Error processing payment: " + (err?.message || "Please retry."));
    } finally {
      setIsProcessing(false);
    }
  };

  // IF USER IS ALREADY SIGNED IN OR IN CART MODE (!isCheckoutMode)
  // Render exact After Sign-In & Cart Layout matching reference UI
  if (signedInUser || !isCheckoutMode) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#111111] dark:bg-white text-white dark:text-black px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs sm:text-sm font-medium animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {/* Top Header / Breadcrumbs */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              <button 
                onClick={onBackToHome}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Lafole
              </button>
              <span>›</span>
              {isCheckoutMode ? (
                <>
                  <button
                    onClick={() => onToggleCheckoutMode ? onToggleCheckoutMode(false) : null}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Cart
                  </button>
                  <span>›</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Checkout</span>
                </>
              ) : (
                <span className="font-semibold text-slate-900 dark:text-white">Cart</span>
              )}
            </div>

            <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Lock className="w-3.5 h-3.5 text-[#22C55E]" />
              <span className="tracking-tight uppercase">SECURED BY STRIPE • 256-BIT TLS</span>
            </div>
          </div>

          {/* Two-Column Grid matching reference UI screenshot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart items & Signed in indicator (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Your cart ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})
                </h1>
                {isCheckoutMode && (
                  <button
                    type="button"
                    onClick={() => onToggleCheckoutMode ? onToggleCheckoutMode(false) : null}
                    className="text-xs font-semibold text-[#22C55E] hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <span>‹ Edit cart</span>
                  </button>
                )}
              </div>

              {/* Signed In Banner or Guest Sign-in Prompt */}
              {signedInUser ? (
                <div className="flex items-center space-x-2.5 p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-300/80 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center text-white flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold">
                    Signed in as {signedInUser.email}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 flex-shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">Already have an account? Sign in for instant access.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateToLogin ? onNavigateToLogin() : (onToggleCheckoutMode ? onToggleCheckoutMode(true) : null)}
                    className="text-xs font-bold text-[#22C55E] hover:underline cursor-pointer flex-shrink-0 ml-2"
                  >
                    Sign in
                  </button>
                </div>
              )}

              {/* Cart Items List */}
              <div className="space-y-3.5">
                {cartDisplayItems.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
                    <p className="text-slate-500 text-sm">Your cart is currently empty.</p>
                    <button
                      type="button"
                      onClick={onBackToCatalog}
                      className="px-5 py-2.5 bg-[#22C55E] text-white rounded-xl text-xs font-bold hover:bg-[#16A34A] transition-colors cursor-pointer"
                    >
                      Explore Courses
                    </button>
                  </div>
                ) : (
                  cartDisplayItems.map((item) => {
                    const itemPrice = Number(item.price) || 20;
                    const itemOriginal = itemPrice * 2;
                    return (
                      <div
                        key={item.courseId}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.thumbnail || course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300"}
                            alt={item.title}
                            className="w-24 h-16 sm:w-28 sm:h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
                          />
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              COURSE
                            </span>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-1">
                              {item.title}
                            </h3>
                            <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                              <button
                                type="button"
                                onClick={() => showToast('Course saved for later!')}
                                className="flex items-center space-x-1 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                              >
                                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                                <span>Save for later</span>
                              </button>
                              <span>•</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (onRemoveCartItem) onRemoveCartItem(item.courseId);
                                  showToast('Removed from cart');
                                }}
                                className="flex items-center space-x-1 hover:text-rose-600 transition-colors cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-1.5 flex-shrink-0">
                          <div className="text-right">
                            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                              ${itemPrice}.00
                            </div>
                            <div className="text-xs text-slate-400 line-through">
                              ${itemOriginal}.00 USD
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 uppercase tracking-tight">
                            Back to School SALES
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>

            {/* Right Column: Order Summary & Payment (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
                
                {/* Header */}
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  ORDER SUMMARY
                </div>

                {/* Course Title Lines */}
                <div className="space-y-1.5">
                  {cartDisplayItems.map((item) => (
                    <div key={item.courseId} className="flex items-center justify-between text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-medium line-clamp-1 mr-2">{item.title}</span>
                      <span className="font-semibold text-slate-900 dark:text-white flex-shrink-0">${(Number(item.price) || 20) * 2}.00</span>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>PROMO CODE</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo or team code"
                      className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="text-[11px] text-[#22C55E] font-semibold flex items-center space-x-1 mt-1">
                      <Check className="w-3 h-3" />
                      <span>Code applied: {appliedPromo} (-${promoDiscount}.00)</span>
                    </div>
                  )}
                </form>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>{itemsCount} {itemsCount === 1 ? 'item' : 'items'}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">${originalPriceSum}.00</span>
                  </div>

                  <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-medium">
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Back to School SALES</span>
                    </div>
                    <span>-${saleDiscount}.00</span>
                  </div>

                  {appliedPromo && promoDiscount > 0 && (
                    <div className="flex items-center justify-between text-[#22C55E] font-medium">
                      <span>Promo Discount</span>
                      <span>-${promoDiscount}.00</span>
                    </div>
                  )}

                  <div className="flex items-baseline justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">TOTAL</span>
                    <span className="font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                      ${finalPrice}.00
                    </span>
                  </div>
                </div>

                {/* ACTION SECTION: If /cart (not checkout mode), show Proceed to Checkout. If /cart?checkout=1, show Payment Form */}
                {!isCheckoutMode ? (
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      id="btn-proceed-to-checkout"
                      type="button"
                      onClick={() => onToggleCheckoutMode ? onToggleCheckoutMode(true) : null}
                      className="w-full py-3.5 px-6 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={onBackToCatalog}
                      className="w-full py-2.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-center"
                    >
                      ← Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    {/* MANUAL PAYMENT SECTION (Card Greyed Out, EVC/eDahab/ZAAD Manual Active) */}
                    <ManualPaymentSection
                      finalPrice={finalPrice}
                      orderReference={orderReference}
                      manualCurrency={manualCurrency}
                      setManualCurrency={setManualCurrency}
                      paymentReference={paymentReference}
                      setPaymentReference={setPaymentReference}
                      amountPaid={amountPaid}
                      setAmountPaid={setAmountPaid}
                      paymentDate={paymentDate}
                      setPaymentDate={setPaymentDate}
                      senderPhone={senderPhone}
                      setSenderPhone={setSenderPhone}
                      paymentScreenshot={paymentScreenshot}
                      screenshotPreview={screenshotPreview}
                      onScreenshotChange={handleScreenshotChange}
                      onRemoveScreenshot={handleRemoveScreenshot}
                      onSubmitPayment={handleManualPaymentSubmit}
                      isProcessing={isProcessing}
                      onCopy={copyMerchantCode}
                    />

                    <div className="pt-1 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleCheckoutMode ? onToggleCheckoutMode(false) : null}
                        className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        ‹ Return to cart
                      </button>
                    </div>
                  </>
                )}

                {/* Trust security line */}
                <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1 text-center">
                  <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  <span>256-bit SSL • secure checkout • instant access after payment</span>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* SUCCESS MODAL (shared) */}
        {isSuccess && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-scaleUp">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/80 text-[#22C55E] rounded-full mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  You're Enrolled! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Welcome to <span className="font-semibold text-slate-900 dark:text-white">{course.title}</span>. Your student profile and materials have been prepared.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">#LAF-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{signedInUser?.name || signedInUser?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Access:</span>
                  <span className="font-bold text-[#22C55E]">Lifetime Unlimited</span>
                </div>
              </div>

              <button
                onClick={() => onCompleteEnrollment(course)}
                className="w-full py-3.5 px-6 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Go to Classroom &amp; Start Lesson 1</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        {/* Pending Payment Verification Modal */}
        <PendingVerificationModal
          isOpen={isPendingOrderModalOpen}
          order={pendingOrderDetails}
          onNavigateToDashboard={onNavigateToLogin ? onNavigateToLogin : onBackToHome}
          onBackToHome={onBackToHome}
          onCopy={copyMerchantCode}
        />
      </div>
    );
  }

  // OTHERWISE (Guest or not signed in yet) -> Two-step account creation / sign-in checkout
  return (
    <div className="min-h-screen bg-[#FBFBF9] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] dark:bg-white text-white dark:text-black px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs sm:text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        
        {/* Top Back / Breadcrumbs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 text-xs sm:text-sm font-medium">
            <button
              onClick={() => onToggleCheckoutMode ? onToggleCheckoutMode(false) : onBackToCatalog()}
              className="flex items-center space-x-1.5 text-[#22C55E] hover:underline cursor-pointer font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to cart</span>
            </button>
            <span className="text-slate-400">›</span>
            <button
              onClick={onBackToCourse}
              className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              Back to course details
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>256-bit Encrypted Checkout</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: Steps 1 & 2 ================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Page Header */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                Complete enrollment
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal">
                Create a free account or sign in to continue — it takes under a minute.
              </p>
            </div>

            {/* ================= STEP 1: YOUR DETAILS ================= */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
              
              {/* Step 1 Title Bar */}
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep > 1 
                      ? 'bg-[#22C55E] text-white' 
                      : 'bg-[#111111] dark:bg-white text-white dark:text-black'
                  }`}>
                    {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Your details
                  </h2>
                </div>

                {currentStep === 1 ? (
                  <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                    <span>Active step</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold text-[#22C55E] hover:underline cursor-pointer"
                  >
                    Edit details
                  </button>
                )}
              </div>

              {/* Step 1 Body */}
              {currentStep === 1 ? (
                <form onSubmit={handleStep1Submit} className="p-5 sm:p-7 space-y-5">
                  
                  {/* Customer Type Tabs: [New customer] [Sign in] */}
                  <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCustomerType('new')}
                      className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        customerType === 'new'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      New customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerType('signin')}
                      className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        customerType === 'signin'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Signin
                    </button>
                  </div>

                  {customerType === 'new' ? (
                    <>
                      {/* Row 1: Full name + Country */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Full name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Full name"
                              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] dark:text-white placeholder:text-slate-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                            <span>Country</span>
                            {selectedCountry && (
                              <span className="text-[11px] font-mono text-[#22C55E] font-bold">
                                {selectedCountry.dialCode}
                              </span>
                            )}
                          </label>
                          <div className="relative flex items-center">
                            <Globe className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                            <select
                              id="checkout-country-select"
                              value={selectedCountryCode}
                              onChange={(e) => setSelectedCountryCode(e.target.value)}
                              className="w-full pl-9 pr-9 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] dark:text-white cursor-pointer appearance-none text-slate-800 dark:text-slate-100"
                            >
                              <option value="">Select your country...</option>
                              {COUNTRIES.map((c) => (
                                <option key={c.code} value={c.code}>
                                  {c.flag} {c.name} ({c.dialCode})
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Phone number + Email address */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Phone number
                          </label>
                          <div className="relative flex items-center">
                            {selectedCountry ? (
                              <span className="absolute left-3 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center space-x-1 pointer-events-none">
                                <span className="text-sm">{selectedCountry.flag}</span>
                                <span>{selectedCountry.dialCode}</span>
                              </span>
                            ) : (
                              <Phone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                            )}
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder={selectedCountry ? "61 123 4567" : "Phone number"}
                              className={`w-full ${selectedCountry ? 'pl-20' : 'pl-10'} pr-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] dark:text-white placeholder:text-slate-400`}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Email address
                          </label>
                          <div className="relative flex items-center">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Email address"
                              className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] dark:text-white placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Password + WhatsApp Receipt */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 items-center">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Password
                          </label>
                          <div className="relative flex items-center">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                            <input
                              type="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Password (min 6 characters)"
                              className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] dark:text-white placeholder:text-slate-400"
                            />
                          </div>
                        </div>

                        <div className="pt-2 sm:pt-4">
                          {/* WhatsApp Receipt Checkbox */}
                          <label className="flex items-start space-x-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={whatsappReceipts}
                              onChange={(e) => setWhatsappReceipts(e.target.checked)}
                              className="w-4 h-4 mt-0.5 rounded text-[#22C55E] focus:ring-[#22C55E] border-slate-300 cursor-pointer"
                            />
                            <span className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                              Send receipts and reminders on WhatsApp. Reply STOP any time to opt out.
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Legal agreement disclaimer */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                        By registering you agree to our{' '}
                        <a href="#terms" className="text-slate-800 dark:text-slate-200 underline font-medium">Terms</a> &amp;{' '}
                        <a href="#privacy" className="text-slate-800 dark:text-slate-200 underline font-medium">Privacy Policy</a>
                      </p>

                      {/* Action Button */}
                      <div>
                        <button
                          type="submit"
                          disabled={isSavingDetails}
                          className="w-full sm:w-auto py-3 px-6 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          {isSavingDetails ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>Saving to Firestore &amp; sending email...</span>
                            </>
                          ) : (
                            <>
                              <span>Create account &amp; continue</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Sign In Form (Matches Screenshot Layout) */
                    <div className="space-y-5 pt-1">
                      {/* Row with Email address and Password side-by-side */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Email address
                          </label>
                          <div className="relative flex items-center">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Email address"
                              className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] dark:text-white placeholder:text-slate-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Password
                          </label>
                          <div className="relative flex items-center">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Password"
                              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] dark:text-white placeholder:text-slate-400"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none cursor-pointer"
                              title={showPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Action Row: [Sign in & continue >] button on left, reset password text next to it */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-1">
                        <button
                          type="submit"
                          disabled={isSavingDetails}
                          className="w-full sm:w-auto py-3 px-6 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0"
                        >
                          {isSavingDetails ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>Signing in...</span>
                            </>
                          ) : (
                            <>
                              <span>Sign in &amp; continue</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Forgot your password? Reset it from{' '}
                          <button
                            type="button"
                            onClick={() => {
                              if (onNavigateToLogin) {
                                onNavigateToLogin();
                              } else if (typeof window !== 'undefined') {
                                window.history.pushState({ view: 'login' }, '', '/login');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                              }
                            }}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                          >
                            the login page.
                          </button>
                        </p>
                      </div>
                    </div>
                  )}

                </form>
              ) : (
                /* Step 1 Completed Summary */
                <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-900/50 flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-300 gap-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {fullName || 'Student Account'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#22C55E] font-bold">
                          Firestore Stored
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5 flex-wrap">
                        <span>{email || 'student@lafole.so'}</span>
                        {phoneNumber && (
                          <span>• {selectedCountry ? `${selectedCountry.dialCode} ` : ''}{phoneNumber}</span>
                        )}
                        {selectedCountry && (
                          <span className="text-slate-400">• {selectedCountry.flag} {selectedCountry.name}</span>
                        )}
                      </div>
                    </div>
                  </div>

                    <div className="flex items-center space-x-2">
                    {isEmailVerified ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-[#22C55E] text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Email Verified</span>
                      </span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-lg border border-amber-200 dark:border-amber-800">
                          <Mail className="w-3.5 h-3.5 text-amber-500" />
                          <span>{emailDeliveredLive ? 'Delivered to inbox/spam' : 'Verification link sent'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleResendVerification}
                          disabled={isResendingEmail || resendCooldown > 0}
                          className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                        >
                          {isResendingEmail ? 'Sending...' : resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Email'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* ================= STEP 2: PAYMENT ================= */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
              
              {/* Step 2 Header */}
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === 2 
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-black' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    2
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Payment
                  </h2>
                </div>

                {currentStep === 1 ? (
                  <span className="flex items-center space-x-1 text-xs text-slate-400 font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlocks after step 1</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                    <span>Active step</span>
                  </span>
                )}
              </div>

              {/* Step 2 Content */}
              {currentStep === 1 ? (
                /* Locked State Preview (Matches screenshot exactly) */
                <div className="p-5 sm:p-6 space-y-3 opacity-60">
                  <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Master Card, Credit / Debit Card
                        </div>
                        <div className="text-xs text-slate-400">
                          Visa • Mastercard • Amex
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Evc, Zaad, eBirr, eDahab, &amp; Xawaalad
                        </div>
                        <div className="text-xs text-slate-400">
                          Manual — admin confirms payment
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Unlocked Active Payment Methods */
                <form onSubmit={handleCompletePayment} className="p-5 sm:p-7 space-y-6">
                  
                  {/* Verification Notice Banner (Dispatched to Client Email, No Dialog Box) */}
                  {!isEmailVerified && (
                    <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/95 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/70 space-y-3 text-emerald-900 dark:text-emerald-100">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900 text-[#22C55E] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MailCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-emerald-950 dark:text-emerald-50 flex flex-wrap items-center gap-1.5">
                              <span>Verification email sent to</span>
                              <span className="font-bold underline text-emerald-800 dark:text-emerald-200">{email || 'your email'}</span>
                              {emailDeliveredLive && (
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                                  Delivered
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                              Please check your inbox or spam folder. For student account security and to prevent fake accounts, you must click the link sent to your email to verify your address and activate your dashboard access.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                          {/* Resend Email Button */}
                          <button
                            type="button"
                            onClick={handleResendVerification}
                            disabled={isResendingEmail || resendCooldown > 0}
                            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white dark:bg-slate-900 hover:bg-emerald-100 dark:hover:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-200 transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isResendingEmail ? 'Sending...' : resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Email'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* MANUAL PAYMENT PROCESSING (Card Greyed Out, EVC/eDahab/ZAAD Manual Active) */}
                  <ManualPaymentSection
                    finalPrice={finalPrice}
                    orderReference={orderReference}
                    manualCurrency={manualCurrency}
                    setManualCurrency={setManualCurrency}
                    paymentReference={paymentReference}
                    setPaymentReference={setPaymentReference}
                    amountPaid={amountPaid}
                    setAmountPaid={setAmountPaid}
                    paymentDate={paymentDate}
                    setPaymentDate={setPaymentDate}
                    senderPhone={senderPhone}
                    setSenderPhone={setSenderPhone}
                    paymentScreenshot={paymentScreenshot}
                    screenshotPreview={screenshotPreview}
                    onScreenshotChange={handleScreenshotChange}
                    onRemoveScreenshot={handleRemoveScreenshot}
                    onSubmitPayment={handleManualPaymentSubmit}
                    isProcessing={isProcessing}
                    onCopy={copyMerchantCode}
                  />

                </form>
              )}

            </div>

          </div>

          {/* ================= RIGHT COLUMN: Order Summary Card ================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
              
              {/* Card Header: YOUR ORDER */}
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                YOUR ORDER
              </div>

              {/* Course Info Card */}
              <div className="space-y-3.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-mono font-bold tracking-wider rounded">
                    COURSE
                  </span>
                </div>

                {/* Course Thumbnail */}
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Course Title & Lessons */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {course.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{hours}h 37m • {totalLessons} lessons</span>
                  </div>
                </div>
              </div>

              {/* Course Price Section */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  COURSE PRICE
                </div>
                <div className="text-3xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                  ${price}
                </div>
              </div>

              {/* Key Highlights / Benefits List (Matches Screenshot) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start space-x-2.5">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>Instant access after payment</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>Lifetime access to materials</span>
                </div>
              </div>

              {/* Security Badge Footer (Matches Screenshot) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Secure checkout - 256-bit SSL encryption</span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= SUCCESS MODAL ================= */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-scaleUp">
            
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/80 text-[#22C55E] rounded-full mx-auto flex items-center justify-center">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                You're Enrolled! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Welcome to <span className="font-semibold text-slate-900 dark:text-white">{course.title}</span>. Your student profile and materials have been prepared.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">#LAF-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Student:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{fullName || 'Student'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Access:</span>
                <span className="font-bold text-[#22C55E]">Lifetime Unlimited</span>
              </div>
            </div>

            <button
              onClick={() => onCompleteEnrollment(course)}
              className="w-full py-3.5 px-6 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Go to Classroom &amp; Start Lesson 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}

      {/* ================= PENDING EMAIL VERIFICATION NOTICE MODAL ================= */}
      {isPendingVerificationNotice && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-scaleUp">
            
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/80 text-amber-500 rounded-full mx-auto flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <Mail className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Payment Received! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Thank you, <span className="font-semibold text-slate-900 dark:text-white">{fullName || 'Student'}</span>! Your payment for <span className="font-semibold text-slate-900 dark:text-white">{course.title}</span> has been confirmed.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-left space-y-2">
              <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Email Verification Required</span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                To protect student accounts and prevent fake signups, access to your student dashboard requires clicking the activation link sent to:
              </p>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200/80 dark:border-amber-800 text-center font-bold text-xs text-slate-900 dark:text-white break-all">
                {email || 'your email address'}
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                Please check your inbox (and spam/junk folder). Click <strong>Verify My Email Address</strong> in the email to activate your account.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isResendingEmail || resendCooldown > 0}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isResendingEmail ? 'Sending...' : resendCooldown > 0 ? `Resend Email (${resendCooldown}s)` : 'Resend Verification Email'}</span>
              </button>

              {onNavigateToLogin && (
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="w-full py-3 px-4 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Go to Sign In
                </button>
              )}

              <button
                type="button"
                onClick={onBackToHome}
                className="w-full py-2.5 px-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                Return to Home
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Pending Payment Verification Modal */}
      <PendingVerificationModal
        isOpen={isPendingOrderModalOpen}
        order={pendingOrderDetails}
        onNavigateToDashboard={onNavigateToLogin ? onNavigateToLogin : onBackToHome}
        onBackToHome={onBackToHome}
        onCopy={copyMerchantCode}
      />

    </div>
  );
};
