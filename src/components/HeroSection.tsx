import React from 'react';
import { Play, ArrowRight, Sparkles, CheckCircle2, Shield, Award, Users } from 'lucide-react';
import { Course } from '../types';

interface HeroSectionProps {
  onBrowseCourses: () => void;
  onViewTracks: () => void;
  onSelectFeaturedCourse?: (course: Course) => void;
  featuredCourse?: Course;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBrowseCourses,
  onViewTracks,
  onSelectFeaturedCourse,
  featuredCourse
}) => {
  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
      {/* Subtle Ambient Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-emerald-400/8 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Main Reference Headline (3 lines, exact text from Home.PNG) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.08] sm:leading-[1.06]">
          <span className="block">Hoyga Tababarka</span>
          <span className="block">injineerada</span>
          <span 
            className="block text-[#22C55E] dark:text-[#22C55E] italic font-normal tracking-normal mt-1 sm:mt-2"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Mustaqbalka.
          </span>
        </h1>

        {/* Subtitle / Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
          Master practical, fluent English with structured courses in vocabulary, grammar, pronunciation, and conversation — taught by certified language educators. Hosted video lessons, quizzes, and verified certificates.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Primary Button: Explore English Courses → */}
          <button
            id="btn-hero-browse-courses"
            onClick={onBrowseCourses}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold rounded-xl text-sm sm:text-base shadow-md shadow-green-500/20 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <span>Explore English Courses</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Secondary Button: View diploma tracks with play icon */}
          <button
            id="btn-hero-view-tracks"
            onClick={onViewTracks}
            className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 font-semibold rounded-xl text-sm sm:text-base shadow-2xs transition-all hover:scale-[1.01] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current text-slate-700 dark:text-slate-300" />
            <span>View learning paths</span>
          </button>
        </div>

        {/* Live Systems Trust Banner */}
        <div className="pt-12 border-t border-slate-200/70 dark:border-slate-800/80 max-w-4xl mx-auto">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Comprehensive English Language Curriculum
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-400 dark:text-slate-500 text-xs sm:text-sm font-semibold">
            <span className="flex items-center space-x-1.5 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span>Core Vocabulary & Idioms</span>
            </span>
            <span className="flex items-center space-x-1.5 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Conversational Fluency</span>
            </span>
            <span className="flex items-center space-x-1.5 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Pronunciation & Accents</span>
            </span>
            <span className="flex items-center space-x-1.5 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Sentence Construction</span>
            </span>
            <span className="flex items-center space-x-1.5 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Real-Life English Drills</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
