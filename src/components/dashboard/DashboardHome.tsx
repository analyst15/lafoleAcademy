import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Copy, 
  Check, 
  Share2, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Play, 
  Award, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { Course, CourseProgress, StudentProfile } from '../../types';

interface DashboardHomeProps {
  userName: string;
  enrolledCourses: Course[];
  courseProgressMap: Record<string, CourseProgress>;
  onNavigateToTab: (tab: string) => void;
  onExploreCourses: () => void;
  onExploreDiplomas: () => void;
  onResumeCourse: (course: Course) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  userName,
  enrolledCourses,
  courseProgressMap,
  onNavigateToTab,
  onExploreCourses,
  onExploreDiplomas,
  onResumeCourse
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const referralCode = 'FRIEND-QBTR';

  // Live EAT Time (UTC+3)
  const [timeString, setTimeString] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as: WEDNESDAY, 23 SEPT 2026 - 13:18 EAT
      const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
      
      const dayName = days[now.getUTCDay()];
      const dayNum = now.getUTCDate();
      const monthName = months[now.getUTCMonth()];
      const year = now.getUTCFullYear();
      
      // East Africa Time is UTC+3
      const eatHours = (now.getUTCHours() + 3) % 24;
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const hoursStr = String(eatHours).padStart(2, '0');
      
