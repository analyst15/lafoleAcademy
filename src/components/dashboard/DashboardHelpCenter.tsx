import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  User, 
  Video, 
  CreditCard, 
  Mail, 
  MessageSquare, 
  Phone, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { DashboardTab } from './DashboardLayout';

interface DashboardHelpCenterProps {
  onNavigateTab?: (tab: DashboardTab) => void;
}

export const DashboardHelpCenter: React.FC<DashboardHelpCenterProps> = ({
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0); // First item open by default matching screenshot

  const categories: {
    id: string;
    icon: React.ElementType;
    title: string;
    desc: string;
    targetTab: DashboardTab;
    path: string;
  }[] = [
    {
      id: 'getting-started',
      icon: BookOpen,
      title: 'Getting started',
      desc: 'How to enrol, find your dashboard, and resume a lesson.',
      targetTab: 'dashboard',
      path: '/dashboard'
    },
    {
      id: 'account',
      icon: User,
      title: 'Account & profile',
      desc: 'Update your name, email, avatar, and notification preferences.',
      targetTab: 'settings',
      path: '/dashboard/settings'
    },
    {
      id: 'courses',
      icon: Video,
      title: 'Taking courses',
      desc: 'Lesson player, quizzes, and certificate flow.',
      targetTab: 'mylearning',
      path: '/dashboard/mylearning'
    },
    {
      id: 'billing',
      icon: CreditCard,
      title: 'Billing & payments',
      desc: 'Invoices, receipts, installments, and refund policy.',
      targetTab: 'payments',
      path: '/dashboard/payments'
    }
  ];

  const handleCategoryClick = (cat: typeof categories[0]) => {
    if (onNavigateTab) {
      onNavigateTab(cat.targetTab);
    } else if (typeof window !== 'undefined') {
      window.location.href = cat.path;
    }
  };

  const faqs = [
    {
      q: 'How do I reset my password?',
      a: "On the login page, click 'Forgot password' and follow the instructions in the email we send you. Reset links expire after 1 hour."
    },
    {
      q: 'How do I get a certificate?',
      a: 'Once you complete 100% of all lessons in a course and score at least 80% on the quiz assessments, your official verifiable certificate will automatically be generated in your My Certificates tab.'
    },
    {
      q: 'Can I download videos offline?',
      a: 'Lectures are streamed in 1080p high definition directly in your classroom player. All accompanying lab topologies (.pkt), automation code (.py), and cheat sheets can be downloaded for permanent offline access.'
    },
    {
      q: 'What is the refund policy?',
      a: 'We offer a straightforward 7-day money back guarantee if you find a course is not suited to your career learning goals.'
    },
    {
      q: 'How do installment plans work?',
      a: 'Our diploma career tracks allow you to split your tuition into 3 equal monthly installments. Curriculum modules unlock sequentially as each payment is confirmed.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We support Visa, MasterCard, American Express, UnionPay, and East African mobile money including EVC Plus, ZAAD, eDahab, eBirr, and Xawaalad.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl font-geist">
      {/* Header matching Help_Center.png */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="text-[11px] font-black uppercase tracking-wider text-[#22C55E] mb-1">
          HELP & SUPPORT
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find an answer, or ask a human.
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Browse the categories below, search the FAQ, or reach a real person via email, WhatsApp, or phone.
        </p>

        {/* Search Input Bar */}
        <div className="relative mt-4 max-w-xl">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords: password, certificates, EVC Plus, refund..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[14px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#22C55E] shadow-2xs font-geist"
          />
        </div>
      </div>

      {/* BROWSE BY CATEGORY matching Help_Center.png */}
      <div className="space-y-3">
        <div className="text-[12px] font-black uppercase tracking-wider text-slate-400">
          BROWSE BY CATEGORY
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="group p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-start justify-start h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-[#22C55E]/70 dark:hover:border-[#22C55E]/70 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EFF9F0] dark:bg-emerald-950/40 flex items-center justify-center text-[#22C55E] group-hover:bg-[#22C55E]/20 transition-colors flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#22C55E]" strokeWidth={1.8} />
                </div>
                <div className="mt-4 flex-1 flex flex-col justify-start">
                  <h3 className="font-geist text-[17px] font-[500] text-slate-900 dark:text-white group-hover:text-[#22C55E] transition-colors leading-snug">
                    {cat.title}
                  </h3>
                  <p className="font-geist text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Frequently Asked (Left) & Talk to Us (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        
        {/* Left Column: FREQUENTLY ASKED */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-[12px] font-black uppercase tracking-wider text-slate-400 mb-2">
            FREQUENTLY ASKED
          </div>

          <div className="space-y-2.5">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4.5 text-left flex items-center justify-between text-[14px] sm:text-[15px] font-medium text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white cursor-pointer font-geist"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4.5 h-4.5 text-slate-400 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4.5 h-4.5 text-slate-400 flex-shrink-0 ml-2" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4.5 pb-4.5 pt-1 text-[13.5px] sm:text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30 font-geist">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: TALK TO US matching Help_Center.png */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[12px] font-black uppercase tracking-wider text-slate-400 mb-2">
            TALK TO US
          </div>

          <div className="space-y-3">
            {/* Email */}
            <a
              href="mailto:info@lafole.net"
              className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#22C55E] flex items-center justify-between group transition-all shadow-2xs block"
            >
              <div className="space-y-1">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  EMAIL
                </div>
                <div className="text-[14px] font-medium text-slate-900 dark:text-white font-mono">
                  info@lafole.net
                </div>
              </div>
              <ArrowRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-[#22C55E] group-hover:translate-x-1 transition-all" />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/2526192909900"
              target="_blank"
              rel="noreferrer"
              className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#22C55E] flex items-center justify-between group transition-all shadow-2xs block"
            >
              <div className="space-y-1">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#22C55E]">
                  WHATSAPP
                </div>
                <div className="text-[14px] font-medium text-slate-900 dark:text-white font-mono">
                  +252 61 92909900
                </div>
              </div>
              <ArrowRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-[#22C55E] group-hover:translate-x-1 transition-all" />
            </a>

            {/* Call Us */}
            <a
              href="tel:+2526192909900"
              className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#22C55E] flex items-center justify-between group transition-all shadow-2xs block"
            >
              <div className="space-y-1">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  CALL US
                </div>
                <div className="text-[14px] font-medium text-slate-900 dark:text-white font-mono">
                  +252 61 92909900
                </div>
              </div>
              <ArrowRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-[#22C55E] group-hover:translate-x-1 transition-all" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
