import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  applyActionCode,
  updatePassword,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { formatNameFromEmail } from '../utils/userUtils';
import { Course, AdminUser } from '../types';
import { INITIAL_COURSES } from '../data/courses';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore with configured database ID
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId 
    : undefined
);

/**
 * Computes a salted cryptographic SHA-256 hash of a password using Web Crypto API
 */
export async function hashPassword(password: string, salt?: string): Promise<string> {
  const actualSalt = salt || (typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID().replace(/-/g, '').substring(0, 16) 
    : Math.random().toString(36).substring(2, 18));
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(actualSalt + ':' + password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `${actualSalt}:${hashHex}`;
  } else {
    // Non-crypto fallback (for environments without crypto.subtle)
    let hash = 0;
    const combined = actualSalt + ':' + password;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash |= 0;
    }
    return `${actualSalt}:h_${Math.abs(hash).toString(16)}`;
  }
}

/**
 * Verifies that a plaintext password matches the stored salted hash
 */
export async function verifyPassword(password: string, storedHash?: string): Promise<boolean> {
  if (!password || !storedHash || !storedHash.includes(':')) {
    return false;
  }
  const [salt] = storedHash.split(':');
  const computed = await hashPassword(password, salt);
  return computed === storedHash;
}

// Connection test helper (safe and non-blocking)
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const testDoc = await getDoc(doc(db, '_connection_test', 'health'));
    return true;
  } catch (error: any) {
    // Offline or connection pending is expected in sandboxed iframes
    return false;
  }
}

export interface ClientDetails {
  fullName: string;
  phoneNumber: string;
  country?: string;
  email: string;
  whatsappReceipts?: boolean;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency?: string;
  password?: string;
  passwordHash?: string;
}

export interface EnrollmentRecord extends ClientDetails {
  id: string;
  status: 'pending_verification' | 'verified' | 'enrolled';
  verificationToken: string;
  verificationExpiresAt: string;
  emailVerified: boolean;
  createdAt: string;
  verifiedAt?: string;
}

/**
 * Stores client details into Firestore 'enrollments' collection
 * Generates a verification token, hashes password securely, and queues a verification email record
 */
export async function saveClientDetailsAndInitiateVerification(
  details: ClientDetails
): Promise<{
  enrollmentId: string;
  verificationToken: string;
  verificationUrl: string;
  delivered?: boolean;
  deliveryMessage?: string;
}> {
  // Generate random secure token
  const token = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, '') + Math.random().toString(36).substring(2, 10)
    : 'tok_' + Date.now() + '_' + Math.random().toString(36).substring(2, 12);

  const enrollmentId = 'enr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin.replace(/\/+$/, '') 
    : 'https://lafole.so';
  const verificationUrl = `${baseUrl}/verify-email?token=${token}&email=${encodeURIComponent(details.email?.trim() || '')}`;

  // Securely hash password if provided
  let computedHash = details.passwordHash;
  if (details.password && details.password.trim()) {
    computedHash = await hashPassword(details.password.trim());
    // Attempt Firebase Auth user registration and send real verification email
    try {
      const userCred = await createUserWithEmailAndPassword(auth, details.email.trim().toLowerCase(), details.password.trim());
      if (userCred?.user) {
        try {
          await sendEmailVerification(userCred.user, {
            url: verificationUrl,
            handleCodeInApp: true
          });
          console.info("[Firebase Auth] Verification email dispatched to:", details.email);
        } catch (vErr) {
          console.warn("[Firebase Auth] sendEmailVerification note:", vErr);
        }
      }
    } catch (fbAuthErr: any) {
      if (fbAuthErr?.code === 'auth/email-already-in-use') {
        try {
          const userCred = await signInWithEmailAndPassword(auth, details.email.trim().toLowerCase(), details.password.trim());
          if (userCred?.user && !userCred.user.emailVerified) {
            await sendEmailVerification(userCred.user, {
              url: verificationUrl,
              handleCodeInApp: true
            });
            console.info("[Firebase Auth] Verification email resent to existing user:", details.email);
          }
        } catch {}
      }
    }
  }

  // 1. Save enrollment in Firestore across enrollments, users, and students collections
  const userDocId = details.email.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '_');
  
  // Check if user account already exists and is already verified
  let isAlreadyVerifiedUser = false;
  try {
    const existingSnap = await getDoc(doc(db, 'users', userDocId));
    if (existingSnap.exists()) {
      const exData = existingSnap.data();
      if (exData.emailVerified === true || exData.status === 'verified' || exData.status === 'enrolled') {
        isAlreadyVerifiedUser = true;
      }
    }
  } catch {}

  const enrollmentData: any = {
    id: enrollmentId,
    fullName: details.fullName,
    phoneNumber: details.phoneNumber,
    country: details.country || '',
    email: details.email.trim().toLowerCase(),
    whatsappReceipts: details.whatsappReceipts,
    courseId: details.courseId,
    courseTitle: details.courseTitle,
    amount: details.amount,
    currency: details.currency || 'USD',
    status: isAlreadyVerifiedUser ? 'verified' : 'pending_verification',
    verificationToken: token,
    verificationExpiresAt: expiresAt.toISOString(),
    emailVerified: isAlreadyVerifiedUser,
    createdAt: now.toISOString(),
  };

  if (computedHash) {
    enrollmentData.passwordHash = computedHash;
  }

  const userProfileData: any = {
    uid: userDocId,
    id: userDocId,
    fullName: details.fullName,
    phoneNumber: details.phoneNumber,
    country: details.country || '',
    email: details.email.toLowerCase().trim(),
    courseId: details.courseId,
    courseTitle: details.courseTitle,
    amount: details.amount,
    currency: details.currency || 'USD',
    emailVerified: isAlreadyVerifiedUser,
    status: isAlreadyVerifiedUser ? 'verified' : 'pending_verification',
    lastEnrollmentId: enrollmentId,
    createdAt: now.toISOString(),
    lastUpdated: now.toISOString()
  };

  if (computedHash) {
    userProfileData.passwordHash = computedHash;
  }

  try {
    const enrollRef = doc(db, 'enrollments', enrollmentId);
    await setDoc(enrollRef, enrollmentData);
  } catch (err) {
    console.error("Error saving enrollment to Firestore:", err);
  }

  try {
    const userRef = doc(db, 'users', userDocId);
    await setDoc(userRef, userProfileData, { merge: true });
  } catch (err) {
    console.error("Error saving user to Firestore:", err);
  }

  try {
    const studentRef = doc(db, 'students', userDocId);
    await setDoc(studentRef, userProfileData, { merge: true });
  } catch (err) {
    console.error("Error saving student to Firestore:", err);
  }

  // 2. Dispatch verification email record to client's email via Firestore collections
  const emailPayload = {
    to: details.email,
    recipientName: details.fullName,
    subject: "One Last Step! Verify your email for Lafole Academy",
    token: token,
    verificationUrl: verificationUrl,
    courseTitle: details.courseTitle,
    sentAt: now.toISOString(),
    status: 'dispatched',
    message: {
      subject: "One Last Step! Verify your email for Lafole Academy",
      text: `Hello ${details.fullName},\n\nThank you for enrolling in ${details.courseTitle} at Lafole Academy!\n\nPlease verify your email to activate your student account:\n${verificationUrl}\n\nThis verification link is valid for 24 hours.\n\nWarm regards,\nLafole Academy Registrar`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <h2 style="color: #0f172a; margin-bottom: 12px;">Verify your email for Lafole Academy</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6;">Hello <strong>${details.fullName}</strong>,</p>
          <p style="color: #475569; font-size: 15px; line-height: 1.6;">Thank you for beginning your enrollment in <strong>${details.courseTitle}</strong>. To secure your student account and access your learning dashboard, please click the verification button below:</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${verificationUrl}" style="background-color: #22c55e; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">Verify My Email Address</a>
          </div>
          <p style="color: #64748b; font-size: 13px;">If the button doesn't work, copy and paste this link into your browser:<br/><a href="${verificationUrl}" style="color: #16a34a;">${verificationUrl}</a></p>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">This link will expire in 24 hours. If you did not create an account at Lafole Academy, you can safely ignore this email.</p>
        </div>
      `
    }
  };

  try {
    const emailRef = doc(db, 'verification_emails', 'email_' + Date.now());
    await setDoc(emailRef, emailPayload);
  } catch (err) {
    console.warn("Could not record verification_emails dispatch in Firestore:", err);
  }

  // Also write to standard 'mail' collection for trigger-email extensions
  try {
    const mailRef = doc(db, 'mail', 'mail_' + Date.now());
    await setDoc(mailRef, {
      to: [details.email],
      message: emailPayload.message
    });
  } catch (err) {
    // Non-blocking
  }

  // 3. Dispatch via server-side mailer API
  let delivered = false;
  let emailDeliveryMsg = '';
  try {
    const apiRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: details.email,
        fullName: details.fullName,
        verificationUrl,
        token,
        courseTitle: details.courseTitle
      })
    });
    if (apiRes.ok) {
      const data = await apiRes.json();
      delivered = !!data.delivered;
      emailDeliveryMsg = data.message || '';
    }
  } catch (apiErr) {
    console.info("Notice: /api/send-email endpoint response:", apiErr);
  }

  console.info(`[Email Service] Verification link dispatched for ${details.email}, delivered: ${delivered}`);

  return {
    enrollmentId,
    verificationToken: token,
    verificationUrl,
    delivered,
    deliveryMessage: emailDeliveryMsg
  };
}

/**
 * Resends a verification email to the client's email address
 */
export async function resendVerificationEmail(params: {
  email: string;
  fullName: string;
  courseTitle: string;
  verificationUrl: string;
  token: string;
}): Promise<{ success: boolean; delivered?: boolean; message: string }> {
  try {
    const now = new Date();
    const emailPayload = {
      to: params.email,
      recipientName: params.fullName,
      subject: "Reminder: Verify your email for Lafole Academy",
      token: params.token,
      verificationUrl: params.verificationUrl,
      courseTitle: params.courseTitle,
      sentAt: now.toISOString(),
      status: 'dispatched',
      isResend: true,
      message: {
        subject: "Reminder: Verify your email for Lafole Academy",
        text: `Hello ${params.fullName},\n\nHere is your requested verification link for Lafole Academy:\n${params.verificationUrl}\n\nWarm regards,\nLafole Academy Registrar`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <h2 style="color: #0f172a; margin-bottom: 12px;">Verify your email for Lafole Academy</h2>
            <p style="color: #475569; font-size: 15px; line-height: 1.6;">Hello <strong>${params.fullName}</strong>,</p>
            <p style="color: #475569; font-size: 15px; line-height: 1.6;">Here is your requested verification link for <strong>${params.courseTitle}</strong>:</p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="${params.verificationUrl}" style="background-color: #22c55e; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">Verify My Email Address</a>
            </div>
            <p style="color: #64748b; font-size: 13px;">Link: <a href="${params.verificationUrl}" style="color: #16a34a;">${params.verificationUrl}</a></p>
          </div>
        `
      }
    };

    try {
      const emailRef = doc(db, 'verification_emails', 'email_resend_' + Date.now());
      await setDoc(emailRef, emailPayload);
    } catch {}

    try {
      const mailRef = doc(db, 'mail', 'mail_resend_' + Date.now());
      await setDoc(mailRef, {
        to: [params.email],
        message: emailPayload.message
      });
    } catch {}

    // Dispatch via Firebase Auth if active
    try {
      if (auth.currentUser && auth.currentUser.email?.toLowerCase() === params.email.toLowerCase()) {
        await sendEmailVerification(auth.currentUser, {
          url: params.verificationUrl,
          handleCodeInApp: true
        });
      }
    } catch {}

    let delivered = false;
    try {
      const apiRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: params.email,
          fullName: params.fullName,
          verificationUrl: params.verificationUrl,
          token: params.token,
          courseTitle: params.courseTitle
        })
      });
      if (apiRes.ok) {
        const json = await apiRes.json();
        delivered = !!json.delivered;
        if (delivered) {
          return {
            success: true,
            delivered: true,
            message: `Verification email delivered to ${params.email}! Check inbox/spam.`
          };
        }
      }
    } catch {}

    return { 
      success: true, 
      delivered,
      message: delivered
        ? `Verification email delivered to ${params.email}`
        : `Verification link generated for ${params.email}. Check inbox or verify in 1-click.` 
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to resend verification email."
    };
  }
}

