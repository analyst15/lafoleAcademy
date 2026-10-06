import React, { useState } from 'react';
import { 
  Play, 
  HelpCircle, 
  Award, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Search,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Course, CourseProgress, LessonProgress } from '../types';

interface CourseCatalogProps {
  courses: Course[];
  activeCourse: Course;
  onSelectCourse: (course: Course) => void;
  onStartCourse: (course: Course) => void;
  courseProgress: CourseProgress;
  lessonProgressMap: Record<string, LessonProgress>;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  activeCourse,
  onSelectCourse,
  onStartCourse,
  courseProgress,
  lessonProgressMap
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const categories = ['All', 'English Beginners Level (A1-A2)', 'English Intermediate Level (B1 - B2)', 'English Primary One', 'Vocabulary', 'Grammar', 'Speaking & Pronunciation'];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = 
      selectedCategory === 'All' || 
      c.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesSearch = 
      c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="course-catalog-section" className="w-full max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-10 py-8 sm:py-14 space-y-5 sm:space-y-8 min-w-0 overflow-hidden box-border">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 min-w-0">
        <div className="space-y-1.5 sm:space-y-2 min-w-0">
          <div className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>English Language Programs</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore English Language Courses
          </h2>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Each track features hosted video lectures with automated watch tracking, interactive quizzes with instant grading, and accredited graduation certificates.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search English courses & skills..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/40"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills (Safely constrained to avoid mobile blowout) */}
      <div className="w-full max-w-full min-w-0 overflow-hidden">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar touch-pan-x">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#22C55E] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat === 'All' ? `All Courses (${courses.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid: Responsive 1-col on mobile, 2-col on sm/md, 3-col on lg */}
      <div className="w-full min-w-0 max-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCourses.map((course) => {
          const totalLessons = course.modules.flatMap(m => m.lessons).length;
          const isSelected = activeCourse.id === course.id;
          const completedCount = course.modules
            .flatMap(m => m.lessons)
            .filter(l => lessonProgressMap[l.id]?.status === 'completed').length;
          const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

          return (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="w-full min-w-0 max-w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col hover:shadow-lg transition-all hover:border-emerald-500/40 group cursor-pointer"
            >
              {/* Course Thumbnail Image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                
                {/* Level & Category Badges (constrained to never overflow on mobile) */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex items-center gap-1.5 max-w-[calc(100%-16px)] sm:max-w-[calc(100%-24px)] overflow-hidden">
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-md truncate max-w-[170px] sm:max-w-none">
                    {course.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#22C55E] text-white flex-shrink-0">
                    {course.level}
                  </span>
                </div>

                {/* Progress pill if started */}
                {percent > 0 && (
                  <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-slate-900/80 text-emerald-400 backdrop-blur-md border border-emerald-500/30">
                    {percent}% Completed
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-4 min-w-0">
                <div className="space-y-1 sm:space-y-1.5 min-w-0">
                  <h3 className="font-bold text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white leading-snug group-hover:text-[#22C55E] transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {course.subtitle || course.description}
                  </p>
                </div>

                {/* Meta details: lessons, hours - safe wrapped row with no overflow */}
                <div className="pt-2 sm:pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 min-w-0">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
                    <span className="flex items-center">
                      <BookOpen className="w-3.5 h-3.5 mr-1 text-[#22C55E] flex-shrink-0" />
                      <span>{totalLessons} Lessons</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0" />
                      <span>{course.estimatedHours} hrs</span>
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex-shrink-0 truncate">
                    Diploma Track
                  </span>
                </div>

                {/* Instructor & CTA */}
                <div className="pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                    />
                    <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 truncate min-w-0">
                      {course.instructor.name}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartCourse(course);
                    }}
                    className="flex items-center space-x-1 px-2.5 sm:px-3.5 py-1.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all hover:scale-[1.02] cursor-pointer flex-shrink-0"
                  >
                    <span>{percent > 0 ? 'Resume' : 'Start Track'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Architecture Feature Blocks */}
      <div className="w-full min-w-0 max-w-full grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 sm:pt-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#22C55E] flex items-center justify-center font-bold">
            <Play className="w-4 h-4 fill-current" />
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            High-Definition Video Hosting
          </h4>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Multi-CDN video streaming with timestamped bookmarking, variable playback speeds, and automated watch tracking.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#22C55E] flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Interactive Technical Quizzes
          </h4>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Automated assessments with immediate feedback, detailed technical explanations, and passing grade requirements.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#22C55E] flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Automated Progress & Diplomas
          </h4>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Progress is automatically certified at 90% video watch time and 80% quiz score, unlocking verifiable diploma credentials.
          </p>
        </div>
      </div>
    </div>
  );
};
