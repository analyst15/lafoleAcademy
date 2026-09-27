import React, { useState } from 'react';
import { Award, ArrowRight, ShieldCheck, Download, ExternalLink, Check, Copy } from 'lucide-react';
import { Course, CourseProgress } from '../../types';
import { formatStudentDisplayName } from '../../utils/userUtils';

interface DashboardCertificatesProps {
  enrolledCourses: Course[];
  courseProgressMap: Record<string, CourseProgress>;
  userName: string;
  onBrowseCourses: () => void;
  onOpenCertificateModal: (course: Course) => void;
}

export const DashboardCertificates: React.FC<DashboardCertificatesProps> = ({
  enrolledCourses,
  courseProgressMap,
  userName,
  onBrowseCourses,
  onOpenCertificateModal
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter completed courses with certificates
  const certifiedCourses = enrolledCourses.filter(course => {
    const prog = courseProgressMap[course.id];
    return prog?.isCertificateUnlocked || (prog?.percentComplete || 0) >= 100;
  });

  const handleCopyLink = (courseId: string) => {
    const verifyUrl = `https://verify.lafole.edu.so/cert/LAF-2026-${courseId.toUpperCase().slice(0, 8)}`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(verifyUrl);
      setCopiedId(courseId);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-[20px] sm:text-[22px] font-[600] uppercase tracking-tight text-slate-900 dark:text-white">
          MY CERTIFICATES
        </h1>
        <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Industry-recognized, cryptographically verifiable certificates with unique serial numbers.
        </p>
      </div>

      {certifiedCourses.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {certifiedCourses.map(course => {
              const certId = `LAF-2026-${course.id.toUpperCase().slice(0, 6)}`;
              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#22C55E] flex-shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-[600] uppercase tracking-wider text-[#22C55E] bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                          Official Certificate
                        </span>
                        <h3 className="font-[500] text-[17px] text-slate-900 dark:text-white mt-1 line-clamp-1 leading-snug">
                          {course.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-[13.5px] text-slate-600 dark:text-slate-300 font-[400]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Recipient:</span>
                      <span className="font-[500] text-slate-800 dark:text-slate-200">{formatStudentDisplayName(userName)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Credential ID:</span>
                      <span className="font-mono font-[600] text-[#22C55E]">{certId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Verification URL:</span>
                      <span className="text-slate-500 truncate max-w-[170px]">verify.lafole.edu.so/cert/...</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onOpenCertificateModal(course)}
                      className="flex-1 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-[14px] font-[500] transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>View & Download</span>
                    </button>

                    <button
                      onClick={() => handleCopyLink(course.id)}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-[13.5px] font-[500] flex items-center space-x-1.5 transition-colors cursor-pointer"
                      title="Copy Verification Link"
                    >
                      {copiedId === course.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Verify</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State Matching Screenshot */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 sm:p-14 text-center space-y-4 shadow-xs max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mx-auto flex items-center justify-center text-[#22C55E]">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-[17px] sm:text-[18px] font-[600] text-slate-900 dark:text-white">
              No certificates yet.
            </h2>
            <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 leading-relaxed">
              Finish a course or diploma and your verifiable certificate appears here. Each one gets a unique verify URL anyone can check at <span className="font-mono text-emerald-600 dark:text-emerald-400">verify.lafole.edu.so</span>.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onBrowseCourses}
              className="px-6 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[14px] font-[500] rounded-xl shadow-xs transition-all inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Explore courses to get certified</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