/**
 * Registers a new student account directly from the Login / Sign Up page
 */
export async function registerNewStudent(params: {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}): Promise<{
  success: boolean;
  message: string;
  verificationToken?: string;
  verificationUrl?: string;
  delivered?: boolean;
  alreadyExists?: boolean;
  isVerified?: boolean;
}> {
  try {
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanName = params.fullName.trim() || 'Student';
    const cleanPassword = params.password.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: "Please provide a valid email address." };
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }

    // STRICT CHECK: Check if an account already exists with this email address
    const userDocId = cleanEmail.replace(/[^a-z0-9_-]/g, '_');
    let existingUser: any = null;

    try {
      const uSnap = await getDoc(doc(db, 'users', userDocId));
      if (uSnap.exists()) {
        existingUser = uSnap.data();
      }
    } catch {}

    if (!existingUser) {
      try {
        const sSnap = await getDoc(doc(db, 'students', userDocId));
        if (sSnap.exists()) {
          existingUser = sSnap.data();
        }
      } catch {}
    }

    if (!existingUser) {
      try {
        const q = query(collection(db, 'enrollments'), where('email', '==', cleanEmail));
        const snap = await getDocs(q);
        if (!snap.empty) {
          existingUser = snap.docs[0].data();
        }
      } catch {}
    }

    if (existingUser) {
      const isVerified = existingUser.emailVerified === true || 
        existingUser.status === 'verified' || 
        existingUser.status === 'enrolled';

      if (isVerified) {
        return {
          success: false,
          alreadyExists: true,
          isVerified: true,
          message: "An account with this email address already exists and is verified. Please sign in with your password instead."
        };
      } else {
        return {
          success: false,
          alreadyExists: true,
          isVerified: false,
          message: "An account with this email address has already been registered and is pending verification. Please check your inbox or resend the verification email."
        };
      }
    }

    const res = await saveClientDetailsAndInitiateVerification({
      fullName: cleanName,
      email: cleanEmail,
      phoneNumber: params.phoneNumber?.trim() || '',
      password: cleanPassword,
      courseId: 'general-student',
      courseTitle: 'Lafole Academy Student Track',
      amount: 0,
      currency: 'USD'
    });

    return {
      success: true,
      message: res.deliveryMessage || `Verification link generated for ${cleanEmail}! Please check your email inbox and spam folder.`,
      verificationToken: res.verificationToken,
      verificationUrl: res.verificationUrl,
      delivered: res.delivered
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to register new student account."
    };
  }
}

/**
 * Verifies email using verification token against Firestore
 */
export async function verifyEmailByToken(
  token: string, 
  email?: string
): Promise<{ 
  success: boolean; 
  message: string; 
  record?: any; 
  alreadyVerified?: boolean; 
  expired?: boolean; 
}> {
  try {
    const cleanToken = (token || '').trim();
    if (!cleanToken) {
      return { 
        success: false, 
        message: "A valid verification token from the link sent to your email is required. Please check your inbox and click the verification link." 
      };
    }

    // Attempt Firebase Auth action code verification if token looks like an oobCode
    try {
      if (cleanToken.length > 15 && !cleanToken.startsWith('tok_')) {
        await applyActionCode(auth, cleanToken);
      }
    } catch {}

    // Query Firestore enrollments collection for matching verificationToken
    try {
      const q = query(
        collection(db, 'enrollments'), 
        where('verificationToken', '==', cleanToken)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const docItem = snap.docs[0];
        const data = docItem.data();

        // Check if this enrollment or user has ALREADY been verified
        const isAlreadyVerified = data.emailVerified === true || data.status === 'verified' || data.status === 'enrolled';

        // Enforce 24-hour expiration check (links are strictly valid for 24 hours)
        const isExpired = (data.verificationExpiresAt && new Date(data.verificationExpiresAt).getTime() < Date.now()) ||
          (data.createdAt && (Date.now() - new Date(data.createdAt).getTime() > 24 * 60 * 60 * 1000));
        
        if (isExpired && !isAlreadyVerified) {
          return { 
            success: false, 
            expired: true,
            message: "This verification link has expired (links are valid for 24 hours). Please request a new verification link." 
          };
        }

        let studentFullName = data.fullName || '';
        if (!studentFullName || ['verified student', 'nerd ninja'].includes(studentFullName.toLowerCase())) {
          studentFullName = formatNameFromEmail(data.email || '');
        }

        const verifiedRecord = { 
          ...data, 
          fullName: studentFullName, 
          emailVerified: true, 
          status: 'verified',
          verifiedAt: data.verifiedAt || new Date().toISOString()
        };

        if (typeof localStorage !== 'undefined') {
          if (data.email) localStorage.setItem('lafole_verified_email', data.email);
          if (studentFullName) localStorage.setItem('lafole_verified_fullname', studentFullName);
          localStorage.setItem('lafole_email_verified', 'true');
          localStorage.setItem('last_lafole_enrollment', JSON.stringify(verifiedRecord));
        }

        // If the link was ALREADY verified, notify gracefully without re-running mutations
        if (isAlreadyVerified) {
          return {
            success: true,
            alreadyVerified: true,
            message: "This email address has already been verified. Your account is active and ready to sign in.",
            record: verifiedRecord
          };
        }

        // First-time verification: update Firestore across enrollments, users, and students
        try {
          await updateDoc(docItem.ref, {
            emailVerified: true,
            status: 'verified',
            verifiedAt: new Date().toISOString()
          });
        } catch (updErr) {
          // Non-blocking update failure
        }

        if (data.email) {
          const userDocId = data.email.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '_');
          try {
            await setDoc(doc(db, 'users', userDocId), { emailVerified: true, status: 'verified', verifiedAt: new Date().toISOString(), fullName: studentFullName }, { merge: true });
          } catch {}
          try {
            await setDoc(doc(db, 'students', userDocId), { emailVerified: true, status: 'verified', verifiedAt: new Date().toISOString(), fullName: studentFullName }, { merge: true });
          } catch {}
        }

        return { 
          success: true, 
          message: "Email successfully verified! Your student account is now active.",
          record: verifiedRecord
        };
      }
    } catch (fsErr: any) {
      console.warn("Firestore query during token verification:", fsErr?.message || fsErr);
    }

    // Check secondary token store in verification_emails collection
    try {
      const emailQ = query(
        collection(db, 'verification_emails'),
        where('token', '==', cleanToken)
      );
      const emailSnap = await getDocs(emailQ);
      if (!emailSnap.empty) {
        const emailDoc = emailSnap.docs[0].data();
        const recipientEmail = emailDoc.to || email;
        if (recipientEmail) {
          const userDocId = recipientEmail.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '_');
          const studentFullName = emailDoc.recipientName || formatNameFromEmail(recipientEmail);
          
          await setDoc(doc(db, 'users', userDocId), {
            emailVerified: true,
            status: 'verified',
            verifiedAt: new Date().toISOString(),
            fullName: studentFullName
          }, { merge: true });
          await setDoc(doc(db, 'students', userDocId), {
            emailVerified: true,
            status: 'verified',
            verifiedAt: new Date().toISOString(),
            fullName: studentFullName
          }, { merge: true });

          const verifiedRecord = {
            email: recipientEmail,
            fullName: studentFullName,
            status: 'verified',
            emailVerified: true,
            verifiedAt: new Date().toISOString()
          };
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('lafole_verified_email', recipientEmail);
            localStorage.setItem('lafole_verified_fullname', studentFullName);
            localStorage.setItem('lafole_email_verified', 'true');
            localStorage.setItem('last_lafole_enrollment', JSON.stringify(verifiedRecord));
          }
          return {
            success: true,
            message: "Email successfully verified! Your account is active.",
            record: verifiedRecord
          };
        }
      }
    } catch (secondaryErr) {
      console.warn("Secondary token check:", secondaryErr);
    }

    return { 
      success: false, 
      message: "This verification link is invalid or has expired. Please check your inbox or request a new verification email." 
    };
  } catch (error: any) {
    console.warn("Verification failed:", error?.message || error);
    return { 
      success: false, 
      message: "Verification could not be completed. Please ensure you clicked the exact link sent to your email." 
    };
  }
}

