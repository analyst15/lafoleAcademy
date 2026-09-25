import React, { useState } from 'react';
import { 
  Play, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Search,
  BookOpen
} from 'lucide-react';
import { Course, Lesson, LessonProgress, CourseProgress } from '../types';

interface CourseCurriculumProps {
  course: Course;
  activeLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
  lessonProgressMap: Record<string, LessonProgress>;
  courseProgress: CourseProgress;
}

export const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  course,
  activeLessonId,
  onSelectLesson,
  lessonProgressMap,
  courseProgress
}) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    // Expand all modules by default
    const init: Record<string, boolean> = {};
    course.modules.forEach(m => { init[m.id] = true; });
    return init;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'completed' | 'in_progress'>('all');

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header & Course Progress Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Curriculum Outline
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {courseProgress.completedLessonsCount} / {courseProgress.totalLessonsCount} Completed
          </span>
        </div>

        {/* Course Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Automated Completion</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{courseProgress.percentComplete}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${courseProgress.percentComplete}%` }}
            />
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="pt-1 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-0.5 rounded ${filterType === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('completed')}
              className={`px-2 py-0.5 rounded ${filterType === 'completed' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' : ''}`}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Modules & Lessons Accordion List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-2 sm:p-3 space-y-2">
        {course.modules.map((mod, modIdx) => {
          const isExpanded = expandedModules[mod.id] ?? true;
          const filteredLessons = mod.lessons.filter(l => {
            const matchesQuery = searchQuery === '' || l.title.toLowerCase().includes(searchQuery.toLowerCase());
            const prog = lessonProgressMap[l.id];
            const isCompleted = prog?.status === 'completed';
            if (filterType === 'completed') return matchesQuery && isCompleted;
            if (filterType === 'in_progress') return matchesQuery && prog?.status === 'in_progress';
            return matchesQuery;
          });

          if (filteredLessons.length === 0 && searchQuery !== '') return null;

          const moduleCompletedCount = mod.lessons.filter(l => lessonProgressMap[l.id]?.status === 'completed').length;
          const isModuleFullyComplete = moduleCompletedCount === mod.lessons.length && mod.lessons.length > 0;

          return (
            <div key={mod.id} className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900/60">
              {/* Module Header Accordion Toggle */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full text-left p-3 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/80 dark:bg-slate-800/40 dark:hover:bg-slate-800/70 transition-colors"
              >
                <div className="flex items-center space-x-2.5 pr-2 truncate">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    isModuleFullyComplete
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  }`}>
                    {modIdx + 1}
                  </div>
                  <div className="truncate text-left">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {mod.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {moduleCompletedCount}/{mod.lessons.length} lessons completed
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Lesson Items */}
              {isExpanded && (
                <div className="p-1.5 space-y-1">
                  {filteredLessons.map((lesson) => {
                    const isActive = activeLessonId === lesson.id;
                    const prog = lessonProgressMap[lesson.id];
                    const isDone = prog?.status === 'completed';
                    const isInProgress = prog?.status === 'in_progress' && !isDone;
                    const pctWatched = prog?.maxPercentageWatched || 0;

                    return (
                      <button
                        key={lesson.id}
                        id={`curriculum-lesson-${lesson.id}`}
                        onClick={() => onSelectLesson(lesson)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between text-xs ${
                          isActive
                            ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 font-semibold shadow-xs'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate pr-2">
                          {/* Lesson Type Icon */}
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                              : isActive
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {lesson.type === 'video' ? (
                              <Play className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <HelpCircle className="w-3.5 h-3.5" />
                            )}
                          </div>

                          {/* Lesson Title & Info */}
                          <div className="truncate">
                            <div className={`truncate ${isActive ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>
                              {lesson.title}
                            </div>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-0.5" />
                                {lesson.durationMinutes} min
                              </span>
                              <span>•</span>
                              <span className="capitalize">{lesson.type}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Checkmark or Percentage */}
                        <div className="flex-shrink-0 ml-1">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : isInProgress ? (
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              {pctWatched}%
                            </span>
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