      setTimeString(`${dayName}, ${dayNum} ${monthName} ${year} - ${hoursStr}:${mins} EAT`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live Countdown Timer for Sales
  const [countdown, setCountdown] = useState({ days: 2, hours: 7, mins: 4, secs: 12 });
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Join Lafole Academy with my discount code ${referralCode} and get 10% off your first course or diploma! https://lafole.edu.so/catalog`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Determine greeting based on current local hour
  const getGreeting = () => {
    const hour = (new Date().getUTCHours() + 3) % 24;
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Date & Sales Countdown Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase flex items-center space-x-2 text-[12px]">
          <Clock className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>{timeString || 'WEDNESDAY, 23 SEPT 2026 - 13:18 EAT'}</span>
        </div>

        {/* Live Sales countdown pill matching reference screenshot */}
        <div className="flex items-center space-x-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 px-3 py-1 rounded-full border border-rose-200/60 dark:border-rose-900/60 text-xs font-medium w-fit">
          <span className="font-semibold">Sales ends:</span>
          <div className="font-mono flex items-center space-x-1 font-semibold">
            <span>{countdown.days}d</span>
            <span>{String(countdown.hours).padStart(2, '0')}h</span>
            <span>{String(countdown.mins).padStart(2, '0')}m</span>
            <span>{String(countdown.secs).padStart(2, '0')}s</span>
          </div>
        </div>
      </div>

      {/* Greeting Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-[600] text-slate-900 dark:text-white tracking-tight">
          {getGreeting()}, <span className="text-[#22C55E]">{userName || 'Nerd Ninja'}</span>
        </h1>
        <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 mt-1">
          Welcome back to your personalized learning dashboard.
        </p>
      </div>

      {/* Promotion & Invitation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Banner 1: BACK TO SCHOOL SALES */}
        <div className="md:col-span-2 xl:col-span-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-black text-white rounded-2xl p-6 relative overflow-hidden border border-emerald-900/40 shadow-xs flex flex-col justify-between min-h-[190px]">
          <div className="absolute right-0 top-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-3">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-[700] uppercase tracking-wider bg-[#22C55E] text-slate-950">
              50% OFF
            </div>
            <div>
              <h2 className="text-[20px] sm:text-[22px] font-[700] tracking-tight text-white uppercase leading-snug">
                BACK TO SCHOOL SALES
              </h2>
              <p className="text-[14.5px] font-[400] text-emerald-200/80 mt-1 leading-relaxed">
                All courses on sale.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onExploreCourses}
              className="inline-flex items-center space-x-1.5 text-[14px] font-[500] text-[#22C55E] hover:text-emerald-300 transition-colors cursor-pointer group"
            >
              <span>Explore course catalog</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Banner 2: INVITE A FRIEND */}
        <div className="md:col-span-1 xl:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[190px]">
          <div>
            <div className="text-[11px] font-[700] uppercase tracking-wider text-[#22C55E] mb-1.5">
              INVITE A FRIEND
            </div>
            <h3 className="text-[17px] font-[500] text-slate-900 dark:text-white leading-snug">
              Share with classmates
            </h3>
            <p className="text-[14.5px] font-[400] text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
              Give a friend 10% off any course or diploma. When they enrol, you get 10% off your next one.
            </p>
          </div>

          <div className="space-y-2 pt-3">
            <div className="flex items-center space-x-2">
              <div className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-[600] text-[13px] text-slate-800 dark:text-slate-200 tracking-wider">
                {referralCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[13px] font-[500] flex items-center space-x-1 transition-colors cursor-pointer"
                title="Copy referral code"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleShareWhatsApp}
              className="w-full text-left text-[13px] font-[500] text-[#22C55E] hover:underline flex items-center space-x-1 cursor-pointer pt-1"
            >
              <span>Invite on WhatsApp</span>
              <Share2 className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

        {/* Banner 3: STREAK CARD */}
        <div className="md:col-span-1 xl:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[190px]">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-orange-500">
                <Flame className="w-5 h-5 fill-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-[700] text-slate-900 dark:text-white leading-none">
                  0
                </div>
                <div className="text-[11px] font-[700] text-slate-400 uppercase tracking-wider mt-0.5">
                  DAYS STREAK
                </div>
              </div>
            </div>

            <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 leading-relaxed">
              Complete a lesson or quiz daily to maintain your study momentum.
            </p>
          </div>

          {/* Days of week rings */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-1">
                <div className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center text-[11px] font-[600] text-slate-400">
                  {day}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Section: Courses or Empty State */}
      <div className="space-y-4">
        {enrolledCourses.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[18px] sm:text-[20px] font-[600] text-slate-900 dark:text-white">
                  {enrolledCourses.some(c => (courseProgressMap[c.id]?.percentComplete || 0) > 0) ? 'Continue Learning' : 'Enrolled Courses'} ({enrolledCourses.length})
                </h2>
                <p className="text-[14px] font-[400] text-slate-500 mt-0.5">
                  {enrolledCourses.some(c => (courseProgressMap[c.id]?.percentComplete || 0) > 0) ? 'Pick up right where you left off' : 'Start your enrolled learning tracks'}
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('mylearning')}
                className="text-[14px] font-[500] text-[#22C55E] hover:underline"
              >
                View all courses →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {enrolledCourses.map(course => {
                const prog = courseProgressMap[course.id] || {
                  percentComplete: 0,
                  completedLessonsCount: 0,
                  totalLessonsCount: course.modules.flatMap(m => m.lessons).length
                };

                return (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-3.5"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] font-[600]">
                        {course.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-[500] text-[17px] text-slate-900 dark:text-white line-clamp-1 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-[14px] font-[400] text-slate-500 mt-1">
                        Instructor: {course.instructor.name}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[13px] text-slate-500">
                        <span>Progress</span>
                        <span className="font-[600] text-slate-800 dark:text-slate-200">
                          {prog.percentComplete}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#22C55E] rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, prog.percentComplete)}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => onResumeCourse(course)}
                      className="w-full py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-[14px] font-[500] transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{(prog.percentComplete || 0) > 0 ? 'Resume Lesson' : 'Start Course'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty State Matching Screenshot */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mx-auto flex items-center justify-center text-slate-400">
              <BookOpen className="w-8 h-8 text-[#22C55E]" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-[17px] sm:text-[18px] font-[600] uppercase tracking-tight text-slate-900 dark:text-white">
                NO ENROLLED COURSES YET
              </h2>
              <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 leading-relaxed">
                Browse the catalog to get started. Pick a self-paced course or a diploma path — your dashboard will start filling up here once you enrol.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onExploreCourses}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[14px] font-[500] rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Explore courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onExploreDiplomas}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[14px] font-[500] rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>View diplomas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