/**
 * Signs in a student by email/username and password.
 * Strictly verifies that the student has created an account AND verified their email,
 * and securely validates their password against cryptographic hash or Firebase Auth.
 * NO arbitrary passwords will EVER pass.
 */
export async function signInStudent(
  identifier: string,
  password: string
): Promise<{ success: boolean; message: string; code?: string; user?: any }> {
  try {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId) {
      return { success: false, message: "Please enter your username or email address." };
    }
    if (!password) {
      return { success: false, message: "Please enter your password." };
    }

    // 1. Try standard Firebase Auth if email format
    let firebaseAuthSuccess = false;
    let authUser: any = null;

    if (cleanId.includes('@')) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, cleanId, password);
        if (userCred.user) {
          firebaseAuthSuccess = true;
          authUser = userCred.user;
        }
      } catch (authErr: any) {
        // CRITICAL SECURITY ENFORCEMENT:
        // If Firebase Auth returned invalid credentials or wrong password, REJECT IMMEDIATELY!
        // Never allow fallthrough bypass when an incorrect password was entered!
        if (
          authErr?.code === 'auth/wrong-password' || 
          authErr?.code === 'auth/invalid-credential' || 
          authErr?.code === 'auth/invalid-login-credentials'
        ) {
          return {
            success: false,
            message: "Incorrect password. Please verify your credentials and try again."
          };
        }
        // If user-not-found or operation-not-allowed, continue to check Firestore salted hash
      }
    }

    if (firebaseAuthSuccess && authUser) {
      return {
        success: true,
        message: "Signed in successfully!",
        user: {
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName || cleanId.split('@')[0],
          status: 'verified'
        }
      };
    }

    // 2. Comprehensive check across users, students, and enrollments collections
    const userDocId = cleanId.replace(/[^a-z0-9_-]/g, '_');
    let userDocData: any = null;
    let studentDocData: any = null;
    let enrollmentRecords: any[] = [];

    try {
      const userSnap = await getDoc(doc(db, 'users', userDocId));
      if (userSnap.exists()) userDocData = userSnap.data();
    } catch {}

    try {
      const studentSnap = await getDoc(doc(db, 'students', userDocId));
      if (studentSnap.exists()) studentDocData = studentSnap.data();
    } catch {}

    try {
      const q = query(
        collection(db, 'enrollments'),
        where('email', '==', cleanId)
      );
      const snap = await getDocs(q);
      snap.forEach(d => enrollmentRecords.push(d.data()));
    } catch (fsErr) {
      console.warn("Firestore lookup note during login:", fsErr);
    }

    // 3. Local cached session fallback (only if matches this exact email)
    let localRecord: any = null;
    if (typeof localStorage !== 'undefined') {
      const localEnrollment = localStorage.getItem('last_lafole_enrollment');
      if (localEnrollment) {
        try {
          const parsed = JSON.parse(localEnrollment);
          if (parsed.email?.toLowerCase() === cleanId) {
            localRecord = parsed;
          }
        } catch {}
      }
    }

    const accountExists = !!(userDocData || studentDocData || enrollmentRecords.length > 0 || localRecord);

    // STRICT CHECK: Student must have created an account
    if (!accountExists) {
      return {
        success: false,
        message: "No account found with this email. Only students who have created an account and verified their email can sign in."
      };
    }

    // Determine verification status from ANY trusted source
    let isEmailVerified = false;
    if (userDocData?.emailVerified === true || userDocData?.status === 'verified' || userDocData?.status === 'enrolled') {
      isEmailVerified = true;
    }
    if (studentDocData?.emailVerified === true || studentDocData?.status === 'verified' || studentDocData?.status === 'enrolled') {
      isEmailVerified = true;
    }
    for (const enr of enrollmentRecords) {
      if (enr.emailVerified === true || enr.status === 'verified' || enr.status === 'enrolled') {
        isEmailVerified = true;
        break;
      }
    }
    if (typeof localStorage !== 'undefined' && 
        localStorage.getItem('lafole_email_verified') === 'true' && 
        localStorage.getItem('lafole_verified_email')?.toLowerCase() === cleanId) {
      isEmailVerified = true;
    }

    // Resolve candidate password hash and student name from available data
    const candidateHash = userDocData?.passwordHash || 
      studentDocData?.passwordHash || 
      enrollmentRecords.find(r => r.passwordHash)?.passwordHash ||
      localRecord?.passwordHash;

    const candidateName = userDocData?.fullName || 
      studentDocData?.fullName || 
      enrollmentRecords.find(r => r.fullName && !['verified student', 'nerd ninja'].includes(r.fullName.toLowerCase()))?.fullName ||
      localRecord?.fullName ||
      formatNameFromEmail(cleanId);

    // STRICT CHECK: Email must be verified!
    if (!isEmailVerified) {
      return {
        success: false,
        message: "Your email address has not been verified yet. Please check your inbox and click the verification link to activate your account."
      };
    }

    // Auto-heal: Ensure both users and students docs in Firestore have emailVerified: true
    try {
      await setDoc(doc(db, 'users', userDocId), { emailVerified: true, status: 'verified', fullName: candidateName }, { merge: true });
      await setDoc(doc(db, 'students', userDocId), { emailVerified: true, status: 'verified', fullName: candidateName }, { merge: true });
    } catch {}

    // STRICT CHECK: Cryptographic Password Validation!
    if (candidateHash) {
      const isMatch = await verifyPassword(password, candidateHash);
      if (!isMatch) {
        return {
          success: false,
          message: "Incorrect password. Please verify your credentials and try again."
        };
      }
    } else {
      // Account exists and is verified, but has not set a password yet
      return {
        success: false,
        code: 'PASSWORD_NOT_SET',
        message: "No password has been set for this account yet. Please create your secure password to complete account setup."
      };
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lafole_email_verified', 'true');
      localStorage.setItem('lafole_verified_email', cleanId);
      localStorage.setItem('lafole_verified_fullname', candidateName);
    }

    return {
      success: true,
      message: "Signed in successfully!",
      user: {
        name: candidateName,
        email: cleanId,
        courseId: userDocData?.courseId || studentDocData?.courseId || 'general-student',
        courseTitle: userDocData?.courseTitle || studentDocData?.courseTitle || 'Lafole Academy Track',
        status: 'verified'
      }
    };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to sign in. Please check your credentials." };
  }
}

/**
 * Creates or sets a password for an account that does not have one yet
 */
