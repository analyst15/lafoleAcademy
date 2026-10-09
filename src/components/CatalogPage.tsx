import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List as ListIcon, 
  ChevronDown, 
  Clock, 
  BookOpen, 
  ArrowRight,
  Check,
  X,
  Sparkles,
  ExternalLink,
  Play
} from 'lucide-react';
import { Course } from '../types';
import { CATALOG_SUBJECTS } from '../data/catalog93';

interface CatalogPageProps {
  courses: Course[];
  enrolledCourseIds?: string[];
  isStudentSignedIn?: boolean;
  onSelectCourse: (course: Course) => void;
  onResumeLearning?: (course: Course) => void;
  onBackToHome: () => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  courses,
  enrolledCourseIds = [],
  isStudentSignedIn = false,
  onSelectCourse,
  onResumeLearning,
  onBackToHome
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState<boolean>(true);
  
  // Sort state
  const [sortBy, setSortBy] = useState<'a-z' | 'z-a' | 'popular' | 'price-asc' | 'price-desc' | 'hours'>('a-z');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter and sort the courses
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Subject filter
        if (selectedSubject && course.category !== selectedSubject && !course.tags.includes(selectedSubject)) {
          return false;
        }

        // Level filter
        if (selectedLevel && course.level !== selectedLevel) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = course.title.toLowerCase().includes(q);
          const matchesInstructor = course.instructor.name.toLowerCase().includes(q);
          const matchesTags = course.tags.some((tag) => tag.toLowerCase().includes(q));
          const matchesCategory = course.category.toLowerCase().includes(q);
          if (!matchesTitle && !matchesInstructor && !matchesTags && !matchesCategory) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'a-z') return a.title.localeCompare(b.title);
        if (sortBy === 'z-a') return b.title.localeCompare(a.title);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'hours') return b.estimatedHours - a.estimatedHours;
        return 0; // Default curated order
      });
  }, [courses, selectedSubject, selectedLevel, searchQuery, sortBy]);

  const activeFiltersCount = (selectedSubject ? 1 : 0) + (selectedLevel ? 1 : 0) + (searchQuery.trim() ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedSubject(null);
    setSelectedLevel(null);
    setSearchQuery('');
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'a-z': return 'A to Z';
      case 'z-a': return 'Z to A';
      case 'popular': return 'Most Popular';
      case 'price-asc': return 'Price: Low to High';
      case 'price-desc': return 'Price: High to Low';
      case 'hours': return 'Duration: Longest';
      default: return 'A to Z';
    }
  };

  return (
    <main className="w-full flex-1 bg-[#F9F9F8] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors py-8 sm:py-10 pb-28">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section 1: Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-[#6B6B6B] dark:text-slate-400 mb-8 sm:mb-10 font-sans">
          <button 
            onClick={onBackToHome}
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Lafole
          </button>
          <span className="text-[#A3A3A3] select-none text-sm leading-none">›</span>
          <span className="text-slate-900 dark:text-slate-100 font-medium">
            Catalog
          </span>
        </nav>

        {/* Section 2: Hero Header & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 pb-8 sm:pb-10">
          
          {/* Left Column: Big Editorial Headline & Subtitle */}
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-[54px] lg:text-[60px] font-editorial leading-[1.08] tracking-tight text-slate-900 dark:text-white mb-4">
              <span className="font-instrument italic font-normal text-[#2E8B57] dark:text-[#34D399] text-[1.12em] mr-1">{courses.length}</span>
              <span className="font-editorial font-bold text-slate-950 dark:text-white">English </span>
              <span className="font-editorial italic font-normal text-[#767676] dark:text-slate-400">courses </span>
              <br />
              <span className="font-editorial font-bold text-slate-950 dark:text-white">available</span>
            </h1>
            <p className="text-sm sm:text-[15px] text-[#555555] dark:text-slate-400 font-sans leading-relaxed">
              Master essential vocabulary, pronunciation, grammar, and fluency with certified English language educators.
            </p>
          </div>

          {/* Right Column: Search Bar */}
          <div className="w-full sm:w-80 md:w-96 lg:w-[380px] flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, instructors, topics..."
                className="w-full pl-10 pr-11 py-2.5 bg-white dark:bg-slate-900 text-sm border border-[#E5E5E5] dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-[#999999] focus:outline-hidden focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 transition-all shadow-2xs"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <div 
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded border border-[#E5E5E5] dark:border-slate-800 bg-[#F9F9F8] dark:bg-slate-800 text-[11px] text-slate-400 font-mono select-none"
                  aria-hidden="true"
                >
                  ↵
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Section 3: Toolbar (All filters | View Switcher & Sort) */}
        <div className="border-y border-[#EBEBEB] dark:border-slate-800 py-3.5 flex items-center justify-between gap-4">
          
          {/* Left: "All filters" Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer shadow-2xs ${
              showFilters
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-[#D1D5DB] dark:border-slate-700'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-[#E5E5E5] dark:border-slate-800 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>All filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[10px] font-bold inline-flex items-center justify-center ml-1">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Right: View switcher & Sort controls */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            {/* View Switcher Segmented Control */}
            <div className="flex items-center bg-[#F1F1F0] dark:bg-slate-800/80 p-0.5 rounded-lg border border-[#E5E5E5] dark:border-slate-700/80 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="List view"
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-[#888888] dark:text-slate-400 text-[11px] tracking-wider uppercase select-none">
                  SORT
                </span>
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-900 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer py-1"
                >
                  <span>{getSortLabel()}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {sortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-30 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Sort by
                  </div>
                  {[
                    { id: 'a-z', label: 'A to Z' },
                    { id: 'z-a', label: 'Z to A' },
                    { id: 'popular', label: 'Most Popular' },
                    { id: 'price-asc', label: 'Price: Low to High' },
                    { id: 'price-desc', label: 'Price: High to Low' },
                    { id: 'hours', label: 'Duration: Longest' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id as any);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${
                        sortBy === option.id
                          ? 'text-[#2E8B57] dark:text-emerald-400 font-semibold bg-emerald-50/50 dark:bg-emerald-950/20'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.id && <Check className="w-3.5 h-3.5 text-[#2E8B57] dark:text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Section 4: Expanded Filters Panel (Subject & Level) */}
        {showFilters && (
          <div className="pt-6 pb-6 border-b border-[#EBEBEB] dark:border-slate-800 space-y-4">
            
            {/* Row 1: SUBJECT */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-4">
              <div className="text-[11px] font-bold text-[#888888] dark:text-slate-400 tracking-wider uppercase w-20 flex-shrink-0 pt-2 select-none">
                SUBJECT
              </div>
              <div className="flex flex-wrap gap-2 flex-1">
                {CATALOG_SUBJECTS.map((sub) => {
                  const isSelected = selectedSubject === sub.name;
                  return (
                    <button
                      key={sub.name}
                      onClick={() => {
                        setSelectedSubject(isSelected ? null : sub.name);
                      }}
                      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white font-medium shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-[#E5E5E5] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span>{sub.name}</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono leading-none ${
                          isSelected
                            ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                            : 'bg-[#F1F1F0] dark:bg-slate-800 text-[#777777] dark:text-slate-400'
                        }`}
                      >
                        {sub.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 2: LEVEL */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 pt-1">
              <div className="text-[11px] font-bold text-[#888888] dark:text-slate-400 tracking-wider uppercase w-20 flex-shrink-0 select-none">
                LEVEL
              </div>
              <div className="flex flex-wrap gap-2 flex-1">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => {
                  const isSelected = selectedLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => {
                        setSelectedLevel(isSelected ? null : lvl);
                      }}
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white font-medium shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-[#E5E5E5] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Results Counter & Active Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 pb-4 text-xs">
          <div className="text-slate-600 dark:text-slate-400 font-medium">
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredCourses.length}</span> of {courses.length} courses
            {selectedSubject && <span> in <strong className="text-slate-900 dark:text-white">{selectedSubject}</strong></span>}
            {selectedLevel && <span> ({selectedLevel})</span>}
            {searchQuery && <span> matching "{searchQuery}"</span>}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center space-x-1 text-xs text-[#E06A22] hover:text-[#c45615] font-semibold cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear active filters</span>
            </button>
          )}
        </div>

        {/* Section 5: Course Listing (Grid or List View) */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 my-4 p-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              No matching courses found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Try adjusting your search criteria or clear the filters to view all courses.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Reset Filters & Show All
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
            {filteredCourses.map((course) => {
              const isEnrolled = Boolean(
                isStudentSignedIn &&
                enrolledCourseIds &&
                (
                  enrolledCourseIds.includes(course.id) ||
                  enrolledCourseIds.includes(course.title) ||
                  (course.slug && enrolledCourseIds.includes(course.slug))
                )
              );

              return (
                <div
                  key={course.id}
                  onClick={() => {
                    if (isEnrolled && onResumeLearning) {
                      onResumeLearning(course);
                    } else {
                      onSelectCourse(course);
                    }
                  }}
                  className={`group bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer ${
                    isEnrolled
                      ? 'border-emerald-500/40 hover:border-emerald-500 ring-1 ring-emerald-500/20'
                      : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Card Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    
                    {/* Category Pill Tag on Image */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {course.category}
                    </div>

                    {/* Level Pill */}
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                      {course.level}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    {/* Instructor row */}
                    <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <img 
                        src={course.instructor.avatar} 
                        alt={course.instructor.name}
                        className="w-5 h-5 rounded-full object-cover" 
                      />
                      <span className="truncate">{course.instructor.name}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2 mb-3 group-hover:text-[#2E8B57] dark:group-hover:text-emerald-400 transition-colors">
                      {course.title}
                    </h3>

                    {/* Meta stats: hours and lessons */}
                    <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mb-4 mt-auto">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.estimatedHours}h</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.totalLessonsCount} lessons</span>
                      </span>
                    </div>

                    {/* Card Bottom: Resume Learning OR Orange Price Badge & Action Button */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      {isEnrolled ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onResumeLearning) onResumeLearning(course);
                            else onSelectCourse(course);
                          }}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Resume Learning</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <>
                          {/* Unified Orange Price Badge with White Font */}
                          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F97316] text-white shadow-xs">
                            <span className="font-extrabold text-sm text-white">${course.price}</span>
                            <span className="line-through text-xs text-white/80 font-normal">${course.originalPrice}</span>
                            <span className="text-[10px] font-black uppercase text-white tracking-tight bg-black/20 px-1 py-0.5 rounded">
                              -50%
                            </span>
                          </div>

                          {/* Quick action button */}
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-[#2E8B57] dark:group-hover:text-emerald-400 flex items-center space-x-1">
                            <span>Enroll</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="space-y-3 pt-2">
            {filteredCourses.map((course) => {
              const isEnrolled = Boolean(
                isStudentSignedIn &&
                enrolledCourseIds &&
                (
                  enrolledCourseIds.includes(course.id) ||
                  enrolledCourseIds.includes(course.title) ||
                  (course.slug && enrolledCourseIds.includes(course.slug))
                )
              );

              return (
                <div
                  key={course.id}
                  onClick={() => {
                    if (isEnrolled && onResumeLearning) {
                      onResumeLearning(course);
                    } else {
                      onSelectCourse(course);
                    }
                  }}
                  className={`group bg-white dark:bg-slate-900 rounded-2xl border p-4 sm:p-5 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                    isEnrolled
                      ? 'border-emerald-500/40 hover:border-emerald-500 ring-1 ring-emerald-500/20'
                      : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Left Thumbnail + Info */}
                  <div className="flex items-start sm:items-center space-x-4">
                    <div className="relative w-24 sm:w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-500 mb-1">
                        <span className="text-[#2E8B57] dark:text-emerald-400 font-bold uppercase tracking-wider">{course.category}</span>
                        <span>•</span>
                        <span>{course.level}</span>
                        <span>•</span>
                        <span>{course.instructor.name}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-[#2E8B57] dark:group-hover:text-emerald-400 transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{course.estimatedHours} hours</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <BookOpen className="w-3 h-3 text-slate-400" />
                          <span>{course.totalLessonsCount} lessons</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Resume Learning OR Orange Price Badge & Button */}
                  <div className="flex items-center justify-between sm:justify-end space-x-4 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    {isEnrolled ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onResumeLearning) onResumeLearning(course);
                          else onSelectCourse(course);
                        }}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Resume Learning</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <>
                        {/* Unified Orange Price Badge with White Font */}
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F97316] text-white shadow-xs">
                          <span className="font-extrabold text-sm text-white">${course.price}</span>
                          <span className="line-through text-xs text-white/80 font-normal">${course.originalPrice}</span>
                          <span className="text-[10px] font-black uppercase text-white tracking-tight bg-black/20 px-1 py-0.5 rounded">
                            -50%
                          </span>
                        </div>

                        <button className="px-4 py-2 bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900 rounded-full text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors">
                          <span>Start</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
};
