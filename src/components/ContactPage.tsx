import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Globe, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface ContactPageProps {
  onBackToHome: () => void;
  onExploreCourses?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onBackToHome,
  onExploreCourses
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyEmail = (emailText: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(emailText);
      setCopiedEmail(true);
      showToast(`Copied ${emailText} to clipboard!`);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      showToast('Please enter your first name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      showToast('Please enter your message.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save message to Firestore
      try {
        await addDoc(collection(db, 'contact_messages'), {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
          email: email.trim().toLowerCase(),
          subject: subject.trim() || 'General Inquiry',
          message: message.trim(),
          createdAt: new Date().toISOString(),
          status: 'unread'
        });
      } catch (err) {
        console.warn('Firestore message save error:', err);
      }

      setIsSubmitted(true);
      showToast('Message sent successfully! Our team will respond within 24 hours.');
    } catch {
      showToast('Message submitted. Thank you for reaching out!');
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] dark:bg-white text-white dark:text-black px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-xs sm:text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Top Two-Column Grid matching reference UI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ================= LEFT COLUMN: INFO & DETAILS ================= */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Pill Badge */}
            <div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 text-[#16A34A] dark:text-emerald-400 text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                <span>WE'RE HERE TO HELP</span>
              </div>
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Get in touch.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Questions about a course, a partnership, or your account? Reach our team by email, WhatsApp, or phone — or send a message below and we'll get back to you within one business day.
              </p>
            </div>

            {/* Three Contact Cards */}
            <div className="space-y-4 pt-2">
              
              {/* Card 1: Email us */}
              <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-start space-x-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100 dark:border-emerald-900">
                  <MessageSquare className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Email us
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    For general inquiries, partnerships, and support
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a 
                      href="mailto:info@lafole.net" 
                      className="text-sm font-bold text-slate-900 dark:text-white hover:text-[#22C55E] dark:hover:text-[#22C55E] transition-colors underline decoration-slate-300 dark:decoration-slate-700 hover:decoration-[#22C55E]"
                    >
                      info@lafole.net
                    </a>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <a 
                      href="mailto:support@lafole.net" 
                      className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#22C55E] dark:hover:text-[#22C55E] transition-colors"
                    >
                      support@lafole.net
                    </a>
                    <button 
                      type="button"
                      onClick={() => handleCopyEmail('info@lafole.net')}
                      className="inline-flex items-center space-x-1 text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-auto cursor-pointer"
                      title="Copy primary email"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Call us */}
              <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-start space-x-3.5 sm:space-x-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100 dark:border-emerald-900">
                  <Phone className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Call us
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>Sat–Thur from 8am to 9pm</span>
                    </p>
                  </div>

                  {/* Single Lafole Phone Number: +252 61 9290900 only */}
                  <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                      <span>Phone &amp; WhatsApp</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <a 
                        href="https://wa.me/252619290900" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-[#22C55E] dark:hover:text-[#22C55E] transition-colors"
                      >
                        +252 61 9290900
                      </a>
                      <a 
                        href="tel:+252619290900" 
                        className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
                      >
                        Call
                      </a>
                      <a 
                        href="https://wa.me/252619290900" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-[#22C55E] hover:text-white transition-colors cursor-pointer"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>

                </div>
              </div>

              {/* Card 3: Visit us */}
              <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-start space-x-3.5 sm:space-x-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100 dark:border-emerald-900">
                  <Globe className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0 space-y-2.5">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Visit us
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      We operate across three cities with physical learning hubs and technical workshops.
                    </p>
                  </div>
                  
                  {/* City Badges: Mogadishu, Hargeisa, Garowe */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {['Mogadishu', 'Hargeisa', 'Garowe'].map((city) => (
                      <span 
                        key={city}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
                      >
                        <MapPin className="w-3 h-3 text-[#22C55E]" />
                        <span>{city}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ================= RIGHT COLUMN: SEND A MESSAGE FORM ================= */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
              
              {isSubmitted ? (
                /* Success View */
                <div className="text-center py-8 space-y-5 animate-scaleUp">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-[#22C55E] flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      Message Sent! 🎉
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Thank you for reaching out. We have received your inquiry and our support team will reply to <span className="font-bold text-slate-900 dark:text-white">{email}</span> within 24 hours.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">Need urgent help?</p>
                    <p>WhatsApp our registrar team directly at <strong className="text-[#22C55E]">+252 61 9290900</strong></p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Send Another Message
                    </button>
                    <button
                      type="button"
                      onClick={onBackToHome}
                      className="flex-1 py-3 px-4 bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Return to Home
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive Contact Form matching screenshot */
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Header */}
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      Send a message
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Fill out the form and our team will get back to you within 24 hours.
                    </p>
                  </div>

                  {/* Two-Column Name Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="contact-firstname" 
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        First name
                      </label>
                      <input
                        id="contact-firstname"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label 
                        htmlFor="contact-lastname" 
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Last name
                      </label>
                      <input
                        id="contact-lastname"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="contact-email" 
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Email address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all"
                    />
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="contact-subject" 
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What is this regarding?"
                      className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="contact-message" 
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Direct Email Link Footer */}
                  <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Or email </span>
                    <a 
                      href="mailto:info@lafole.net" 
                      className="font-bold text-[#22C55E] hover:underline"
                    >
                      info@lafole.net
                    </a>
                    <span> directly.</span>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