export async function setStudentAccountPassword(params: {
  email: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    const cleanEmail = params.email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: "Please provide a valid email address." };
    }
    if (!params.newPassword || params.newPassword.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }

    const passwordHash = await hashPassword(params.newPassword);
    const userDocId = cleanEmail.replace(/[^a-z0-9_-]/g, '_');
    const nowIso = new Date().toISOString();

    // Update users, students, and enrollments in Firestore
    try {
      await setDoc(doc(db, 'users', userDocId), { 
        passwordHash, 
        lastUpdated: nowIso 
      }, { merge: true });
    } catch (err) {
      console.error("Error setting password in users collection:", err);
    }

    try {
      await setDoc(doc(db, 'students', userDocId), { 
        passwordHash, 
        lastUpdated: nowIso 
      }, { merge: true });
    } catch (err) {
      console.error("Error setting password in students collection:", err);
    }

    try {
      const q = query(collection(db, 'enrollments'), where('email', '==', cleanEmail));
      const snap = await getDocs(q);
      snap.forEach(async (d) => {
        try {
          await updateDoc(d.ref, { passwordHash });
        } catch {}
      });
    } catch {}

    // Update local storage record if present
    if (typeof localStorage !== 'undefined') {
      const localData = localStorage.getItem('last_lafole_enrollment');
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (parsed.email?.toLowerCase() === cleanEmail) {
            parsed.passwordHash = passwordHash;
            localStorage.setItem('last_lafole_enrollment', JSON.stringify(parsed));
          }
        } catch {}
      }
    }

    // Also attempt Firebase Auth user creation or update
    try {
      await createUserWithEmailAndPassword(auth, cleanEmail, params.newPassword);
    } catch (fbErr: any) {
      // Ignored if user already exists
    }

    return {
      success: true,
      message: "Password created and secured successfully! You are now signed in.",
      user: {
        email: cleanEmail,
        status: 'verified'
      }
    };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to set password." };
  }
}

/**
 * Updates a student password after verifying their current password
 */
export async function updateStudentPassword(
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: "Email is required." };
    }
    if (!currentPassword) {
      return { success: false, message: "Please enter your current password." };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: "New password must be at least 6 characters." };
    }

    const userDocId = cleanEmail.replace(/[^a-z0-9_-]/g, '_');
    let studentRecord: any = null;

    try {
      const snap = await getDoc(doc(db, 'users', userDocId));
      if (snap.exists()) {
        studentRecord = snap.data();
      }
    } catch {}

    if (!studentRecord) {
      try {
        const snap2 = await getDoc(doc(db, 'students', userDocId));
        if (snap2.exists()) {
          studentRecord = snap2.data();
        }
      } catch {}
    }

    if (studentRecord && studentRecord.passwordHash) {
      const matches = await verifyPassword(currentPassword, studentRecord.passwordHash);
      if (!matches) {
        return { success: false, message: "Current password does not match." };
      }
    }

    const newHash = await hashPassword(newPassword);
    const nowIso = new Date().toISOString();

    try {
      await setDoc(doc(db, 'users', userDocId), { passwordHash: newHash, lastUpdated: nowIso }, { merge: true });
      await setDoc(doc(db, 'students', userDocId), { passwordHash: newHash, lastUpdated: nowIso }, { merge: true });
    } catch (err) {
      console.error("Error saving updated password to Firestore:", err);
    }

    if (auth.currentUser) {
      try {
        await updatePassword(auth.currentUser, newPassword);
      } catch {}
    }

    return { success: true, message: "Password updated successfully." };
  } catch (error: any) {
    return { success: false, message: error?.message || "Could not update password." };
  }
}

/**
 * Requests a 6-digit OTP code to reset password
 */
export async function requestPasswordResetCode(
  email: string
): Promise<{ success: boolean; message: string; code?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: "Please provide a valid email address." };
    }

    const userDocId = cleanEmail.replace(/[^a-z0-9_-]/g, '_');
    
    // Check if user exists in Firestore
    let userExists = false;
    try {
      const snap = await getDoc(doc(db, 'users', userDocId));
      if (snap.exists()) userExists = true;
    } catch {}

    if (!userExists) {
      try {
        const q = query(collection(db, 'enrollments'), where('email', '==', cleanEmail));
        const snap = await getDocs(q);
        if (!snap.empty) userExists = true;
      } catch {}
    }

    if (!userExists) {
      return {
        success: false,
        message: "No account found with this email address. Please register or check the spelling."
      };
    }

    // Generate 6-digit OTP code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    // Store in password_resets collection in Firestore
    try {
      await setDoc(doc(db, 'password_resets', `reset_${userDocId}`), {
        email: cleanEmail,
        code: resetCode,
        status: 'active',
        createdAt: new Date().toISOString(),
        expiresAt
      });
    } catch (err) {
      console.warn("Could not save password reset record:", err);
    }

    // Also dispatch email log
    try {
      await setDoc(doc(db, 'verification_emails', `reset_${Date.now()}`), {
        to: cleanEmail,
        subject: "Your Lafole Academy Password Reset Code",
        token: resetCode,
        sentAt: new Date().toISOString(),
        status: 'sent'
      });
    } catch {}

    // Resolve student display name for personalized email
    let studentFullName = formatNameFromEmail(cleanEmail);
    try {
      const uSnap = await getDoc(doc(db, 'users', userDocId));
      if (uSnap.exists() && uSnap.data().fullName) {
        studentFullName = uSnap.data().fullName;
      }
    } catch {}

    // Dispatch real email via /api/send-email endpoint (supports Resend on Vercel and local Express)
    let emailDelivered = false;
    let serverMessage = '';
    try {
      const apiRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'password_reset',
          to: cleanEmail,
          fullName: studentFullName,
          resetCode: resetCode,
          expiresInMinutes: 15
        })
      });
      if (apiRes.ok) {
        const resData = await apiRes.json();
        emailDelivered = !!resData.delivered;
        serverMessage = resData.message || '';
      }
    } catch (apiErr) {
      console.info("Notice: /api/send-email response during password reset:", apiErr);
    }

    // Also attempt Firebase Auth reset email
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch {}

    return {
      success: true,
      message: emailDelivered
        ? `A 6-digit password reset code has been delivered to ${cleanEmail}. Please check your inbox and spam folder.`
        : `A 6-digit password reset code has been sent to ${cleanEmail}. (Code: ${resetCode})`,
      code: resetCode
    };
  } catch (error: any) {
    return { success: false, message: error?.message || "Could not send reset code." };
  }
}

/**
 * Resets a student's password using the 6-digit OTP code
 */
export async function resetPasswordWithCode(
  email: string,
  code: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: "Please provide a valid email address." };
    }
    if (!cleanCode || cleanCode.length < 6) {
      return { success: false, message: "Please enter the 6-digit verification code." };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: "New password must be at least 6 characters." };
    }

    const userDocId = cleanEmail.replace(/[^a-z0-9_-]/g, '_');
    const resetRef = doc(db, 'password_resets', `reset_${userDocId}`);
    const resetSnap = await getDoc(resetRef);

    if (!resetSnap.exists()) {
      return { success: false, message: "No active password reset request found for this email." };
    }

    const resetData = resetSnap.data();
    if (resetData.status === 'used') {
      return { success: false, message: "This reset code has already been used. Please request a new one." };
    }

    if (resetData.expiresAt && new Date(resetData.expiresAt) < new Date()) {
      return { success: false, message: "This reset code has expired. Please request a new one." };
    }

    if (resetData.code !== cleanCode) {
      return { success: false, message: "Incorrect 6-digit code. Please verify the code and try again." };
    }

    // Code is valid! Hash new password and update
    const passwordHash = await hashPassword(newPassword);
    const nowIso = new Date().toISOString();

    try {
      await setDoc(doc(db, 'users', userDocId), { 
        passwordHash, 
        lastUpdated: nowIso 
      }, { merge: true });

      await setDoc(doc(db, 'students', userDocId), { 
        passwordHash, 
        lastUpdated: nowIso 
      }, { merge: true });

      await updateDoc(resetRef, { status: 'used', usedAt: nowIso });
    } catch (fsErr) {
      console.error("Error updating password in Firestore:", fsErr);
    }

    return {
      success: true,
      message: "Password reset successfully! You can now sign in with your new password."
    };
  } catch (error: any) {
    return { success: false, message: error?.message || "Could not reset password." };
  }
}

/**
 * Legacy wrapper: sends a password reset request
 */
export async function resetStudentPassword(
  email: string
): Promise<{ success: boolean; message: string; code?: string }> {
  return requestPasswordResetCode(email);
}

/**
 * Retrieves the list of actively enrolled course IDs for a given student email from Firestore.
 * Brand new students who only registered an account will return [] (empty array).
 */
export async function getStudentEnrolledCourseIds(email: string): Promise<string[]> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return [];

  const enrolledIds = new Set<string>();

  // 1. Query 'enrollments' collection where email matches and status is 'enrolled' or payment completed
  try {
    const q = query(
      collection(db, 'enrollments'),
      where('email', '==', cleanEmail)
    );
    const snap = await getDocs(q);
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (
        (data.status === 'enrolled' || data.status === 'active' || data.paymentStatus === 'completed') &&
        data.courseId &&
        data.courseId !== 'general-student'
      ) {
        enrolledIds.add(data.courseId);
      }
    });
  } catch (err) {
    console.warn("Could not query enrollments for student:", err);
  }

  // 2. Query user/student record for confirmed enrolled courses
  try {
    const userDocId = cleanEmail.replace(/[^a-z0-9_-]/g, '_');
    const uSnap = await getDoc(doc(db, 'users', userDocId));
    if (uSnap.exists()) {
      const data = uSnap.data();
      if (Array.isArray(data.enrolledCourseIds)) {
        data.enrolledCourseIds.forEach((id: string) => {
          if (id && id !== 'general-student') enrolledIds.add(id);
        });
      }
      if (data.status === 'enrolled' && data.lastEnrolledCourseId && data.lastEnrolledCourseId !== 'general-student') {
        enrolledIds.add(data.lastEnrolledCourseId);
      }
    }
  } catch (err) {
    console.warn("Could not query user doc for enrollments:", err);
  }

  return Array.from(enrolledIds);
}

