import React from 'react';
import { Book, ArrowRight, Download, BookOpen, ExternalLink } from 'lucide-react';

interface DashboardBooksProps {
  onBrowseBooks: () => void;
}

export const DashboardBooks: React.FC<DashboardBooksProps> = ({ onBrowseBooks }) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-[20px] sm:text-[22px] font-[600] uppercase tracking-tight text-slate-900 dark:text-white">
          MY LIBRARY
        </h1>
        <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Your collection of engineering handbooks, Cisco lab workbooks, and certification revision guides.
        </p>
      </div>

      {/* Empty State Matching Screenshot */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 sm:p-14 text-center space-y-4 shadow-xs max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mx-auto flex items-center justify-center text-[#22C55E]">
          <Book className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-[17px] sm:text-[18px] font-[600] text-slate-900 dark:text-white">
            No books yet.
          </h2>
          <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 leading-relaxed">
            Buy a Lafole book or training PDF and it lands here for instant download — yours forever.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onBrowseBooks}
            className="px-6 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[14px] font-[500] rounded-xl shadow-xs transition-all inline-flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Browse books & manuals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Featured Book Recommendations */}
      <div className="pt-4">
        <div className="mb-4">
          <h3 className="text-[14px] font-[600] text-slate-900 dark:text-white uppercase tracking-wider">
            Popular Technical Handbooks
          </h3>
          <p className="text-[13px] font-[400] text-slate-500">Official companion workbooks authored by senior Somali engineers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              title: 'Cisco CCNA 200-301 Exam Mastery Guide (Somali/English)',
              author: 'Eng. Abdullahi Mohamed',
              pages: '480 pages',
              price: '$25.00'
            },
            {
              title: 'MikroTik RouterOS v7 In-Depth Configuration Handbook',
              author: 'Eng. Hassan Nur',
              pages: '350 pages',
              price: '$20.00'
            },
            {
              title: 'Enterprise Cyber Defense & SOC Blue Team Playbook',
              author: 'Eng. Sahra Warsame',
              pages: '410 pages',
              price: '$30.00'
            }
          ].map((bk, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-[#22C55E] transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-[11px] font-[600] text-slate-400 uppercase tracking-wider">{bk.pages}</span>
                </div>
                <h4 className="font-[500] text-[17px] text-slate-900 dark:text-white leading-snug">
                  {bk.title}
                </h4>
                <p className="text-[14px] font-[400] text-slate-500">Author: {bk.author}</p>
              </div>
              <div className="flex items-center justify-between text-[13.5px] pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="font-[700] text-slate-900 dark:text-white">{bk.price}</span>
                <button
                  onClick={onBrowseBooks}
                  className="font-[500] text-[#22C55E] hover:underline"
                >
                  View in bookstore →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
