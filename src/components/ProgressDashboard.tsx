import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  Flame, 
  BookOpen, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import { Course, CourseProgress, LessonProgress, StudentProfile } from '../types';
import { formatHoursAndMinutes, formatTimeSeconds } from '../utils/formatters';

interface ProgressDashboardProps {
  course: Course;
  courseProgress: CourseProgress;
  lessonProgressMap: Record<string, LessonProgress>;
  studentProfile: StudentProfile;
  onOpenCertificate: () => void;
  onContinueLearning: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  course,
  courseProgress,
  lessonProgressMap,
  studentProfile,
  onOpenCertificate,
  onContinueLearning
}) => {
  // Aggregate stats
  const allLessons = course.modules.flatMap(m => m.lessons);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter(l => lessonProgressMap[l.id]?.status === 'completed').length;
  
  const videoLessons = allLessons.filter(l => l.type === 'video');
  const quizLessons = allLessons.filter(l => l.type === 'quiz');

  const completedVideos = videoLessons.filter(l => lessonProgressMap[l.id]?.status === 'completed').length;
  const completedQuizzes = quizLessons.filter(l => lessonProgressMap[l.id]?.status === 'completed').length;

  // Average quiz score
  const quizScores = quizLessons
    .map(l => lessonProgressMap[l.id]?.bestQuizScore)
    .filter((s): s is number => typeof s === 'number');
  const avgQuizScore = quizScores.length > 0 
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
    : 0;

  const isComplete = courseProgress.percentComplete >= 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Banner / Hero Overview */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Automated Learning Progress Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {studentProfile.name}'s Course Transcript
            </h1>
            <p className="text-sm text-slate-300">
              Enrolled in <strong className="text-white">{course.title}</strong>. Every video second watched and quiz completed is automatically synchronized to your verified credential.
            </p>
          </div>

          {/* Large Circular / Metric Progress Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center space-x-5 flex-shrink-0">
            {/* SVG Radial Gauge */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${courseProgress.percentComplete}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-base font-extrabold text-white">{courseProgress.percentComplete}%</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-300 font-medium">Total Progress</div>
              <div className="text-sm font-bold text-white">
                {completedLessons} of {totalLessons} Finished
              </div>
              <button
                id="btn-resume-learning"
                onClick={onContinueLearning}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-300 hover:text-white transition-colors"
              >
                <span>Continue Course</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1: Time Spent */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Active Learning Time</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {formatHoursAndMinutes(courseProgress.totalTimeSpentSeconds)}
          </div>
          <div className="text-[11px] text-slate-400">
            Real-time video & quiz timer
          </div>
        </div>

        {/* Stat 2: Quizzes Passed */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Quizzes Passed</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {completedQuizzes} / {quizLessons.length}
          </div>
          <div className="text-[11px] text-slate-400">
            Avg Score: <strong className="text-slate-700 dark:text-slate-300">{avgQuizScore > 0 ? `${avgQuizScore}%` : 'N/A'}</strong>
          </div>
        </div>

        {/* Stat 3: Videos Completed */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Videos Watched</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {completedVideos} / {videoLessons.length}
          </div>
          <div className="text-[11px] text-slate-400">
            ≥90% auto-verified completion
          </div>
        </div>

        {/* Stat 4: Daily Streak */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Learning Streak</span>
            <Flame className="w-4 h-4 text-orange-500 fill-current" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {studentProfile.learningStreakDays} Days
          </div>
          <div className="text-[11px] text-slate-400">
            Active learner badge unlocked
          </div>
        </div>
      </div>

      {/* Certificate Showcase Banner */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isComplete
          ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-lg'
          : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-2xl ${
              isComplete
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}>
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Official Certificate of Completion
                </h3>
                {isComplete ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Unlocked & Verified
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Locked ({totalLessons - completedLessons} lessons remaining)
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                {isComplete
                  ? 'Congratulations! You have completed 100% of video lessons and passed all required technical exams. Your certificate includes an official credential ID and instructor endorsement.'
                  : 'Complete all video sessions with ≥90% watch time and achieve passing scores on every module quiz to automatically earn your digital verified diploma.'}
              </p>
            </div>
          </div>

          <button
            id="btn-view-certificate"
            disabled={!isComplete}
            onClick={onOpenCertificate}
            className={`flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex-shrink-0 ${
              isComplete
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 hover:scale-[1.02] cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>View Certificate</span>
          </button>
        </div>
      </div>

      {/* Module Breakdown Progress Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
            Module Completion Breakdown
          </h3>
          <span className="text-xs text-slate-400">
            {course.modules.length} Modules in Curriculum
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {course.modules.map((mod, idx) => {
            const modLessons = mod.lessons;
            const modCompleted = modLessons.filter(l => lessonProgressMap[l.id]?.status === 'completed').length;
            const modPercent = modLessons.length > 0 ? Math.round((modCompleted / modLessons.length) * 100) : 0;
            const isModComplete = modPercent === 100;

            return (
              <div key={mod.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-400">
                      Module {idx + 1}
                    </span>
                    {isModComplete && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded">
                        COMPLETED
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {mod.description}
                  </p>
                </div>

                {/* Progress bar + counts */}
                <div className="w-full sm:w-64 space-y-1.5 flex-shrink-0">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">
                      {modCompleted} / {modLessons.length} Lessons
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {modPercent}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isModComplete ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                      style={{ width: `${modPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Milestones */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
          Automated Milestones & Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {studentProfile.badges.map((badge) => (
            <div 
              key={badge.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start space-x-3"
            >
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {badge.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {badge.description}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                  Earned {badge.unlockedAt}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
