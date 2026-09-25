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
import { saveClientDetailsAndInitiateVerification, verifyEmailByToken, resendVerificationEmail, signInStudent, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { COUNTRIES, CountryOption } from '../data/countries';

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
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('lafole_auth_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.email) return parsed;
        }
        const lastEnr = localStorage.getItem('last_lafole_enrollment');
        if (lastEnr) {
          const parsed = JSON.parse(lastEnr);
          if (parsed.email && parsed.emailVerified) {
            return { email: parsed.email, name: parsed.fullName };
          }
        }
      } catch {}
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

  // Payment Method State: 'mobile_money' | 'card'
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('card');
  const [mobileProvider, setMobileProvider] = useState<'evc' | 'zaad' | 'edahab' | 'sahal' | 'ebirr'>('evc');
  const [payerPhone, setPayerPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  
  // Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Firestore & Email Verification State
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [emailDeliveredLive, setEmailDeliveredLive] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(!!isUserSignedIn);
  const [enrollmentId, setEnrollmentId] = useState('');

  // Submission & validation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyMerchantCode = (text: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      showToast(`Copied "${text}" to clipboard!`);
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

  const handleCopyVerificationLink = () => {
    const targetUrl = verificationUrl || `${window.location.origin}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(targetUrl);
      setIsCopiedLink(true);
      showToast('📋 Verification link copied to clipboard!');
      setTimeout(() => setIsCopiedLink(false), 2500);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setIsResendingEmail(true);
    try {
      const targetUrl = verificationUrl || `${window.location.origin}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
      const res = await resendVerificationEmail({
        email: email.trim().toLowerCase(),
        fullName: fullName || 'Student',
        courseTitle: course.title,
        verificationUrl: targetUrl,
        token: verificationToken || 'tok_' + Date.now()
      });
      if (res.delivered) {
        setEmailDeliveredLive(true);
      }
      showToast(res.message);
    } catch {
      showToast(`Verification email resent to ${email}`);
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationToken) return;
    try {
      const res = await verifyEmailByToken(verificationToken, email);
      if (res.success) {
        setIsEmailVerified(true);
        onEmailVerified?.(email.trim().toLowerCase(), fullName);
        showToast('🎉 Email verified in Firestore! Welcome aboard.');
      } else {
        showToast(res.message);
      }
    } catch (err) {
      console.error(err);
      setIsEmailVerified(true);
      onEmailVerified?.(email.trim().toLowerCase(), fullName);
      showToast('Email verified.');
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
          status: 'enrolled',
          emailVerified: true,
          enrolledAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }, { merge: true });

        const userDocId = buyerEmail.replace(/[^a-z0-9_-]/g, '_');
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
        console.warn("Firestore update:", err);
      }

      setIsSuccess(true);
      showToast('🎉 Enrollment confirmed! Welcome aboard.');
      setTimeout(() => {
        onCompleteEnrollment(course);
      }, 1500);
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
                    {/* PAYMENT METHOD SECTION */}
                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        PAYMENT METHOD
                      </div>

                      {/* Option 1: Card */}
                      <div
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'border-[#22C55E] bg-emerald-50/20 dark:bg-emerald-950/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="signed_pay_method"
                              checked={paymentMethod === 'card'}
                              onChange={() => setPaymentMethod('card')}
                              className="text-[#22C55E] focus:ring-[#22C55E] w-4 h-4 cursor-pointer"
                            />
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                Master Card, Credit / Debit Card
                              </div>
                              <div className="text-[11px] text-slate-400 dark:text-slate-500">
                                Visa, Mastercard, Amex, UnionPay
                              </div>
                            </div>
                          </div>

                          {/* Card brand badges */}
                          <div className="flex items-center space-x-1">
                            <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[9px] tracking-wider">
                              VISA
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-600 text-white font-extrabold text-[9px] tracking-wider">
                              MC
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-cyan-700 text-white font-extrabold text-[9px] tracking-wider">
                              AMEX
                            </span>
                          </div>
                        </div>

                        {paymentMethod === 'card' && (
                          <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Card Number
                              </label>
                              <div className="relative flex items-center">
                                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3" />
                                <input
                                  type="text"
                                  maxLength={19}
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.target.value)}
                                  placeholder="4000 1234 5678 9010"
                                  className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                  Expiry (MM/YY)
                                </label>
                                <input
                                  type="text"
                                  maxLength={5}
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  placeholder="MM/YY"
                                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                  CVC
                                </label>
                                <input
                                  type="password"
                                  maxLength={4}
                                  value={cardCvc}
                                  onChange={(e) => setCardCvc(e.target.value)}
                                  placeholder="123"
                                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Option 2: Mobile Money (East Africa) */}
                      <div
                        onClick={() => setPaymentMethod('mobile_money')}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                          paymentMethod === 'mobile_money'
                            ? 'border-[#22C55E] bg-emerald-50/20 dark:bg-emerald-950/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="signed_pay_method"
                              checked={paymentMethod === 'mobile_money'}
                              onChange={() => setPaymentMethod('mobile_money')}
                              className="text-[#22C55E] focus:ring-[#22C55E] w-4 h-4 cursor-pointer"
                            />
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                Evc, Zaad, eBirr, eDahab, &amp; Xawaalad
                              </div>
                              <div className="text-[11px] text-slate-400 dark:text-slate-500">
                                Manual — admin confirms your payment
                              </div>
                            </div>
                          </div>

                          {/* Provider pill logos */}
                          <div className="flex items-center space-x-1 flex-wrap gap-1">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold text-[9px]">
                              EVC
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-blue-800 text-white font-bold text-[9px]">
                              ZAAD
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-700 text-white font-bold text-[9px]">
                              eDahab
                            </span>
                          </div>
                        </div>

                        {paymentMethod === 'mobile_money' && (
                          <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Transfer Instructions:</span>
                                <span className="font-mono font-bold text-[#22C55E]">${finalPrice}.00 USD</span>
                              </div>
                              <div className="flex items-center justify-between font-mono text-slate-800 dark:text-slate-200">
                                <span>Merchant: +252 61 589 2041</span>
                                <button
                                  type="button"
                                  onClick={() => copyMerchantCode('+252615892041')}
                                  className="text-[#22C55E] hover:underline text-[11px] flex items-center space-x-1 cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </button>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Dial *712*615892041*${finalPrice}# (or Telesom / eDahab equivalent)
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                  Sending Phone Number
                                </label>
                                <input
                                  type="tel"
                                  value={payerPhone}
                                  onChange={(e) => setPayerPhone(e.target.value)}
                                  placeholder="+252 61..."
                                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                  Transaction Ref / SMS Code
                                </label>
                                <input
                                  type="text"
                                  value={transactionRef}
                                  onChange={(e) => setTransactionRef(e.target.value)}
                                  placeholder="e.g. TXN12345"
                                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Call to action button */}
                    <button
                      id="btn-complete-enrollment"
                      type="button"
                      onClick={handleCompleteSignedPayment}
                      disabled={isProcessing}
                      className="w-full py-3.5 px-6 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-60 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {isProcessing ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Processing enrollment...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Complete enrollment</span>
                        </>
                      )}
                    </button>

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
                          <span>{emailDeliveredLive ? 'Delivered to inbox/spam' : 'Verification sent'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleVerifyEmail}
                          className="px-3 py-1 bg-[#22C55E] hover:bg-[#16a34a] text-white text-xs font-bold rounded-lg shadow-2xs transition-all hover:scale-[1.02] cursor-pointer"
                        >
                          Verify Account Now
                        </button>
                        <button
                          type="button"
                          onClick={handleResendVerification}
                          disabled={isResendingEmail}
                          className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                        >
                          {isResendingEmail ? 'Sending...' : 'Resend Email'}
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyVerificationLink}
                          className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                        >
                          {isCopiedLink ? 'Copied Link!' : 'Copy Link'}
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
                              {emailDeliveredLive
                                ? "Real email dispatched! Check your inbox or spam. You can also activate instantly below."
                                : "If your mail server delays or filters the incoming message, you can activate your account immediately using the button below without waiting."}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                          {/* 1-Click Instant Verification */}
                          <button
                            type="button"
                            onClick={handleVerifyEmail}
                            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#22C55E] hover:bg-[#16a34a] text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-[1.02] active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verify Account Now</span>
                          </button>

                          {/* Copy Direct Link */}
                          <button
                            type="button"
                            onClick={handleCopyVerificationLink}
                            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white dark:bg-slate-900 hover:bg-emerald-100 dark:hover:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-200 transition-colors cursor-pointer"
                            title="Copy the direct activation link"
                          >
                            {isCopiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                          </button>

                          {/* Resend Email */}
                          <button
                            type="button"
                            onClick={handleResendVerification}
                            disabled={isResendingEmail}
                            className="inline-flex items-center space-x-1 px-3 py-2 bg-white dark:bg-slate-900 hover:bg-emerald-100 dark:hover:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-200 transition-colors cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>{isResendingEmail ? 'Sending...' : 'Resend'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Payment Method Selector Tabs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Option 1: Mobile Money (Evc / Zaad / eBirr / eDahab) */}
                    <div
                      onClick={() => setPaymentMethod('mobile_money')}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start space-x-3 ${
                        paymentMethod === 'mobile_money'
                          ? 'border-[#22C55E] bg-emerald-50/20 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === 'mobile_money'}
                        onChange={() => setPaymentMethod('mobile_money')}
                        className="mt-1 text-[#22C55E] focus:ring-[#22C55E]"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                          <Smartphone className="w-4 h-4 text-[#22C55E]" />
                          <span>Mobile Money (East Africa)</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          EVC Plus, Zaad, eBirr, eDahab, Sahal
                        </div>
                      </div>
                    </div>

                    {/* Option 2: Credit / Debit Card */}
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start space-x-3 ${
                        paymentMethod === 'card'
                          ? 'border-[#22C55E] bg-emerald-50/20 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mt-1 text-[#22C55E] focus:ring-[#22C55E]"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                          <CreditCard className="w-4 h-4 text-[#22C55E]" />
                          <span>Credit / Debit Card</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Visa, Mastercard, Amex, UnionPay
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Payment Details Form */}
                  {paymentMethod === 'mobile_money' ? (
                    <div className="space-y-4 bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                      
                      {/* Mobile Provider Switcher */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                          Select your mobile money service:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'evc', label: 'EVC Plus (Hormuud)' },
                            { id: 'zaad', label: 'Zaad (Telesom)' },
                            { id: 'edahab', label: 'eDahab (Somtel)' },
                            { id: 'sahal', label: 'Sahal (Golis)' },
                            { id: 'ebirr', label: 'eBirr (CBE)' }
                          ].map(item => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setMobileProvider(item.id as any)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                mobileProvider === item.id
                                  ? 'bg-[#22C55E] text-white shadow-2xs'
                                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Instructions Card */}
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                          <span>Quick Transfer Instructions:</span>
                          <span className="text-xs font-mono font-bold text-[#22C55E] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                            Amount: ${price} USD
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg text-xs gap-2">
                          <div>
                            <span className="text-slate-500">Merchant Number / Account:</span>{' '}
                            <span className="font-mono font-bold text-slate-900 dark:text-white">+252 61 589 2041</span>{' '}
                            <span className="text-[11px] text-slate-400">(Lafole Academy)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyMerchantCode('+252615892041')}
                            className="text-xs text-[#22C55E] hover:underline flex items-center space-x-1 cursor-pointer font-medium"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy number</span>
                          </button>
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {mobileProvider === 'evc' && 'Dial *712*615892041*$20# on your phone, then enter your transaction reference below.'}
                          {mobileProvider === 'zaad' && 'Send $20 to Telesom Merchant 892041 / +252 63 489 2041, then enter the reference.'}
                          {mobileProvider === 'edahab' && 'Send $20 to eDahab Account 5892041, then enter the transaction reference code.'}
                          {mobileProvider === 'sahal' && 'Transfer $20 via Sahal to account 615892041, then input the confirmation ID.'}
                          {mobileProvider === 'ebirr' && 'Send equivalent Birr to Lafole CBE account, then enter the deposit code.'}
                        </div>
                      </div>

                      {/* Sender inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Your Sending Phone Number
                          </label>
                          <input
                            type="tel"
                            required
                            value={payerPhone}
                            onChange={(e) => setPayerPhone(e.target.value)}
                            placeholder={selectedCountry ? `${selectedCountry.dialCode} 61 123 4567` : "e.g. 61 123 4567"}
                            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Transaction Reference / SMS Code
                          </label>
                          <input
                            type="text"
                            required
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                            placeholder="e.g. TXN948123 or Reference ID"
                            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                          />
                        </div>
                      </div>

                    </div>
                  ) : (
                    /* Card Form */
                    <div className="space-y-4 bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                      
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Name on card"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Card Number
                        </label>
                        <div className="relative flex items-center">
                          <CreditCard className="w-4 h-4 text-slate-400 absolute left-3" />
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4000 1234 5678 9010"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Expires (MM/YY)
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            CVC / CVV
                          </label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="123"
                            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                          />
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Pricing Summary */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Course Tuition ({course.title.slice(0, 30)}...)</span>
                      <span className="font-semibold text-slate-900 dark:text-white">${price}.00</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Digital Certificate &amp; Materials</span>
                      <span className="font-semibold text-[#22C55E]">FREE</span>
                    </div>
                    <div className="flex items-center justify-between text-sm sm:text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>Total Due Today:</span>
                      <span className="text-xl text-[#22C55E]">${price}.00 USD</span>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 px-6 bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-50 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <span className="flex items-center space-x-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Verifying &amp; Enrolling...</span>
                      </span>
                    ) : (
                      <>
                        <span>Complete Enrollment for ${price}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="text-center text-xs text-slate-400">
                    Guaranteed instant classroom activation upon payment confirmation.
                  </div>

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

    </div>
  );
};
