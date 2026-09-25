import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Award, 
  ExternalLink,
  Layers,
  FolderOpen
} from 'lucide-react';
import { Course, CourseProgress } from '../../types';

interface DashboardMyLearningProps {
  enrolledCourses: Course[];
  courseProgressMap: Record<string, CourseProgress>;
  onResumeCourse: (course: Course) => void;
  onExploreCourses: () => void;
  onViewCourseDetails: (course: Course) => void;
  onOpenCertificate: (course: Course) => void;
}

export const DashboardMyLearning: React.FC<DashboardMyLearningProps> = ({
  enrolledCourses,
  courseProgressMap,
  onResumeCourse,
  onExploreCourses,
  onViewCourseDetails,
  onOpenCertificate
}) => {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const filteredCourses = enrolledCourses.filter(course => {
    const prog = courseProgressMap[course.id];
    const isCompleted = (prog?.percentComplete || 0) >= 100;
    
    if (filter === 'completed' && !isCompleted) return false;
    if (filter === 'in_progress' && isCompleted) return false;
    
    if (search.trim()) {
      const q = search.toLowerCase();
      return course.title.toLowerCase().includes(q) || course.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header matching screenshot */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-[20px] sm:text-[22px] font-[600] uppercase tracking-tight text-slate-900 dark:text-white">
          MY LEARNING
        </h1>
        <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          {enrolledCourses.length === 0 
            ? "You haven't enrolled in any courses yet. Resume where you left off, or revisit a completed course to download your certificate."
            : "Resume where you left off, access hosted lectures, quizzes, and download your verifiable diploma certificates."}
        </p>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="space-y-5">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto no-scrollbar">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-[500] whitespace-nowrap transition-all ${
                  filter === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-[600]'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                All Courses ({enrolledCourses.length})
              </button>
              <button
                onClick={() => setFilter('in_progress')}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-[500] whitespace-nowrap transition-all ${
                  filter === 'in_progress'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-[600]'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-[500] whitespace-nowrap transition-all ${
                  filter === 'completed'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-[600]'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Completed
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your courses..."
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[14px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#22C55E]"
              />
            </div>
          </div>

          {/* Grid of Courses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredCourses.map(course => {
              const prog = courseProgressMap[course.id] || {
                percentComplete: 0,
                completedLessonsCount: 0,
                totalLessonsCount: course.modules.flatMap(m => m.lessons).length,
                isCertificateUnlocked: false
              };
              const isDone = prog.percentComplete >= 100;

              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] font-[600]">
                        {course.category}
                      </span>
                      {isDone && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-[600] flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Passed</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-[500] text-[17px] text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-[14px] font-[400] text-slate-400 mt-1 line-clamp-1">
                        Instructor: {course.instructor.name}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[13px] text-slate-500">
                        <span>Progress</span>
                        <span className="font-[600] text-slate-800 dark:text-slate-200">
                          {prog.percentComplete}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#22C55E] rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(4, prog.percentComplete)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
                    <button
                      onClick={() => onResumeCourse(course)}
                      className="flex-1 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-[14px] font-[500] transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isDone ? 'Review' : 'Resume'}</span>
                    </button>
                    
                    {isDone ? (
                      <button
                        onClick={() => onOpenCertificate(course)}
                        title="View Certificate"
                        className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 rounded-xl text-[14px] border border-emerald-200 dark:border-emerald-800 transition-colors"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onViewCourseDetails(course)}
                        title="Course details"
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-[14px] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State Matching Screenshot */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 sm:p-14 text-center space-y-4 shadow-xs max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mx-auto flex items-center justify-center text-slate-400">
            <FolderOpen className="w-8 h-8 text-[#22C55E]" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-[700] uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              EMPTY SHELF
            </div>
            <h2 className="text-[17px] sm:text-[18px] font-[600] text-slate-900 dark:text-white pt-1">
              Pick a course to get started.
            </h2>
            <p className="text-[14.5px] font-[400] text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              Once you enrol, your courses will show up here with progress and the next lesson to resume.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onExploreCourses}
              className="px-6 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[14px] font-[500] rounded-xl shadow-xs transition-all inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Explore courses catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
