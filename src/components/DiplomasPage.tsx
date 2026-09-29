import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  Cpu,
  Server,
  Cloud,
  Shield,
  Code2,
  Palette,
  BarChart3,
  Search, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  X,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { DIPLOMA_TRACKS, DiplomaTrack } from '../data/diplomas';
import { Course } from '../types';

interface DiplomasPageProps {
  onBackToHome: () => void;
  onSelectTrack: (track: DiplomaTrack) => void;
  onStartCourse: (course: Course) => void;
  courses: Course[];
}

export const DiplomasPage: React.FC<DiplomasPageProps> = ({
  onBackToHome,
  onSelectTrack,
  onStartCourse,
  courses
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalTrack, setActiveModalTrack] = useState<DiplomaTrack | null>(null);
  const [expandedCurriculumId, setExpandedCurriculumId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(DIPLOMA_TRACKS.map(t => t.category)));
    return ['All', ...cats];
  }, []);

  const filteredTracks = useMemo(() => {
    return DIPLOMA_TRACKS.filter(track => {
      const matchesCat = selectedCategory === 'All' || track.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        track.title.toLowerCase().includes(q) ||
        track.description.toLowerCase().includes(q) ||
        track.careerRoles.some(r => r.toLowerCase().includes(q)) ||
        track.courseNames.some(c => c.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleEnrollOrStart = (track: DiplomaTrack) => {
    // Find matching course from catalog or default to first course
    const matched = courses.find(c => 
      c.title.toLowerCase().includes(track.courseNames[0].toLowerCase().slice(0, 10)) ||
      c.category.toLowerCase().includes(track.category.toLowerCase().slice(0, 5))
    ) || courses[0];

    onSelectTrack(track);
    onStartCourse(matched);
  };

  const renderFloatingIcon = (type: DiplomaTrack['iconType']) => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-6 h-6 stroke-[1.75]" />;
      case 'cpu':
        return <Cpu className="w-6 h-6 stroke-[1.75]" />;
      case 'network':
        return <Server className="w-6 h-6 stroke-[1.75]" />;
      case 'cloud':
        return <Cloud className="w-6 h-6 stroke-[1.75]" />;
      case 'shield':
        return <Shield className="w-6 h-6 stroke-[1.75]" />;
      case 'code':
        return <Code2 className="w-6 h-6 stroke-[1.75]" />;
      case 'palette':
        return <Palette className="w-6 h-6 stroke-[1.75]" />;
      case 'chart':
        return <BarChart3 className="w-6 h-6 stroke-[1.75]" />;
      default:
        return <BookOpen className="w-6 h-6 stroke-[1.75]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 
        HERO SECTION:
        Pixel-accurate reproduction of the reference screenshot:
        - Breadcrumb: Lafole > Diplomas
        - Kicker: DIPLOMA PATHS
        - Headline: Multi-course paths into a real job. ("real job." in italicized serif font and green #3FA33F)
        - Subtitle: Every diploma is a structured curriculum of courses, real labs, and an accredited certificate...
        - Stats: 8 PATHS, 68 COURSES, 5,371 LESSONS
        - Negative space on the right side
      */}
      <section className="w-full border-b border-[#E5E5E3] dark:border-slate-800/80 pt-8 pb-14 sm:pb-16 lg:pb-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-[#71717A] dark:text-slate-400 font-normal mb-8 sm:mb-10">
            <button 
              onClick={onBackToHome}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              Lafole
            </button>
            <span className="text-[#A1A1AA] dark:text-slate-500">&gt;</span>
            <span className="text-[#27272A] dark:text-slate-200 font-medium">Diplomas</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 xl:col-span-7 space-y-5">
              
              {/* Kicker Label */}
              <div className="text-xs sm:text-[13px] font-semibold tracking-widest text-[#71717A] dark:text-slate-400 uppercase">
                DIPLOMA PATHS
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] dark:text-white tracking-tight leading-[1.15]">
                Multi-course paths into a{' '}
                <span className="font-serif italic font-normal text-[#3FA33F] dark:text-[#4ADE80]">
                  real job.
                </span>
              </h1>

              {/* Subtitle Description */}
              <p className="text-base sm:text-[17px] text-[#374151] dark:text-slate-300 font-normal leading-relaxed max-w-2xl pt-1">
                Every diploma is a structured curriculum of courses, real labs, and an accredited certificate. 
                Pick the path that maps to where you want to work — or who you want to become.
              </p>

              {/* Key Metrics / Stats */}
              <div className="pt-6 sm:pt-8 flex flex-wrap items-baseline gap-6 sm:gap-14">
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                    8
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-[#71717A] dark:text-slate-400 tracking-wider uppercase mt-1">
                    PATHS
                  </div>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                    68
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-[#71717A] dark:text-slate-400 tracking-wider uppercase mt-1">
                    COURSES
                  </div>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                    5,371
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-[#71717A] dark:text-slate-400 tracking-wider uppercase mt-1">
                    LESSONS
                  </div>
                </div>
              </div>

            </div>

            {/* Right side: generous open negative space as in the reference */}
            <div className="hidden lg:block lg:col-span-4 xl:col-span-5" />

          </div>
        </div>
      </section>

      {/* DIPLOMA COURSES CATALOG SECTION (Following reference image layout) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
        
        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#E5E5E3] dark:border-slate-800">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none text-xs sm:text-[13px] font-medium">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#111111] text-white dark:bg-white dark:text-black shadow-xs font-semibold'
                    : 'bg-white dark:bg-slate-900 border border-[#E5E5E3] dark:border-slate-800 text-[#52525B] dark:text-slate-300 hover:text-black dark:hover:text-white hover:border-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search diploma courses..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-[13px] bg-white dark:bg-slate-900 border border-[#E5E5E3] dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
            />
          </div>
        </div>

        {/* 2-Column Responsive Grid matching reference image: https://firebasestorage.googleapis.com/.../Dilomas%20-%201.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-8 sm:pt-10">
          {filteredTracks.map((track) => {
            const isCurriculumExpanded = expandedCurriculumId === track.id;

            return (
              <div 
                key={track.id}
                className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col group"
              >
                {/* 1. Header Media Area: Image + Badges + Floating Icon Overlap */}
                <div className="relative w-full aspect-[16/9] sm:aspect-[16/8.8] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={track.imageUrl} 
                    alt={track.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Subtle gradient vignette for badge legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

                  {/* Top-Left Overlay Badges */}
                  <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
                    {/* Level Pill Badge */}
                    <span className="px-3 py-1 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-bold tracking-wider rounded-full uppercase shadow-xs">
                      {track.levelPill}
                    </span>

                    {/* Duration Pill Badge with Green Dot */}
                    <span className="px-3 py-1 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-semibold rounded-full flex items-center space-x-1.5 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                      <span>• {track.durationPill}</span>
                    </span>
                  </div>

                  {/* Floating Icon Badge (Overlapping the bottom-right border of the image) */}
                  <div className="absolute right-6 -bottom-5 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#DBEAFE] dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:scale-110 transition-transform">
                    {renderFloatingIcon(track.iconType)}
                  </div>
                </div>

                {/* 2. Content Body Area */}
                <div className="p-6 sm:p-7 pt-7 sm:pt-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3 
                      onClick={() => handleEnrollOrStart(track)}
                      className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-[#22C55E] transition-colors cursor-pointer"
                    >
                      {track.title}
                    </h3>

                    {/* Description in Somali / Tech Education */}
                    <p className="mt-2.5 text-xs sm:text-[14px] text-slate-600 dark:text-slate-400 font-normal leading-relaxed line-clamp-2">
                      {track.description}
                    </p>

                    {/* Dotted Divider Line */}
                    <div className="my-5 border-t border-dotted border-slate-200 dark:border-slate-800 w-full" />

                    {/* 3-Column Metadata Stats Row */}
                    <div className="grid grid-cols-3 gap-2 text-left mb-2">
                      {/* 1. Courses Count */}
                      <div>
                        <div className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                          {track.coursesCount}
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
                          COURSES
                        </div>
                      </div>

                      {/* 2. Lessons Count */}
                      <div>
                        <div className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                          {track.lessonsCount.toLocaleString()}
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
                          LESSONS
                        </div>
                      </div>

                      {/* 3. Instruction Hours */}
                      <div>
                        <div className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                          {track.estimatedHours}h
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
                          INSTRUCTION
                        </div>
                      </div>
                    </div>

                    {/* Expandable Curriculum Preview Toggle */}
                    {isCurriculumExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-fadeIn">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                          <span>Included Courses Syllabus ({track.coursesCount})</span>
                        </div>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {track.courseNames.map((cName, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg"
                            >
                              <span className="font-mono text-[10px] font-bold text-slate-400 mt-0.5">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <span>{cName}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                          <strong>Accreditation: </strong>{track.certifications.join(' • ')}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Card Footer Area: Price on Left, "View path →" on Right */}
                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    {/* Left: Price Block */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                        FROM
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        ${track.price}
                      </span>
                    </div>

                    {/* Right: Actions (Syllabus toggle + View path →) */}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setExpandedCurriculumId(isCurriculumExpanded ? null : track.id)}
                        className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer hidden sm:inline-flex items-center space-x-1"
                        title="View Syllabus"
                      >
                        <span>{isCurriculumExpanded ? 'Hide' : 'Curriculum'}</span>
                        {isCurriculumExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      <button
                        onClick={() => handleEnrollOrStart(track)}
                        className="inline-flex items-center space-x-1.5 text-sm sm:text-[15px] font-semibold text-[#22C55E] hover:text-[#16A34A] transition-colors cursor-pointer group/btn"
                      >
                        <span>View path</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* Track Details Modal (Optional detailed drawer/modal when requested) */}
      {activeModalTrack && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setActiveModalTrack(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] dark:bg-slate-800 border border-[#DBEAFE] dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-100">
                {renderFloatingIcon(activeModalTrack.iconType)}
              </div>
              <div>
                <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
                  {activeModalTrack.levelPill} • {activeModalTrack.durationPill}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {activeModalTrack.title}
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              {activeModalTrack.description}
            </p>

            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-6 text-center">
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{activeModalTrack.coursesCount}</div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Courses</div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{activeModalTrack.lessonsCount}</div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Lessons</div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{activeModalTrack.estimatedHours}h</div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Instruction</div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Complete Curriculum ({activeModalTrack.coursesCount} Courses)
              </h4>
              <div className="space-y-2">
                {activeModalTrack.courseNames.map((name, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <span className="font-mono font-bold text-slate-400">{i + 1}.</span>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs text-slate-400 uppercase block">Investment</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">${activeModalTrack.price}</span>
              </div>
              <button
                onClick={() => {
                  setActiveModalTrack(null);
                  handleEnrollOrStart(activeModalTrack);
                }}
                className="px-5 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
              >
                Enroll & Start Path
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
