import React, { useState, useMemo, useEffect } from 'react';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Download, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  Users, 
  Award, 
  FileText, 
  Globe, 
  Monitor, 
  Smartphone, 
  Infinity as InfinityIcon, 
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Course, Lesson, Module } from '../types';

interface CourseDetailsPageProps {
  course: Course;
  onEnroll: (course: Course) => void;
  onBackToCatalog: () => void;
  onBackToHome: () => void;
}

export const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({
  course,
  onEnroll,
  onBackToCatalog,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'outcomes' | 'materials' | 'instructor'>('syllabus');
  const [showAllOutcomes, setShowAllOutcomes] = useState<boolean>(false);
  const [savedForLater, setSavedForLater] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize expanded modules state (all real course modules expanded by default)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    if (course.modules && course.modules.length > 0) {
      course.modules.forEach(m => {
        init[m.id] = true;
      });
    }
    return init;
  });

  useEffect(() => {
    if (course.modules && course.modules.length > 0) {
      const init: Record<string, boolean> = {};
      course.modules.forEach(m => {
        init[m.id] = true;
      });
      setExpandedModules(init);
    }
  }, [course]);

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Unique course link copied to clipboard!');
    }
  };

  const handleSaveToggle = () => {
    setSavedForLater(!savedForLater);
    showToast(savedForLater ? 'Course removed from saved list.' : 'Course saved for later!');
  };

  // Structured syllabus data (derived directly from real course modules)
  const detailedModules = useMemo(() => {
    return course.modules || [];
  }, [course]);

  // Total lesson and module count
  const totalLessons = useMemo(() => {
    return detailedModules.reduce((acc, m) => acc + m.lessons.length, 0);
  }, [detailedModules]);

  // English course specific learning outcomes
  const outcomes = useMemo(() => {
    const isBeginnerCourse = course.id === 'course-english-beginners-a1-a2' || (course.level === 'Beginner' && !course.title.toLowerCase().includes('intermediate'));
    if (isBeginnerCourse) {
      return [
        'Master essential everyday English vocabulary across 55+ progressive video lessons',
        'Learn numerical fluency from single digits to three digits, counting by tens, and number words',
        'Master demonstratives (This, That, These, Those), questions, and negative statements',
        'Greet people politely and introduce yourself, your family, and your home with confidence',
        'Describe everyday objects, classroom items, clothing, colors, and food accurately',
        'Express location and position using correct prepositions of place (in, on, under, behind)',
        'Tell the time, state days of the week, and navigate daily scheduling in English',
        'Construct present continuous sentences describing actions happening right now',
        'Express personal abilities using "I can" and future intentions with "I plan to"',
        'Download and practice with official Numbers notes, Primary One textbooks, and vocabulary guides'
      ];
    }
    return [
      'Master high-frequency conversational English vocabulary and native collocations across 27 video lessons',
      'Learn 23 practical daily sentence lessons (Sentence Daily Use) for fluid, real-world communication',
      'Enhance spoken fluency and natural pronunciation for everyday professional and social contexts',
      'Construct natural English sentences for daily use, social interactions, routines, and workplace conversations',
      'Express complex thoughts, feelings, emotions, and opinions with nuanced vocabulary',
      'Use phrasal verbs, idioms, and casual expressions effortlessly like a native speaker',
      'Transition smoothly between formal and informal registers in business, travel, and networking',
      'Debate, agree, and politely disagree in group conversations with appropriate discourse markers',
      'Narrate stories and describe sequences of events with rich descriptive adjectives and adverbs',
      'Complete the comprehensive B1–B2 vocabulary mastery capstone exam and earn your certification'
    ];
  }, [course]);

  const displayedOutcomes = showAllOutcomes ? outcomes : outcomes.slice(0, 4);

  // Prerequisites tailored to English courses
  const prerequisites = useMemo(() => {
    const isBeginnerCourse = course.id === 'course-english-beginners-a1-a2' || (course.level === 'Beginner' && !course.title.toLowerCase().includes('intermediate'));
    if (isBeginnerCourse) {
      return [
        'No prior English knowledge needed — starting right from the fundamentals',
        'A desire to build foundational speaking, listening, and vocabulary skills',
        'A notebook or device to download and follow the included PDF course notes',
        'Consistency and dedication to watch the daily lessons and practice pronunciation'
      ];
    }
    return [
      'Basic foundation in English reading and elementary vocabulary (A2 level recommended)',
      'Familiarity with common sentence structures and everyday phrases',
      'Dedication to active listening, repeating phrases aloud, and taking notes',
      'Access to a smartphone, tablet, or computer to stream the HD video lessons'
    ];
  }, [course]);

  // Instructor details
  const instructor = course.instructor || {
    name: 'Abdifatah Jama',
    role: 'Lead English Language Educator',
    avatar: 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2FYellow%20Black%20Modern%20Course%20YouTube%20Thumbnail.png?alt=media&token=58075f8e-7a43-420b-8ceb-62aaed33c422',
    bio: 'Experienced English language educator specializing in practical vocabulary, pronunciation, conversational fluency, and ESL instruction.'
  };

  // Initials for avatar
  const instructorInitials = instructor.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const price = course.price || 20;
  const originalPrice = course.originalPrice || 40;
  const hours = course.estimatedHours || 14;

  return (
    <div className="min-h-screen bg-[#FBFBF9] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] dark:bg-white text-white dark:text-black px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs sm:text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        
        {/* Top Breadcrumb Navigation: Lafole > Catalog > [Category] */}
        <nav className="flex items-center space-x-2 text-sm text-[#71717A] dark:text-slate-400 font-normal mb-6 sm:mb-8">
          <button 
            onClick={onBackToHome}
            className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            Lafole
          </button>
          <span className="text-[#A1A1AA] dark:text-slate-600">&gt;</span>
          <button 
            onClick={onBackToCatalog}
            className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            Catalog
          </button>
          <span className="text-[#A1A1AA] dark:text-slate-600">&gt;</span>
          <span className="text-[#27272A] dark:text-slate-200 font-medium truncate">
            {course.category}
          </span>
        </nav>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: Title, Overview, Outcomes, Syllabus ================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Course Title & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-[1.15]">
                {course.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                {course.subtitle || 'Learn step-by-step and build in-demand skills for real-world career success.'}
              </p>
            </div>

            {/* 2. Metadata Bar: Instructor Avatar, Enrolled, Duration, Lessons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 pt-1 pb-4 border-b border-slate-200 dark:border-slate-800">
              
              {/* Instructor Pill */}
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-200 dark:ring-slate-700">
                  {instructorInitials}
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {instructor.name}
                </span>
              </div>

              {/* Enrolled Count */}
              <div className="flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>161 enrolled</span>
              </div>

              {/* Duration & Lessons Count */}
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{hours}h 37m • {totalLessons} lessons</span>
              </div>

              {/* Share button */}
              <button 
                onClick={handleShare}
                className="ml-auto flex items-center space-x-1.5 text-slate-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                title="Share unique course link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            {/* 3. Comprehensive Course Description */}
            <div className="space-y-4 text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                {course.description}
              </p>
              <p>
                Taught with structured step-by-step clarity by {instructor.name}, this curriculum emphasizes active speaking, listening comprehension, and practical real-world usage. Every lesson breaks down everyday conversational expressions, pronunciation subtleties, and sentence building frameworks that you can immediately apply in social and academic interactions.
              </p>
              <p>
                Throughout the course, students follow along with official downloadable PDF notes and textbooks, video demonstrations, and an end-of-module knowledge check to ensure thorough retention and fluency.
              </p>
            </div>

            {/* 4. "WHAT YOU'LL LEARN" Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <h2 className="text-xs sm:text-[13px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                WHAT YOU'LL LEARN
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs sm:text-[13px] text-slate-800 dark:text-slate-200">
                {displayedOutcomes.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5">
                    <span className="text-[#22C55E] mt-0.5 flex-shrink-0 font-bold">✓</span>
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              {!showAllOutcomes && outcomes.length > 4 && (
                <button
                  onClick={() => setShowAllOutcomes(true)}
                  className="text-xs font-semibold text-[#22C55E] hover:text-[#16A34A] pt-2 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <span>+{outcomes.length - 4} more — see all outcomes</span>
                </button>
              )}
            </div>

            {/* 5. Navigation Tabs (Syllabus, Outcomes, Instructor) */}
            <div className="pt-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-8 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('syllabus')}
                className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center space-x-2 ${
                  activeTab === 'syllabus'
                    ? 'border-black dark:border-white text-black dark:text-white'
                    : 'border-transparent text-slate-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>Syllabus</span>
                <span className="text-[11px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md font-mono text-slate-500">
                  {detailedModules.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('outcomes')}
                className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center space-x-2 ${
                  activeTab === 'outcomes'
                    ? 'border-black dark:border-white text-black dark:text-white'
                    : 'border-transparent text-slate-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>Outcomes</span>
                <span className="text-[11px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md font-mono text-slate-500">
                  10
                </span>
              </button>

              {course.resources && course.resources.length > 0 && (
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center space-x-2 ${
                    activeTab === 'materials'
                      ? 'border-[#22C55E] text-[#22C55E]'
                      : 'border-transparent text-slate-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Notes & Materials</span>
                  <span className="text-[11px] px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] font-bold rounded-md">
                    {course.resources.length}
                  </span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('instructor')}
                className={`pb-3 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'instructor'
                    ? 'border-black dark:border-white text-black dark:text-white'
                    : 'border-transparent text-slate-500 hover:text-black dark:hover:text-white'
                }`}
              >
                Instructor
              </button>
            </div>

            {/* 6. TAB CONTENT: Syllabus / Total Content */}
            {activeTab === 'syllabus' && (
              <div className="space-y-4">
                
                {/* Total Content Header */}
                <div className="flex items-center justify-between py-1">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      TOTAL CONTENT
                    </div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {hours} hours • {totalLessons} lessons
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const allExpanded = Object.keys(expandedModules).length === detailedModules.length;
                      if (allExpanded) {
                        setExpandedModules({});
                      } else {
                        const next: Record<string, boolean> = {};
                        detailedModules.forEach(m => { next[m.id] = true; });
                        setExpandedModules(next);
                      }
                    }}
                    className="text-xs text-slate-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {Object.keys(expandedModules).length === detailedModules.length ? 'Collapse all' : 'Expand all'}
                  </button>
                </div>

                {/* Accordion Modules List */}
                <div className="space-y-3">
                  {detailedModules.map((module, mIdx) => {
                    const isExpanded = !!expandedModules[module.id];
                    const modNum = String(mIdx + 1).padStart(2, '0');
                    const lessonCount = module.lessons.length;
                    const modDuration = module.lessons.reduce((acc, l) => acc + (l.durationMinutes || 10), 0);
                    const hoursText = Math.floor(modDuration / 60) > 0 ? `${Math.floor(modDuration / 60)}h ` : '';
                    const minutesText = `${modDuration % 60}m`;

                    return (
                      <div 
                        key={module.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all shadow-2xs"
                      >
                        {/* Module Header Bar */}
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="w-full text-left p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        >
                          <div className="space-y-1 pr-4">
                            <div className="text-[11px] font-bold text-[#22C55E] tracking-wider uppercase">
                              MODULE {modNum}
                            </div>
                            <div className="font-bold text-sm sm:text-[15px] text-slate-900 dark:text-white">
                              {module.title}
                            </div>
                            {module.description && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed pt-0.5">
                                {module.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center space-x-3 text-xs text-slate-500 flex-shrink-0">
                            <span>{lessonCount} lessons • {hoursText}{minutesText}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </button>

                        {/* Module Lessons List */}
                        {isExpanded && (
                          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 divide-y divide-slate-100 dark:divide-slate-800/80">
                            {module.lessons.map((lesson, lIdx) => {
                              const lNum = String(lIdx + 1).padStart(2, '0');
                              return (
                                <div 
                                  key={lesson.id}
                                  onClick={() => onEnroll(course)}
                                  className="p-3.5 sm:p-4 sm:pl-6 flex items-center justify-between hover:bg-white dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                                >
                                  <div className="flex items-center space-x-3 min-w-0 pr-4">
                                    <span className="font-mono text-xs text-slate-400 font-semibold">{lNum}</span>
                                    <span className="text-slate-400">&gt;</span>
                                    <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-[#22C55E] transition-colors truncate">
                                      {lesson.title}
                                    </span>
                                  </div>

                                  <div className="flex items-center space-x-2 text-xs text-slate-400 flex-shrink-0">
                                    {lesson.type === 'video' ? (
                                      <Play className="w-3 h-3 group-hover:text-[#22C55E]" />
                                    ) : lesson.type === 'quiz' ? (
                                      <Award className="w-3.5 h-3.5 text-[#22C55E]" />
                                    ) : (
                                      <Download className="w-3 h-3" />
                                    )}
                                    <span>{lesson.durationMinutes ? `${String(lesson.durationMinutes).padStart(2, '0')}:00` : '12:00'}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Outcomes */}
            {activeTab === 'outcomes' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Target Competencies & Skills
                </h3>
                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  {outcomes.map((outcome, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Materials */}
            {activeTab === 'materials' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-[#22C55E]" />
                      <span>Official Course Notes & Textbooks</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Download and study official accompanying course guides, reference sheets, and textbooks anytime.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {course.resources?.map((res, i) => (
                    <div 
                      key={res.id || i}
                      className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 bg-slate-50/50 dark:bg-slate-800/40 hover:border-[#22C55E] transition-all"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 font-bold text-xs uppercase">
                          PDF
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                            {res.title}
                          </h4>
                          {res.size && (
                            <span className="text-[11px] text-slate-400 mt-0.5 inline-block">
                              {res.size}
                            </span>
                          )}
                        </div>
                      </div>

                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-[#22C55E] hover:text-white hover:border-[#22C55E] text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Note</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Instructor */}
            {activeTab === 'instructor' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-slate-900 text-white font-bold text-xl flex items-center justify-center ring-4 ring-slate-100 dark:ring-slate-800">
                    {instructorInitials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {instructor.name}
                    </h3>
                    <p className="text-xs text-[#22C55E] font-medium">
                      {instructor.role}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      12,400+ Students • 14 Courses Published
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
                  {instructor.bio}
                </p>
              </div>
            )}

          </div>

          {/* ================= RIGHT COLUMN: Sticky Sidebar Card ================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* Main Purchase / Enrollment Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              
              {/* Video Thumbnail with Play Button Overlay */}
              <div 
                onClick={() => onEnroll(course)}
                className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer group"
              >
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white text-black flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold rounded-md">
                  Preview Course
                </span>
              </div>

              {/* Price & Action Buttons */}
              <div className="p-6 space-y-5">
                
                {/* Price Display */}
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    ${price}
                  </span>
                  <span className="text-base text-slate-400 line-through">
                    ${originalPrice}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] text-xs font-bold rounded-md">
                    50% off
                  </span>
                </div>

                {/* Main Action Buttons */}
                <div className="space-y-2.5">
                  <button
                    id="btn-enroll-course"
                    onClick={() => onEnroll(course)}
                    className="w-full py-3 px-4 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Enroll for ${price}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleSaveToggle}
                    className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Bookmark className={`w-4 h-4 ${savedForLater ? 'fill-[#22C55E] text-[#22C55E]' : ''}`} />
                    <span>{savedForLater ? 'Saved in Watchlist' : 'Save for later'}</span>
                  </button>
                </div>

                {/* "WHAT'S INCLUDED" Section */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    WHAT'S INCLUDED
                  </div>
                  <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center space-x-2.5">
                      <Play className="w-3.5 h-3.5 text-slate-400" />
                      <span>{hours}h of structured video lessons</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>{detailedModules.length} modules • {totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.resources && course.resources.length > 0 ? `${course.resources.length} downloadable course notes (PDF)` : '1 downloadable reference file'}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>Taught in English & Somali</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Monitor className="w-3.5 h-3.5 text-slate-400" />
                      <span>Access on mobile and desktop</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <InfinityIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>Lifetime access — learn at your own pace</span>
                    </div>
                  </div>
                </div>

                {/* "PREREQUISITES" Section */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    PREREQUISITES
                  </div>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    {prerequisites.map((req, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <span className="text-[#22C55E] mt-0.5">✓</span>
                        <span className="leading-snug">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* "COURSE DETAILS" Section */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    COURSE DETAILS
                  </div>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Language</span>
                      <span className="font-semibold text-slate-900 dark:text-white">English / Somali</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Duration</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{hours}h 37m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Lessons</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{totalLessons}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Certificate</span>
                      <span className="font-semibold text-[#22C55E]">Included</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