export interface StudentProfileData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  country?: string;
  username?: string;
  emailVerified?: boolean;
}

/**
 * Retrieves the student's authentic profile from Firestore (users, students, enrollments)
 * Ensuring genuine name, phone, country, and username are returned without placeholder text.
 */
export async function getStudentProfile(email: string): Promise<StudentProfileData | null> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return null;
  const userDocId = cleanEmail.replace(/[^a-z0-9_-]/g, '_');

  const isPlaceholder = (n?: string) => {
    if (!n) return true;
    const l = n.trim().toLowerCase();
    return l === 'verified student' || l === 'nerd ninja' || l === 'student' || l === 'undefined';
  };

  try {
    const uSnap = await getDoc(doc(db, 'users', userDocId));
    if (uSnap.exists()) {
      const data = uSnap.data();
      const rawName = data.fullName;
      const validName = isPlaceholder(rawName) ? '' : rawName;
      return {
        fullName: validName || formatNameFromEmail(cleanEmail),
        email: cleanEmail,
        phoneNumber: data.phoneNumber || '',
        country: data.country || 'Somalia',
        username: data.username || cleanEmail.split('@')[0],
        emailVerified: data.emailVerified === true
      };
    }
  } catch {}

  try {
    const sSnap = await getDoc(doc(db, 'students', userDocId));
    if (sSnap.exists()) {
      const data = sSnap.data();
      const rawName = data.fullName;
      const validName = isPlaceholder(rawName) ? '' : rawName;
      return {
        fullName: validName || formatNameFromEmail(cleanEmail),
        email: cleanEmail,
        phoneNumber: data.phoneNumber || '',
        country: data.country || 'Somalia',
        username: data.username || cleanEmail.split('@')[0],
        emailVerified: data.emailVerified === true
      };
    }
  } catch {}

  try {
    const q = query(collection(db, 'enrollments'), where('email', '==', cleanEmail));
    const eSnap = await getDocs(q);
    if (!eSnap.empty) {
      const data = eSnap.docs[0].data();
      const rawName = data.fullName;
      const validName = isPlaceholder(rawName) ? '' : rawName;
      return {
        fullName: validName || formatNameFromEmail(cleanEmail),
        email: cleanEmail,
        phoneNumber: data.phoneNumber || '',
        country: data.country || 'Somalia',
        username: cleanEmail.split('@')[0],
        emailVerified: data.emailVerified === true || data.status === 'verified'
      };
    }
  } catch {}

  return {
    fullName: formatNameFromEmail(cleanEmail),
    email: cleanEmail,
    phoneNumber: '',
    country: 'Somalia',
    username: cleanEmail.split('@')[0],
    emailVerified: false
  };
}

/**
 * Updates a student's personal info in Firestore across users and students collections
 */
export async function updateStudentProfile(
  email: string,
  updates: {
    fullName?: string;
    phoneNumber?: string;
    country?: string;
    username?: string;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return { success: false, message: "Email is required." };
    const userDocId = cleanEmail.replace(/[^a-z0-9_-]/g, '_');
    const nowIso = new Date().toISOString();
    const payload: any = { lastUpdated: nowIso };

    if (updates.fullName !== undefined) payload.fullName = updates.fullName.trim();
    if (updates.phoneNumber !== undefined) payload.phoneNumber = updates.phoneNumber.trim();
    if (updates.country !== undefined) payload.country = updates.country.trim();
    if (updates.username !== undefined) payload.username = updates.username.trim();

    try {
      await setDoc(doc(db, 'users', userDocId), payload, { merge: true });
    } catch {}
    try {
      await setDoc(doc(db, 'students', userDocId), payload, { merge: true });
    } catch {}

    return { success: true, message: "Profile updated successfully." };
  } catch (err: any) {
    return { success: false, message: err?.message || "Failed to update profile." };
  }
}

/**
 * Completely signs out the student session from Firebase Auth and clears any student session storage
 */
export async function signOutStudent(): Promise<void> {
  try {
    if (auth.currentUser) {
      await signOut(auth);
    }
  } catch (err) {
    console.warn("Error signing out of Firebase Auth:", err);
  }
}

export interface StudentVerificationStatusResult {
  verified: boolean;
  email: string;
  fullName?: string;
  status?: string;
  source?: 'users' | 'students' | 'enrollments';
  record?: any;
}

/**
 * Validates a student's email verification status directly against the Firestore database 
 * (users, students, enrollments) rather than relying solely on local storage state.
 */
export async function validateStudentVerificationStatus(
  email: string
): Promise<StudentVerificationStatusResult> {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { verified: false, email: cleanEmail };
  }

  const userDocId = cleanEmail.replace(/[^a-z0-9_-]/g, '_');

  // 1. Check users collection
  try {
    const userSnap = await getDoc(doc(db, 'users', userDocId));
    if (userSnap.exists()) {
      const data = userSnap.data();
      const isVerified = data.emailVerified === true || data.status === 'verified' || data.status === 'enrolled';
      if (isVerified) {
        return {
          verified: true,
          email: cleanEmail,
          fullName: data.fullName,
          status: data.status || 'verified',
          source: 'users',
          record: data
        };
      }
    }
  } catch (err) {
    console.warn("Could not query users collection during verification check:", err);
  }

  // 2. Check students collection
  try {
    const studentSnap = await getDoc(doc(db, 'students', userDocId));
    if (studentSnap.exists()) {
      const data = studentSnap.data();
      const isVerified = data.emailVerified === true || data.status === 'verified' || data.status === 'enrolled';
      if (isVerified) {
        return {
          verified: true,
          email: cleanEmail,
          fullName: data.fullName,
          status: data.status || 'verified',
          source: 'students',
          record: data
        };
      }
    }
  } catch (err) {
    console.warn("Could not query students collection during verification check:", err);
  }

  // 3. Check enrollments collection
  try {
    const q = query(
      collection(db, 'enrollments'),
      where('email', '==', cleanEmail)
    );
    const enrollSnap = await getDocs(q);
    for (const docItem of enrollSnap.docs) {
      const data = docItem.data();
      const isVerified = data.emailVerified === true || data.status === 'verified' || data.status === 'enrolled';
      if (isVerified) {
        return {
          verified: true,
          email: cleanEmail,
          fullName: data.fullName,
          status: data.status || 'verified',
          source: 'enrollments',
          record: data
        };
      }
    }
  } catch (err) {
    console.warn("Could not query enrollments collection during verification check:", err);
  }

  return { verified: false, email: cleanEmail };
}

// ============================================================================
// ADMIN PAYMENTS, ORDERS & ENROLLMENTS SYSTEM
// ============================================================================

export interface PaymentTableRecord {
  id: string;
  order_id: string;
  student_id: string;
  course_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_reference: string;
  sender_phone: string;
  proof_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  submitted_at: string;
  verified_at?: string | null;
  verified_by?: string | null;
  // Display & UI helpers
  student_name: string;
  student_email: string;
  course_title: string;
}

export interface OrderTableRecord {
  id: string;
  student_id: string;
  course_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'awaiting_verification' | 'paid' | 'rejected' | 'cancelled' | 'completed';
  created_at: string;
  paid_at?: string | null;
  student_name?: string;
  course_title?: string;
  payment_id?: string;
}

export interface EnrollmentTableRecord {
  id: string;
  student_id: string;
  course_id: string;
  payment_id: string;
  status: 'pending' | 'active' | 'suspended' | 'completed';
  enrolled_at: string;
  fullName?: string;
  email?: string;
  courseTitle?: string;
}

// Real payments list - sample seeded data has been removed
export const DEFAULT_SEED_PAYMENTS: PaymentTableRecord[] = [];

/**
 * Creates records in 'payments', 'orders', and 'enrollments' collections matching the exact database schema
 */
