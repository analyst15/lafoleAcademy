import React, { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Download, 
  Eye, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Sparkles,
  Layers,
  Clock,
  Globe
} from 'lucide-react';
import { TECHNICAL_BOOKS, TechnicalBook } from '../data/books';

interface BooksPageProps {
  onBackToHome: () => void;
  onExploreCourses: () => void;
}

export const BooksPage: React.FC<BooksPageProps> = ({
  onBackToHome,
  onExploreCourses
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBookModal, setActiveBookModal] = useState<TechnicalBook | null>(null);
  const [readingSuccessToast, setReadingSuccessToast] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(TECHNICAL_BOOKS.map(b => b.category)));
    return ['All', ...cats];
  }, []);

  const filteredBooks = useMemo(() => {
    return TECHNICAL_BOOKS.filter(book => {
      const matchesCat = selectedCategory === 'All' || book.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        book.title.toLowerCase().includes(q) ||
        book.subtitle.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleDownload = (book: TechnicalBook) => {
    setReadingSuccessToast(`Downloading "${book.title}" (${book.downloadSize})... Complete!`);
    setTimeout(() => setReadingSuccessToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Toast Notification */}
      {readingSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] dark:bg-white text-white dark:text-black px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs sm:text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          <span>{readingSuccessToast}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <section className="w-full border-b border-[#E5E5E3] dark:border-slate-800/80 pt-8 pb-14 sm:pb-16 lg:pb-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-[#71717A] dark:text-slate-400 font-normal mb-8 sm:mb-10">
            <button 
              onClick={onBackToHome}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              Lafole
            </button>
            <span className="text-[#A1A1AA] dark:text-slate-500">&gt;</span>
            <span className="text-[#27272A] dark:text-slate-200 font-medium">Books</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 xl:col-span-7 space-y-5">
              
              {/* Kicker Label */}
              <div className="text-xs sm:text-[13px] font-semibold tracking-widest text-[#71717A] dark:text-slate-400 uppercase">
                TECHNICAL LIBRARY & STUDY GUIDES
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] dark:text-white tracking-tight leading-[1.15]">
                Practitioner guides & engineering{' '}
                <span className="font-serif italic font-normal text-[#22C55E] dark:text-[#4ADE80]">
                  manuals.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-[17px] text-[#374151] dark:text-slate-300 font-normal leading-relaxed max-w-2xl pt-1">
                Field-tested reference handbooks, CCNA lab manuals, Linux servers, and software engineering textbooks written in Somali and English by working engineers.
              </p>

              {/* Stats Row */}
              <div className="pt-6 sm:pt-8 flex flex-wrap items-baseline gap-6 sm:gap-14">
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                    8
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-[#71717A] dark:text-slate-400 tracking-wider uppercase mt-1">
                    HANDBOOKS
                  </div>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                    3,500+
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-[#71717A] dark:text-slate-400 tracking-wider uppercase mt-1">
                    PAGES
                  </div>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                    100%
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-[#71717A] dark:text-slate-400 tracking-wider uppercase mt-1">
                    FREE ACCESS
                  </div>
                </div>
              </div>

            </div>

            {/* Right side negative space */}
            <div className="hidden lg:block lg:col-span-4 xl:col-span-5" />

          </div>
        </div>
      </section>

      {/* Books Catalog Grid */}
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
              placeholder="Search books, manuals, authors..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-[13px] bg-white dark:bg-slate-900 border border-[#E5E5E3] dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
            />
          </div>
        </div>

        {/* Books Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 sm:pt-10">
          {filteredBooks.map((book) => (
            <div 
              key={book.id}
              className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Book Cover Banner */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={book.coverUrl} 
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5">
                    {book.badge && (
                      <span className="px-2.5 py-0.5 bg-[#22C55E] text-white text-[10px] font-bold uppercase rounded-md shadow-xs">
                        {book.badge}
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium rounded-md">
                      {book.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[11px] text-white/90">
                    <span className="flex items-center space-x-1 font-mono">
                      <FileText className="w-3 h-3" />
                      <span>{book.pages} pages</span>
                    </span>
                    <span className="bg-black/60 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
                      {book.language}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <h3 
                    onClick={() => setActiveBookModal(book)}
                    className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#22C55E] transition-colors cursor-pointer line-clamp-2"
                  >
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium line-clamp-1">
                    {book.subtitle}
                  </p>
                  <div className="text-[11px] text-[#22C55E] font-medium mt-2">
                    By {book.author}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveBookModal(book)}
                    className="flex-1 inline-flex items-center justify-center space-x-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read Preview</span>
                  </button>
                  <button
                    onClick={() => handleDownload(book)}
                    className="inline-flex items-center justify-center p-2 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                    title={`Download PDF (${book.downloadSize})`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* Book Reading / Preview Modal */}
      {activeBookModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setActiveBookModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
              <img 
                src={activeBookModal.coverUrl} 
                alt={activeBookModal.title}
                className="w-full sm:w-36 h-48 object-cover rounded-xl shadow-md flex-shrink-0"
              />
              <div>
                <span className="text-[11px] font-bold text-[#22C55E] uppercase tracking-wider">
                  {activeBookModal.category} • {activeBookModal.language}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {activeBookModal.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {activeBookModal.subtitle}
                </p>
                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-2">
                  Author: <span className="text-[#22C55E]">{activeBookModal.author}</span> ({activeBookModal.year})
                </div>
                <div className="flex items-center space-x-3 mt-3 text-xs text-slate-500">
                  <span>{activeBookModal.pages} Pages</span>
                  <span>•</span>
                  <span>PDF & ePub ({activeBookModal.downloadSize})</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {activeBookModal.description}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Table of Contents & Key Modules
              </h4>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {activeBookModal.chapters.map((ch, idx) => (
                  <div key={idx} className="text-xs text-slate-700 dark:text-slate-300 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <span>{ch}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 gap-3">
              <div className="text-xs text-slate-400">
                Full textbook access is included with your Lafole Academy membership.
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    handleDownload(activeBookModal);
                    setActiveBookModal(null);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full PDF ({activeBookModal.downloadSize})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
