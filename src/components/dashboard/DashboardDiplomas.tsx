import React from 'react';
import { Award, ArrowRight, Layers, CheckCircle2, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface DashboardDiplomasProps {
  onExploreDiplomas: () => void;
  onBrowseCourses: () => void;
}

export const DashboardDiplomas: React.FC<DashboardDiplomasProps> = ({
  onExploreDiplomas,
  onBrowseCourses
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-[20px] sm:text-[22px] font-[600] uppercase tracking-tight text-slate-900 dark:text-white">
          MY DIPLOMAS
        </h1>
        <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Comprehensive career diploma tracks combining Cisco, MikroTik, Cyber Security, Cloud, and Software Engineering.
        </p>
      </div>

      {/* Empty State Matching Screenshot */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 sm:p-14 text-center space-y-4 shadow-xs max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mx-auto flex items-center justify-center text-[#22C55E]">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-[17px] sm:text-[18px] font-[600] text-slate-900 dark:text-white">
            No diploma path yet.
          </h2>
          <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 leading-relaxed">
            Diploma programs bundle courses + capstone projects + a verifiable certificate. Pay in full or in installments — modules unlock as your payment plan progresses.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onExploreDiplomas}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[14px] font-[500] rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Explore diplomas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onBrowseCourses}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[14px] font-[500] rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Browse all courses &gt;</span>
          </button>
        </div>
      </div>

      {/* Featured 8 Diploma Tracks Preview */}
      <div className="pt-4">
        <div className="mb-4">
          <h3 className="text-[14px] font-[600] text-slate-900 dark:text-white uppercase tracking-wider">
            Available Diploma Programs (8 Tracks)
          </h3>
          <p className="text-[13px] font-[400] text-slate-500">Includes real lab access, capstones & job placement support</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              title: 'Cisco Certified Network Professional (CCNP) Diploma',
              modules: '6 Modules',
              duration: '6 Months',
              badge: 'Flagship'
            },
            {
              title: 'Cyber Security Operations & SOC Analyst Diploma',
              modules: '8 Modules',
              duration: '7 Months',
              badge: 'High Demand'
            },
            {
              title: 'MikroTik Certified Network Associate & Routing Diploma',
              modules: '5 Modules',
              duration: '4 Months',
              badge: 'Telecom Focus'
            }
          ].map((track, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-[#22C55E] transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-[#22C55E] text-[11px] font-[600]">
                    {track.badge}
                  </span>
                  <span className="text-[12px] text-slate-400">{track.duration}</span>
                </div>
                <h4 className="font-[500] text-[17px] text-slate-900 dark:text-white leading-snug">
                  {track.title}
                </h4>
              </div>
              <div className="flex items-center justify-between text-[13px] text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>{track.modules}</span>
                <button
                  onClick={onExploreDiplomas}
                  className="font-[500] text-[#22C55E] hover:underline flex items-center space-x-1"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
