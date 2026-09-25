/**
 * User verification and profile initials utility
 */

export interface VerifiedUserSession {
  email: string;
  fullName?: string;
  initials: string;
  isVerified: boolean;
  verifiedAt?: string;
}

/**
 * Extracts clean 2-letter uppercase initials from an email address or student name.
 * Examples:
 * - "techanalyst41@gmail.com" -> "TA"
 * - "nimo.noor@lafole.so" -> "NN"
 * - "nasra_nur@gmail.com" -> "NN"
 * - "john.doe@example.com" -> "JD"
 * - "alex.chen@lafole.so" -> "AC"
 * - "student@gmail.com" -> "ST"
 */
export function getEmailInitials(email?: string, name?: string): string {
  // If user provided a multi-word display name, use it first
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (parts.length === 1 && parts[0].length >= 2) {
      return parts[0].substring(0, 2).toUpperCase();
    }
  }

  if (!email || !email.trim()) return 'NN';

  const clean = email.trim().toLowerCase();
  const username = clean.split('@')[0] || '';

  // 1. Delimited names: e.g. "nimo.noor", "tech_analyst", "john-doe", "ali+work"
  const segments = username.split(/[._+-]+/).filter(Boolean);
  if (segments.length >= 2) {
    const first = segments[0].replace(/[^a-zA-Z]/g, '');
    const second = segments[1].replace(/[^a-zA-Z]/g, '');
    if (first && second) {
      return (first[0] + second[0]).toUpperCase();
    }
  }

  // 2. Compound words with common prefixes: e.g. "techanalyst" -> T + A
  const compoundMatch = username.match(/^(tech|data|cyber|cloud|web|full|sys|net|info|soft|dev|code)(.*)$/i);
  if (compoundMatch && compoundMatch[2]) {
    const p1 = compoundMatch[1];
    const p2 = compoundMatch[2].replace(/[^a-zA-Z]/g, '');
    if (p2.length >= 1) {
      return (p1[0] + p2[0]).toUpperCase();
    }
  }

  // 3. Letters from username
  const lettersOnly = username.replace(/[^a-zA-Z]/g, '');
  if (lettersOnly.length >= 2) {
    return lettersOnly.substring(0, 2).toUpperCase();
  }

  if (lettersOnly.length === 1) {
    return (lettersOnly + 'N').toUpperCase();
  }

  return 'NN';
}

/**
 * Reads verified user status from local storage
 */
export function getStoredVerifiedUser(): VerifiedUserSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const isVerified = localStorage.getItem('lafole_email_verified') === 'true';
    const email = localStorage.getItem('lafole_verified_email') || '';
    const fullName = localStorage.getItem('lafole_verified_fullname') || '';

    if (isVerified && email) {
      return {
        email,
        fullName,
        initials: getEmailInitials(email, fullName),
        isVerified: true
      };
    }

    // Fallback to last_lafole_enrollment
    const lastEnrollment = localStorage.getItem('last_lafole_enrollment');
    if (lastEnrollment) {
      const parsed = JSON.parse(lastEnrollment);
      if (parsed.emailVerified && parsed.email) {
        return {
          email: parsed.email,
          fullName: parsed.fullName || '',
          initials: getEmailInitials(parsed.email, parsed.fullName),
          isVerified: true
        };
      }
    }
  } catch (err) {
    console.error('Error reading verified user from storage:', err);
  }

  return null;
}
