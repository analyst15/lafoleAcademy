import React, { useEffect } from 'react';
import { Award, CheckCircle, Download, Printer, X, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, StudentProfile, CourseProgress } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  studentProfile: StudentProfile;
  courseProgress: CourseProgress;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  course,
  studentProfile,
  courseProgress
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const issueDate = courseProgress.certificateIssuedAt 
    ? new Date(courseProgress.certificateIssuedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const certificateId = `CP-CERT-${course.id.slice(-6).toUpperCase()}-98421`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 max-w-3xl w-full rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scaleUp">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Official Verifiable Credential</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Printable area) */}
        <div id="printable-certificate" className="p-8 sm:p-12 text-center bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 relative">
          {/* Decorative Framing Border */}
          <div className="border-4 border-double border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-6 sm:p-10 relative space-y-6">
            {/* Top Emblem */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/25">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
                CoursePulse Learning Management Institute
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
                Certificate of Mastery & Completion
              </h1>
              <p className="text-xs text-slate-400">
                This document certifies that
              </p>
            </div>

            {/* Recipient Name */}
            <div className="py-2 border-b-2 border-slate-300 dark:border-slate-700 max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-indigo-950 dark:text-indigo-200 tracking-wide">
                {studentProfile.name}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              has satisfactorily completed all required video instructional hours, automated progress milestones, and technical assessments for the professional specialization in
            </p>

            {/* Course Title */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {course.title}
            </h3>

            {/* Verification Metadata and Signatures */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-left">
              <div className="space-y-1">
                <div className="font-serif italic text-base text-slate-800 dark:text-slate-200">
                  {course.instructor.name}
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {course.instructor.role}
                </div>
                <div className="text-[10px] text-slate-400">Lead Course Instructor</div>
              </div>

              <div className="space-y-1 text-right">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Date Issued: {issueDate}
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  ID: {certificateId}
                </div>
                <div className="inline-flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Shield className="w-3 h-3 mr-0.5 inline" /> Automated Verified LMS Record
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