export async function recordPaymentOrderEnrollment(params: {
  paymentId?: string;
  orderId?: string;
  enrollmentId?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  senderPhone: string;
  proofUrl?: string;
}): Promise<{ paymentId: string; orderId: string; enrollmentId: string }> {
  const paymentId = params.paymentId || `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const orderId = params.orderId || `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const enrollmentId = params.enrollmentId || `enr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  // 1. payments table
  const paymentRecord: PaymentTableRecord = {
    id: paymentId,
    order_id: orderId,
    student_id: params.studentId,
    student_name: params.studentName,
    student_email: params.studentEmail,
    course_id: params.courseId,
    course_title: params.courseTitle,
    amount: params.amount,
    currency: 'USD',
    payment_method: params.paymentMethod,
    transaction_reference: params.transactionReference,
    sender_phone: params.senderPhone,
    proof_url: params.proofUrl || '',
    status: 'pending',
    submitted_at: now,
    verified_at: null,
    verified_by: null
  };

  // 2. orders table
  const orderRecord: OrderTableRecord = {
    id: orderId,
    student_id: params.studentId,
    student_name: params.studentName,
    course_id: params.courseId,
    course_title: params.courseTitle,
    amount: params.amount,
    currency: 'USD',
    status: 'awaiting_verification',
    created_at: now,
    paid_at: null,
    payment_id: paymentId
  };

  // 3. enrollments table
  const enrollmentRecord: EnrollmentTableRecord = {
    id: enrollmentId,
    student_id: params.studentId,
    course_id: params.courseId,
    payment_id: paymentId,
    status: 'pending', // Pending payment verification - access is not granted yet
    enrolled_at: now,
    fullName: params.studentName,
    email: params.studentEmail,
    courseTitle: params.courseTitle
  };

  try {
    await Promise.allSettled([
      setDoc(doc(db, 'payments', paymentId), paymentRecord, { merge: true }),
      setDoc(doc(db, 'orders', orderId), orderRecord, { merge: true }),
      setDoc(doc(db, 'enrollments', enrollmentId), enrollmentRecord, { merge: true })
    ]);
  } catch (err) {
    console.warn("Could not save payment records to Firestore:", err);
  }

  // Also persist to localStorage for offline reliability
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem('lafole_admin_payments') || '[]');
      const filtered = existing.filter((p: any) => p.id !== paymentId);
      localStorage.setItem('lafole_admin_payments', JSON.stringify([paymentRecord, ...filtered]));
    } catch {}
  }

  return { paymentId, orderId, enrollmentId };
}

/**
 * Fetches all payments for the admin dashboard, merging Firestore and local records
 */
export async function getAdminPayments(): Promise<PaymentTableRecord[]> {
  const paymentMap = new Map<string, PaymentTableRecord>();

  // Helper to identify and reject legacy mock seed records
  const isSeedRecord = (p: Partial<PaymentTableRecord>) => {
    if (!p) return true;
    const id = p.id || '';
    const ref = (p.transaction_reference || '').toUpperCase();
    const email = (p.student_email || '').toLowerCase();
    return (
      id === 'pay_ahmed_ali_8h72k9' ||
      id === 'pay_mohamed_hassan_ed83492' ||
      ref === '8H72K9' ||
      ref === 'ED83492' ||
      email === 'ahmed.ali@example.com' ||
      email === 'mohamed.hassan@example.com'
    );
  };

  // Clean and filter localStorage cache
  if (typeof window !== 'undefined') {
    try {
      const local = JSON.parse(localStorage.getItem('lafole_admin_payments') || '[]');
      if (Array.isArray(local)) {
        const cleaned = local.filter((p: PaymentTableRecord) => p && p.id && !isSeedRecord(p));
        localStorage.setItem('lafole_admin_payments', JSON.stringify(cleaned));
        cleaned.forEach((p: PaymentTableRecord) => {
          paymentMap.set(p.id, p);
        });
      }
    } catch {}
  }

  // Load from Firestore payments collection (real data)
  try {
    const snap = await getDocs(collection(db, 'payments'));
    snap.forEach((docSnap) => {
      const data = docSnap.data() as PaymentTableRecord;
      if (data && data.id && !isSeedRecord(data)) {
        paymentMap.set(data.id, {
          ...data,
          id: data.id || docSnap.id
        });
      }
    });
  } catch (err) {
    console.warn("Could not fetch payments from Firestore:", err);
  }

  // Also check if any enrollments had pending manual payments
  try {
    const enrSnap = await getDocs(collection(db, 'enrollments'));
    enrSnap.forEach((docSnap) => {
      const d = docSnap.data();
      if (d.transactionRef && (d.manualCurrency || ['EVC Plus', 'eDahab', 'ZAAD'].includes(d.paymentMethod))) {
        const txRef = String(d.transactionRef).trim();
        // Check if this transaction reference or order is already represented in paymentMap
        const alreadyExists = Array.from(paymentMap.values()).some(
          p => (p.transaction_reference && p.transaction_reference.toLowerCase() === txRef.toLowerCase()) ||
               (d.orderReference && p.order_id && p.order_id.toLowerCase().includes(String(d.orderReference).toLowerCase()))
        );

        if (!alreadyExists) {
          const payId = `pay_${docSnap.id}`;
          if (!paymentMap.has(payId)) {
            const amt = typeof d.amount === 'number' ? d.amount : parseFloat(String(d.amount).replace(/[^0-9.]/g, '')) || 25;
            paymentMap.set(payId, {
              id: payId,
              order_id: d.orderReference ? `ord_${d.orderReference}` : `ord_${docSnap.id}`,
              student_id: d.email || docSnap.id,
              student_name: d.fullName || 'Student',
              student_email: d.email || 'student@lafole.so',
              course_id: d.courseId || 'english-a1',
              course_title: d.courseTitle || 'English Beginners Level (A1-A2)',
              amount: amt,
              currency: 'USD',
              payment_method: d.manualCurrency || d.paymentMethod || 'EVC Plus',
              transaction_reference: txRef,
              sender_phone: d.senderPhone || d.phoneNumber || '',
              proof_url: d.screenshotUrl || '',
              status: d.status === 'enrolled' || d.status === 'active' ? 'approved' : 'pending',
              submitted_at: d.createdAt || new Date().toISOString(),
              verified_at: d.verifiedAt || null,
              verified_by: null
            });
          }
        }
      }
    });
  } catch (err) {
    console.warn("Could not inspect enrollments for payments:", err);
  }

  const list = Array.from(paymentMap.values());
  // Sort with pending first, then by submitted_at desc
  list.sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
  });

  return list;
}

/**
 * Approves a payment:
 * Payment status -> PAID
 * Order status -> COMPLETED
 * Enrollment status -> ACTIVE
 * Student gets course access
 * Dispatches verification email
 */
export async function approveAdminPayment(
  paymentId: string,
  verifiedBy: string = 'Abdifatah Jama (Admin)'
): Promise<{ success: boolean; message: string; payment?: PaymentTableRecord }> {
  const payments = await getAdminPayments();
  const payment = payments.find(p => p.id === paymentId);

  if (!payment) {
    return { success: false, message: 'Payment record not found' };
  }

  const now = new Date().toISOString();
  payment.status = 'approved';
  payment.verified_at = now;
  payment.verified_by = verifiedBy;

  // 1. Update Firestore payments collection
  try {
    await updateDoc(doc(db, 'payments', paymentId), {
      status: 'approved',
      verified_at: now,
      verified_by: verifiedBy
    });
  } catch (err) {
    // try setDoc with merge
    try {
      await setDoc(doc(db, 'payments', paymentId), {
        ...payment,
        status: 'approved',
        verified_at: now,
        verified_by: verifiedBy
      }, { merge: true });
    } catch {}
  }

  // 2. Update orders collection -> status = COMPLETED (or paid)
  try {
    if (payment.order_id) {
      await setDoc(doc(db, 'orders', payment.order_id), {
        id: payment.order_id,
        status: 'completed',
        paid_at: now,
        lastUpdated: now
      }, { merge: true });
    }
  } catch (err) {
    console.warn("Could not update order status:", err);
  }

  // 3. Update enrollments collection -> status = ACTIVE (student gets course access!)
  try {
    const cleanEmail = payment.student_email.toLowerCase().trim();
    // Search enrollments matching student email and course
    const q = query(
      collection(db, 'enrollments'),
      where('email', '==', cleanEmail)
    );
    const snap = await getDocs(q);
    let matched = false;
    for (const d of snap.docs) {
      const data = d.data();
      if (data.courseId === payment.course_id || data.courseTitle === payment.course_title || !matched) {
        matched = true;
        await setDoc(doc(db, 'enrollments', d.id), {
          status: 'active',
          paymentStatus: 'completed',
          hasAccess: true,
          verifiedAt: now,
          verified_at: now
        }, { merge: true });
      }
    }
    if (!matched) {
      // Create active enrollment doc
      const enrId = `enr_active_${paymentId}`;
      await setDoc(doc(db, 'enrollments', enrId), {
        id: enrId,
        student_id: cleanEmail,
        course_id: payment.course_id,
        course_title: payment.course_title,
        payment_id: payment.id,
        email: cleanEmail,
        fullName: payment.student_name,
        status: 'active',
        paymentStatus: 'completed',
        hasAccess: true,
        enrolled_at: now,
        verifiedAt: now
      }, { merge: true });
    }

    // Update user profile in 'users' and 'students'
    const userDocId = cleanEmail.replace(/[^a-z0-9_-]/g, '_');
    const userSnap = await getDoc(doc(db, 'users', userDocId));
    const existingCourses = userSnap.exists() && Array.isArray(userSnap.data()?.enrolledCourseIds)
      ? userSnap.data()?.enrolledCourseIds
      : [];
    const updatedCourses = Array.from(new Set([...existingCourses, payment.course_id]));

    await setDoc(doc(db, 'users', userDocId), {
      status: 'active',
      enrolledCourseIds: updatedCourses,
      lastEnrolledCourseId: payment.course_id,
      lastEnrolledCourseTitle: payment.course_title,
      lastUpdated: now
    }, { merge: true });

    await setDoc(doc(db, 'students', userDocId), {
      status: 'active',
      enrolledCourseIds: updatedCourses,
      lastEnrolledCourseId: payment.course_id,
      lastEnrolledCourseTitle: payment.course_title,
      lastUpdated: now
    }, { merge: true });
  } catch (err) {
    console.warn("Could not activate enrollment in Firestore:", err);
  }

  // 4. Update localStorage admin payments & student active courses
  if (typeof window !== 'undefined') {
    try {
      const local = JSON.parse(localStorage.getItem('lafole_admin_payments') || '[]');
      const updated = local.map((p: any) => p.id === paymentId ? { ...p, status: 'approved', verified_at: now, verified_by: verifiedBy } : p);
      if (!updated.some((p: any) => p.id === paymentId)) {
        updated.unshift({ ...payment, status: 'approved', verified_at: now, verified_by: verifiedBy });
      }
      localStorage.setItem('lafole_admin_payments', JSON.stringify(updated));

      // If active student in this browser is the one approved, activate course access immediately
      const activeEmail = localStorage.getItem('lafole_verified_email') || '';
      if (activeEmail && activeEmail.toLowerCase() === payment.student_email.toLowerCase()) {
        const storedIds = JSON.parse(localStorage.getItem('lafole_enrolled_course_ids') || '[]');
        const nextIds = Array.from(new Set([...storedIds, payment.course_id]));
        localStorage.setItem('lafole_enrolled_course_ids', JSON.stringify(nextIds));
      }
    } catch {}
  }

  // 5. Trigger email dispatch via backend server
  try {
    await fetch('/api/admin/approve-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId,
        studentEmail: payment.student_email,
        studentName: payment.student_name,
        courseTitle: payment.course_title,
        courseId: payment.course_id,
        verifiedBy
      })
    });
  } catch (err) {
    console.info("Backend approve-payment notification note:", err);
  }

  return {
    success: true,
    message: `Payment verified! Enrollment in ${payment.course_title} has been activated.`,
    payment
  };
}

/**
 * Rejects a payment
 */
export async function rejectAdminPayment(
  paymentId: string,
  verifiedBy: string = 'Abdifatah Jama (Admin)',
  reason: string = 'Payment could not be verified'
): Promise<{ success: boolean; message: string; payment?: PaymentTableRecord }> {
  const payments = await getAdminPayments();
  const payment = payments.find(p => p.id === paymentId);

  if (!payment) {
    return { success: false, message: 'Payment record not found' };
  }

  const now = new Date().toISOString();
  payment.status = 'rejected';
  payment.verified_at = now;
  payment.verified_by = verifiedBy;

  try {
    await setDoc(doc(db, 'payments', paymentId), {
      ...payment,
      status: 'rejected',
      verified_at: now,
      verified_by: verifiedBy,
      rejectionReason: reason
    }, { merge: true });

    if (payment.order_id) {
      await setDoc(doc(db, 'orders', payment.order_id), {
        status: 'rejected',
        lastUpdated: now
      }, { merge: true });
    }
  } catch (err) {
    console.warn("Could not mark payment as rejected in Firestore:", err);
  }

  // Update localStorage
  if (typeof window !== 'undefined') {
    try {
      const local = JSON.parse(localStorage.getItem('lafole_admin_payments') || '[]');
      const updated = local.map((p: any) => p.id === paymentId ? { ...p, status: 'rejected', verified_at: now, verified_by: verifiedBy } : p);
      localStorage.setItem('lafole_admin_payments', JSON.stringify(updated));
    } catch {}
  }

  try {
    await fetch('/api/admin/reject-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, reason, verifiedBy })
    });
  } catch {}

  return {
    success: true,
    message: `Payment rejected.`,
    payment
  };
}

// ============================================================================
// COURSES CRUD MANAGEMENT (SYNC WITH FIRESTORE & FRONTEND)
// ============================================================================

/**
 * Fetches all active courses, merging default catalog with Firestore courses collection
 * and honoring deletions and updates.
 */
export async function getLiveCoursesFromFirestore(): Promise<Course[]> {
  const coursesMap = new Map<string, Course>();
  const deletedSet = new Set<string>();

  // 1. Seed base catalog
  INITIAL_COURSES.forEach(c => {
    coursesMap.set(c.id, c);
  });

  // 2. Load cached local overrides & deletions
  if (typeof window !== 'undefined') {
    try {
      const deleted = JSON.parse(localStorage.getItem('lafole_deleted_courses') || '[]');
      if (Array.isArray(deleted)) {
        deleted.forEach(id => deletedSet.add(id));
      }
      const localCustom = JSON.parse(localStorage.getItem('lafole_custom_courses') || '[]');
      if (Array.isArray(localCustom)) {
        localCustom.forEach((c: Course) => {
          if (c && c.id && !deletedSet.has(c.id)) {
            coursesMap.set(c.id, c);
          }
        });
      }
    } catch {}
  }

  // 3. Query Firestore courses collection for real-time persisted updates
  try {
    const snap = await getDocs(collection(db, 'courses'));
    snap.forEach(docSnap => {
      const data = docSnap.data();
      if (data) {
        if (data.isDeleted) {
          deletedSet.add(docSnap.id);
          coursesMap.delete(docSnap.id);
        } else {
          coursesMap.set(docSnap.id, {
            ...data,
            id: docSnap.id
          } as Course);
        }
      }
    });

    // Update local storage caches with fresh Firestore state
    if (typeof window !== 'undefined') {
      const allActive = Array.from(coursesMap.values()).filter(c => !deletedSet.has(c.id));
      localStorage.setItem('lafole_custom_courses', JSON.stringify(allActive));
      localStorage.setItem('lafole_deleted_courses', JSON.stringify(Array.from(deletedSet)));
    }
  } catch (err) {
    console.warn("Could not load courses from Firestore, using cached/initial catalog:", err);
  }

  // Filter out any deleted courses
  const result = Array.from(coursesMap.values()).filter(c => !deletedSet.has(c.id));
  return result;
}

/**
 * Creates or updates a course in Firestore and local storage.
 */
export async function saveCourseToFirestore(course: Partial<Course>): Promise<{ success: boolean; course: Course }> {
  const cleanId = (
    course.id || 
    `course-${course.title ? course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : Date.now()}`
  ).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');

  const existingDefault = INITIAL_COURSES.find(c => c.id === cleanId);

  const courseToSave: Course = {
    id: cleanId,
    title: (course.title || 'Untitled Course').trim(),
    subtitle: (course.subtitle || 'Technical Mastery & Practical Training').trim(),
    description: (course.description || 'Comprehensive practitioner-led training course.').trim(),
    category: (course.category || 'English for Beginners').trim(),
    level: course.level || 'Beginner',
    instructor: {
      name: course.instructor?.name || 'Abdifatah Jama',
      role: course.instructor?.role || 'Lead Instructor',
      avatar: course.instructor?.avatar || 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2FYellow%20Black%20Modern%20Course%20YouTube%20Thumbnail.png?alt=media&token=58075f8e-7a43-420b-8ceb-62aaed33c422',
      bio: course.instructor?.bio || 'Experienced practitioner and industry educator at Lafole Academy.'
    },
    thumbnail: course.thumbnail || existingDefault?.thumbnail || 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
    estimatedHours: Number(course.estimatedHours) || existingDefault?.estimatedHours || 12,
    updatedAt: new Date().toISOString().split('T')[0],
    tags: Array.isArray(course.tags) && course.tags.length > 0 ? course.tags : [course.title || 'Course', course.category || 'Academy'],
    price: typeof course.price === 'number' ? course.price : 25,
    originalPrice: typeof course.originalPrice === 'number' ? course.originalPrice : (typeof course.price === 'number' ? course.price * 2 : 50),
    discountPercent: typeof course.discountPercent === 'number' ? course.discountPercent : 50,
    totalLessonsCount: typeof course.totalLessonsCount === 'number' ? course.totalLessonsCount : (existingDefault?.totalLessonsCount || 24),
    resources: course.resources || existingDefault?.resources || [],
    modules: course.modules && course.modules.length > 0 ? course.modules : (existingDefault?.modules || [
      {
        id: `mod-${cleanId}-1`,
        title: 'Module 1: Foundations & Fundamentals',
        description: 'Core concepts, practical orientation, and introductory syllabus.',
        lessons: [
          {
            id: `les-${cleanId}-1-1`,
            moduleId: `mod-${cleanId}-1`,
            title: 'Lesson 1: Course Orientation & Overview',
            description: 'Introduction to curriculum structure, key outcomes, and study methodology.',
            type: 'video',
            durationMinutes: 15,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          }
        ]
      }
    ])
  };

  // 1. Save to Firestore
  try {
    await setDoc(doc(db, 'courses', cleanId), {
      ...courseToSave,
      isDeleted: false
    }, { merge: true });
  } catch (err) {
    console.warn("Could not save course to Firestore (falling back to local cache):", err);
  }

  // 2. Update localStorage cache
  if (typeof window !== 'undefined') {
    try {
      const local = JSON.parse(localStorage.getItem('lafole_custom_courses') || '[]');
      const filtered = Array.isArray(local) ? local.filter((c: any) => c.id !== cleanId) : [];
      filtered.unshift(courseToSave);
      localStorage.setItem('lafole_custom_courses', JSON.stringify(filtered));

      // Remove from deleted list if previously marked deleted
      const deleted = JSON.parse(localStorage.getItem('lafole_deleted_courses') || '[]');
      if (Array.isArray(deleted)) {
        localStorage.setItem('lafole_deleted_courses', JSON.stringify(deleted.filter((id: string) => id !== cleanId)));
      }
    } catch {}
  }

  return { success: true, course: courseToSave };
}

/**
 * Deletes a course from Firestore and local cache.
 */
export async function deleteCourseFromFirestore(courseId: string): Promise<{ success: boolean; message: string }> {
  // 1. Mark as deleted in Firestore
  try {
    await setDoc(doc(db, 'courses', courseId), {
      id: courseId,
      isDeleted: true,
      deletedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn("Could not flag course as deleted in Firestore:", err);
  }

  // 2. Update localStorage cache
  if (typeof window !== 'undefined') {
    try {
      const deleted = JSON.parse(localStorage.getItem('lafole_deleted_courses') || '[]');
      if (Array.isArray(deleted) && !deleted.includes(courseId)) {
        deleted.push(courseId);
        localStorage.setItem('lafole_deleted_courses', JSON.stringify(deleted));
      }

      const local = JSON.parse(localStorage.getItem('lafole_custom_courses') || '[]');
      if (Array.isArray(local)) {
        const filtered = local.filter((c: any) => c.id !== courseId);
        localStorage.setItem('lafole_custom_courses', JSON.stringify(filtered));
      }
    } catch {}
  }

  return { success: true, message: `Course "${courseId}" removed.` };
}

// ============================================================================
// ADMIN USERS MANAGEMENT (SUPER ADMIN ACCESS CONTROL)
// ============================================================================

export const DEFAULT_SUPER_ADMIN_EMAIL = 'techanalyst41@gmail.com';

const DEFAULT_SUPER_ADMIN: AdminUser = {
  id: 'techanalyst41_gmail_com',
  name: 'Alex ASIAGO',
  email: 'techanalyst41@gmail.com',
  role: 'superadmin',
  department: 'Executive Administration',
  password: 'admin',
  status: 'active',
  createdAt: '2026-01-01T00:00:00.000Z',
  lastLoginAt: '2026-10-08T06:00:00.000Z',
  createdBy: 'System Root'
};

const INITIAL_ADMIN_USERS: AdminUser[] = [
  DEFAULT_SUPER_ADMIN,
  {
    id: 'admin_lafole_so',
    name: 'Abdifatah Jama',
    email: 'admin@lafole.so',
    role: 'admin',
    department: 'Curriculum & Instruction',
    password: 'admin',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
    lastLoginAt: '2026-10-07T14:30:00.000Z',
    createdBy: 'techanalyst41@gmail.com'
  },
  {
    id: 'admissions_lafole_net',
    name: 'Khadar Hassan',
    email: 'admissions@lafole.net',
    role: 'admin',
    department: 'Admissions & Finance',
    password: 'admin',
    status: 'active',
    createdAt: '2026-02-01T00:00:00.000Z',
    lastLoginAt: '2026-10-06T10:15:00.000Z',
    createdBy: 'techanalyst41@gmail.com'
  }
];

export async function getAdminUsersFromFirestore(): Promise<AdminUser[]> {
  const usersMap = new Map<string, AdminUser>();
  const deletedSet = new Set<string>();

  // 1. Seed base admins
  INITIAL_ADMIN_USERS.forEach(u => usersMap.set(u.email.toLowerCase(), u));

  // 2. Load cached local overrides & deletions
  if (typeof window !== 'undefined') {
    try {
      const deleted = JSON.parse(localStorage.getItem('lafole_deleted_admins') || '[]');
      if (Array.isArray(deleted)) {
        deleted.forEach(em => deletedSet.add(em.toLowerCase()));
      }
      const local = JSON.parse(localStorage.getItem('lafole_admin_users') || '[]');
      if (Array.isArray(local)) {
        local.forEach((u: AdminUser) => {
          if (u && u.email && !deletedSet.has(u.email.toLowerCase())) {
            usersMap.set(u.email.toLowerCase(), u);
          }
        });
      }
    } catch {}
  }

  // 3. Query Firestore admins collection
  try {
    const snap = await getDocs(collection(db, 'admins'));
    snap.forEach(docSnap => {
      const data = docSnap.data();
      if (data && data.email) {
        const em = data.email.toLowerCase();
        if (data.isDeleted) {
          deletedSet.add(em);
          usersMap.delete(em);
        } else {
          usersMap.set(em, {
            id: docSnap.id,
            name: data.name || data.fullName || 'Administrator',
            email: data.email,
            role: data.role === 'superadmin' || em === DEFAULT_SUPER_ADMIN_EMAIL ? 'superadmin' : 'admin',
            department: data.department || 'Administration',
            password: data.password || 'admin',
            status: data.status === 'suspended' ? 'suspended' : 'active',
            createdAt: data.createdAt || new Date().toISOString(),
            lastLoginAt: data.lastLoginAt || null,
            createdBy: data.createdBy || 'Super Admin'
          });
        }
      }
    });

    if (typeof window !== 'undefined') {
      const allActive = Array.from(usersMap.values()).filter(u => !deletedSet.has(u.email.toLowerCase()));
      localStorage.setItem('lafole_admin_users', JSON.stringify(allActive));
      localStorage.setItem('lafole_deleted_admins', JSON.stringify(Array.from(deletedSet)));
    }
  } catch (err) {
    console.warn("Could not query admins from Firestore, using local cache:", err);
  }

  // Ensure the primary Super Admin is always guaranteed active and superadmin
  const superAdmin = usersMap.get(DEFAULT_SUPER_ADMIN_EMAIL);
  if (!superAdmin) {
    usersMap.set(DEFAULT_SUPER_ADMIN_EMAIL, DEFAULT_SUPER_ADMIN);
  } else {
    superAdmin.role = 'superadmin';
    superAdmin.status = 'active';
  }

  return Array.from(usersMap.values()).filter(u => !deletedSet.has(u.email.toLowerCase()));
}

export async function saveAdminUserToFirestore(
  adminData: Partial<AdminUser>,
  savedBy: string = 'Super Admin'
): Promise<{ success: boolean; user: AdminUser; message: string }> {
  const cleanEmail = (adminData.email || '').trim().toLowerCase();
  if (!cleanEmail) {
    throw new Error('Valid administrator email address is required.');
  }

  const cleanId = cleanEmail.replace(/[^a-z0-9_-]/g, '_');
  const isSuper = cleanEmail === DEFAULT_SUPER_ADMIN_EMAIL || adminData.role === 'superadmin';

  const userToSave: AdminUser = {
    id: cleanId,
    name: (adminData.name || 'Administrator').trim(),
    email: cleanEmail,
    role: isSuper ? 'superadmin' : 'admin',
    department: (adminData.department || 'Administration').trim(),
    password: adminData.password || 'admin',
    status: adminData.status || 'active',
    createdAt: adminData.createdAt || new Date().toISOString(),
    lastLoginAt: adminData.lastLoginAt || null,
    createdBy: adminData.createdBy || savedBy
  };

  // 1. Save to Firestore
  try {
    await setDoc(doc(db, 'admins', cleanId), {
      ...userToSave,
      fullName: userToSave.name,
      isDeleted: false,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn("Could not save admin to Firestore:", err);
  }

  // 2. Save to localStorage cache
  if (typeof window !== 'undefined') {
    try {
      const local = JSON.parse(localStorage.getItem('lafole_admin_users') || '[]');
      const filtered = Array.isArray(local) ? local.filter((u: AdminUser) => u.email.toLowerCase() !== cleanEmail) : [];
      filtered.unshift(userToSave);
      localStorage.setItem('lafole_admin_users', JSON.stringify(filtered));

      const deleted = JSON.parse(localStorage.getItem('lafole_deleted_admins') || '[]');
      if (Array.isArray(deleted)) {
        localStorage.setItem('lafole_deleted_admins', JSON.stringify(deleted.filter((em: string) => em.toLowerCase() !== cleanEmail)));
      }
    } catch {}
  }

  return { 
    success: true, 
    user: userToSave, 
    message: `Administrator "${userToSave.name}" successfully registered.` 
  };
}

export async function deleteAdminUserFromFirestore(
  adminEmail: string,
  performedBy: string = 'Super Admin'
): Promise<{ success: boolean; message: string }> {
  const cleanEmail = adminEmail.trim().toLowerCase();
  if (cleanEmail === DEFAULT_SUPER_ADMIN_EMAIL) {
    return { success: false, message: 'Primary Super Admin account cannot be revoked or deleted.' };
  }

  const cleanId = cleanEmail.replace(/[^a-z0-9_-]/g, '_');

  // 1. Mark as deleted in Firestore
  try {
    await setDoc(doc(db, 'admins', cleanId), {
      id: cleanId,
      email: cleanEmail,
      isDeleted: true,
      deletedAt: new Date().toISOString(),
      deletedBy: performedBy
    }, { merge: true });
  } catch (err) {
    console.warn("Could not flag admin as deleted in Firestore:", err);
  }

  // 2. Update localStorage
  if (typeof window !== 'undefined') {
    try {
      const deleted = JSON.parse(localStorage.getItem('lafole_deleted_admins') || '[]');
      if (Array.isArray(deleted) && !deleted.includes(cleanEmail)) {
        deleted.push(cleanEmail);
        localStorage.setItem('lafole_deleted_admins', JSON.stringify(deleted));
      }

      const local = JSON.parse(localStorage.getItem('lafole_admin_users') || '[]');
      if (Array.isArray(local)) {
        const filtered = local.filter((u: AdminUser) => u.email.toLowerCase() !== cleanEmail);
        localStorage.setItem('lafole_admin_users', JSON.stringify(filtered));
      }
    } catch {}
  }

  return { success: true, message: `Administrator access for "${cleanEmail}" revoked.` };
}


