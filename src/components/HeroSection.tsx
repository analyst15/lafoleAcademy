import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Course } from '../types';

interface HeroSectionProps {
  onBrowseCourses: () => void;
  onViewTracks: () => void;
  onContactUs?: () => void;
  onSelectFeaturedCourse?: (course: Course) => void;
  featuredCourse?: Course;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBrowseCourses,
  onViewTracks,
  onContactUs,
}) => {
  const heroImageUrl = "https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Lafole%2FLafore%20Academy%20Hallway%20Portrait.png?alt=media&token=fe5cfb5c-6f19-4300-b94a-737dc60adfea";

  const handleContactClick = () => {
    if (onContactUs) {
      onContactUs();
    } else {
      onViewTracks();
    }
  };

  return (
    <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 overflow-hidden bg-white dark:bg-[#0B0F17]">
      {/* Subtle Ambient Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/8 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Typography, Tagline & CTAs matching Reference Screenshot */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
            
            {/* Top Tagline / Kicker Badge (Catch Phrase) */}
            <div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/90 dark:border-emerald-800/60 text-[#16A34A] dark:text-[#22C55E] text-xs font-bold tracking-wider uppercase shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span>Speak with Confidence</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1] sm:leading-[1.06]">
              <span className="block text-slate-950 dark:text-white">Your Journey to</span>
              <span className="block text-[#22C55E] dark:text-[#22C55E] mt-1 sm:mt-2">
                English Fluency Starts Here.
              </span>
            </h1>

            {/* Subtitle / Description */}
            <p className="max-w-xl text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Practical courses in communication, storytelling, vocabulary, pronunciation, and everyday conversation — taught step-by-step by certified language educators at Lafole Academy.
            </p>

            {/* Action Buttons (Explore Courses > | Contact Us) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              {/* Primary Button: Explore Courses */}
              <button
                id="btn-hero-browse-courses"
                onClick={onBrowseCourses}
                className="px-7 py-3.5 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold rounded-xl text-sm sm:text-base shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center space-x-2.5 cursor-pointer"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Secondary Button: Contact Us */}
              <button
                id="btn-hero-contact-us"
                onClick={handleContactClick}
                className="px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold rounded-xl text-sm sm:text-base shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Contact Us</span>
              </button>
            </div>

          </div>

          {/* Right Column: Hero Image with Clean Styled Backdrop Frame */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 via-emerald-400/10 to-teal-500/15 rounded-[44px] blur-2xl opacity-75 dark:opacity-50 pointer-events-none" />

            {/* Backdrop Card Frame */}
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-none bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-slate-100/50 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-slate-900/80 rounded-3xl sm:rounded-[36px] border border-emerald-500/25 dark:border-emerald-500/30 p-2 sm:p-3 overflow-hidden shadow-2xl">
              
              {/* Radial lighting inside frame */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-400/15 dark:bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

              {/* Main Portrait Image */}
              <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-[28px] shadow-lg">
                <img
                  src={heroImageUrl}
                  alt="Lafole Academy Hallway Portrait"
                  className="w-full aspect-[3/4] max-h-[500px] sm:max-h-[540px] lg:max-h-[560px] object-cover object-center drop-shadow-md transition-transform duration-500 hover:scale-[1.02]"
                  loading="eager"
                />
              </div>

            </div>

          </div>

        </div>

        {/* Live Curriculum Pillars Strip */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="text-center text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Structured English Curriculum Built For Real-World Results
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 lg:gap-10 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-semibold">
            <span className="flex items-center space-x-2 hover:text-[#22C55E] transition-colors">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span>Core Vocabulary & Idioms</span>
            </span>
            <span className="flex items-center space-x-2 hover:text-indigo-500 transition-colors">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Conversational Fluency</span>
            </span>
            <span className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Pronunciation & Accents</span>
            </span>
            <span className="flex items-center space-x-2 hover:text-amber-500 transition-colors">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Sentence Construction</span>
            </span>
            <span className="flex items-center space-x-2 hover:text-purple-500 transition-colors">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Real-Life English Drills</span>
            </span>
          </div>
        </div>

      </div>

    </section>
  );
};
