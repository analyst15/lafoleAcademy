import React from 'react';
import { ArrowRight, Clock, BookOpen, Sparkles } from 'lucide-react';
import { Course } from '../types';

interface LatestCoursesSectionProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onOpenFullCatalog: () => void;
}

export const LatestCoursesSection: React.FC<LatestCoursesSectionProps> = ({
  courses,
  onSelectCourse,
  onOpenFullCatalog
}) => {
  // Display the latest 8 courses (matching the 2x4 grid in the reference mockup)
  const displayCourses = courses.slice(0, 8);

  const getLevelBadgeClasses = (level: string) => {
    switch (level) {
      case 'Advanced':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60';
      case 'Intermediate':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60';
      case 'Beginner':
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60';
    }
  };

  return (
    <section className="w-full py-12 sm:py-16 bg-[#FAFAF8] dark:bg-[#0A0E17] border-t border-slate-200/70 dark:border-slate-800/80 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header: "Latest Courses." and "Open full catalog →" pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 sm:pb-10 border-b border-slate-200/60 dark:border-slate-800/60 gap-3 sm:gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Latest Courses.
            </h2>
          </div>

          <button
            onClick={onOpenFullCatalog}
            className="group flex items-center space-x-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer self-start sm:self-auto flex-shrink-0"
          >
            <span>Open full catalog</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4-Column Responsive Grid (2 rows x 4 columns = 8 cards) */}
        <div className="pt-8 sm:pt-10 w-full min-w-0 max-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
          {displayCourses.map((course, idx) => {
            const price = course.price ?? 40;
            const originalPrice = course.originalPrice ?? price * 2;
            const discountPercent = course.discountPercent ?? 50;
            const lessonsCount = course.totalLessonsCount ?? (course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 12);

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-slate-800/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/40 transition-all duration-300 cursor-pointer w-full min-w-0 max-w-full"
              >
                {/* Top Image / Banner Area */}
                <div>
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient & Corner Accent */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                    {/* Category pill on top-left */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-2xs">
                        {course.category}
                      </span>
                    </div>

                    {/* Instructor circular portrait inset (as seen in inspo) */}
                    <div className="absolute bottom-2.5 right-3 flex items-center space-x-1.5 bg-black/70 backdrop-blur-md px-2 py-1 rounded-full border border-white/15">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover border border-white/40"
                      />
                      <span className="text-xs sm:text-sm text-white/90 font-medium truncate max-w-[110px]">
                        {course.instructor.name}
                      </span>
                    </div>
                  </div>

                  {/* Course Content Info */}
                  <div className="p-4 sm:p-5">
                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {course.title}
                    </h3>

                    {/* Metadata / Duration */}
                    <div className="pt-2.5 flex items-center space-x-2 text-xs sm:text-[13px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.estimatedHours}H</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center space-x-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{lessonsCount} LESSONS</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Pricing Tag, Discount, & Difficulty Level */}
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1">
                  {/* Thin divider line */}
                  <div className="w-full border-t border-slate-100 dark:border-slate-800/90 mb-3.5" />

                  <div className="flex items-center justify-between gap-2">
                    {/* Price, Original Price, and Discount in unified orange pill */}
                    <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-1 rounded-lg bg-[#F97316] text-white shadow-2xs shadow-orange-500/20 whitespace-nowrap">
                      <span className="font-extrabold text-xs sm:text-sm text-white">
                        ${price}
                      </span>
                      
                      <span className="text-sm text-white/90 line-through">
                        ${originalPrice}
                      </span>

                      <span className="text-[11px] font-bold text-white">
                        -{discountPercent}%
                      </span>
                    </div>

                    {/* Difficulty Level Badge */}
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider ${getLevelBadgeClasses(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
