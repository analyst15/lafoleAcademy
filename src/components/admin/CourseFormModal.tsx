import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  GraduationCap, 
  DollarSign, 
  Clock, 
  BookOpen, 
  User, 
  Tag, 
  Image as ImageIcon, 
  Sparkles,
  AlertCircle,
  Loader2,
  Check
} from 'lucide-react';
import { Course } from '../../types';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: Partial<Course>) => Promise<void>;
  initialCourse?: Course | null;
}

const CATEGORY_OPTIONS = [
  'English for Beginners',
  'Intermediate English',
  'Grammar & Writing',
  'Speaking & Pronunciation',
  'Conversational English',
  'Business English',
  'Networking & Cisco',
  'Cyber Security',
  'Cloud & DevOps',
  'Telecom & ISP',
  'Python & Automation'
];

const LEVEL_OPTIONS: ('Beginner' | 'Intermediate' | 'Advanced')[] = [
  'Beginner',
  'Intermediate',
  'Advanced'
];

const PRESET_THUMBNAILS = [
  'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2F1.png?alt=media&token=66f78e8f-faee-4d9a-acff-11bbf52273fc',
  'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2FYellow%20Black%20Modern%20Course%20YouTube%20Thumbnail.png?alt=media&token=58075f8e-7a43-420b-8ceb-62aaed33c422',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80'
];

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCourse
}) => {
  const isEditing = Boolean(initialCourse);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [price, setPrice] = useState('25');
  const [originalPrice, setOriginalPrice] = useState('50');
  const [estimatedHours, setEstimatedHours] = useState('14');
  const [totalLessonsCount, setTotalLessonsCount] = useState('24');
  const [thumbnail, setThumbnail] = useState(PRESET_THUMBNAILS[0]);
  const [instructorName, setInstructorName] = useState('Abdifatah Jama');
  const [instructorRole, setInstructorRole] = useState('Lead Language Educator');
  const [tagsInput, setTagsInput] = useState('English, Grammar, Vocabulary');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialCourse) {
      setTitle(initialCourse.title || '');
      setSubtitle(initialCourse.subtitle || '');
      setDescription(initialCourse.description || '');
      if (CATEGORY_OPTIONS.includes(initialCourse.category)) {
        setCategory(initialCourse.category);
        setCustomCategory('');
      } else {
        setCategory('Other');
        setCustomCategory(initialCourse.category || '');
      }
      setLevel(initialCourse.level || 'Beginner');
      setPrice(String(initialCourse.price ?? 25));
      setOriginalPrice(String(initialCourse.originalPrice ?? 50));
      setEstimatedHours(String(initialCourse.estimatedHours ?? 14));
      setTotalLessonsCount(String(initialCourse.totalLessonsCount ?? 24));
      setThumbnail(initialCourse.thumbnail || PRESET_THUMBNAILS[0]);
      setInstructorName(initialCourse.instructor?.name || 'Abdifatah Jama');
      setInstructorRole(initialCourse.instructor?.role || 'Lead Language Educator');
      setTagsInput(initialCourse.tags?.join(', ') || 'English, Vocabulary');
    } else {
      // Default reset for new course
      setTitle('');
      setSubtitle('');
      setDescription('');
      setCategory(CATEGORY_OPTIONS[0]);
      setCustomCategory('');
      setLevel('Beginner');
      setPrice('25');
      setOriginalPrice('50');
      setEstimatedHours('14');
      setTotalLessonsCount('24');
      setThumbnail(PRESET_THUMBNAILS[0]);
      setInstructorName('Abdifatah Jama');
      setInstructorRole('Lead Language Educator');
      setTagsInput('English, Beginners, Practical Skills');
    }
    setErrorMessage(null);
  }, [initialCourse, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setErrorMessage('Please enter a course title.');
      return;
    }

    const finalCategory = category === 'Other' && customCategory.trim() 
      ? customCategory.trim() 
      : category;

    const parsedPrice = parseFloat(price) || 0;
    const parsedOriginalPrice = parseFloat(originalPrice) || (parsedPrice * 2);
    const discount = parsedOriginalPrice > 0 
      ? Math.round(((parsedOriginalPrice - parsedPrice) / parsedOriginalPrice) * 100) 
      : 0;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const coursePayload: Partial<Course> = {
      ...(initialCourse ? { id: initialCourse.id } : {}),
      title: cleanTitle,
      subtitle: subtitle.trim() || 'Comprehensive Practical Curriculum',
      description: description.trim() || 'Technical course designed by practitioners at Lafole Academy.',
      category: finalCategory,
      level,
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      discountPercent: discount > 0 ? discount : 0,
      estimatedHours: parseInt(estimatedHours, 10) || 12,
      totalLessonsCount: parseInt(totalLessonsCount, 10) || 20,
      thumbnail: thumbnail.trim() || PRESET_THUMBNAILS[0],
      instructor: {
        name: instructorName.trim() || 'Abdifatah Jama',
        role: instructorRole.trim() || 'Lead Instructor',
        avatar: initialCourse?.instructor?.avatar || 'https://firebasestorage.googleapis.com/v0/b/keiyian-farm.firebasestorage.app/o/Thumbnails%2FYellow%20Black%20Modern%20Course%20YouTube%20Thumbnail.png?alt=media&token=58075f8e-7a43-420b-8ceb-62aaed33c422',
        bio: initialCourse?.instructor?.bio || 'Experienced educator and practitioner.'
      },
      tags: parsedTags.length > 0 ? parsedTags : [cleanTitle, finalCategory],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setIsSaving(true);
    try {
      await onSave(coursePayload);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save course. Please verify fields.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Edit Course Details' : 'Create New Course'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing 
                  ? 'Update course metadata, pricing, and curriculum availability' 
                  : 'Add a new course to Lafole Academy catalog & frontend'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Course Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. English Beginners Level (A1-A2)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Course Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Master Everyday English Fundamentals, Core Vocabulary & Conversational Fluency"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comprehensive syllabus overview, target outcomes, and module descriptions..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Grid: Category & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                <option value="Other">Other (Custom Category)</option>
              </select>
              {category === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter custom category name..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="mt-1.5 w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              )}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {LEVEL_OPTIONS.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid: Price, Original Price, Estimated Hours, Lessons Count */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Price (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Regular Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Duration (Hours)
              </label>
              <input
                type="number"
                min="1"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Lesson Count
              </label>
              <input
                type="number"
                min="1"
                value={totalLessonsCount}
                onChange={(e) => setTotalLessonsCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Instructor Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Lead Instructor
              </label>
              <input
                type="text"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                placeholder="e.g. Abdifatah Jama"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Instructor Role / Title
              </label>
              <input
                type="text"
                value={instructorRole}
                onChange={(e) => setInstructorRole(e.target.value)}
                placeholder="e.g. Senior Instructor"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Thumbnail Image URL & Presets */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Thumbnail Image URL</span>
              <span className="text-[11px] text-slate-400 font-normal">Choose preset or paste direct link</span>
            </label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://... image link"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
            />
            {/* Quick preset selector */}
            <div className="flex items-center space-x-2 pt-1 overflow-x-auto no-scrollbar pb-1">
              {PRESET_THUMBNAILS.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setThumbnail(img)}
                  className={`w-14 h-9 rounded-lg border-2 overflow-hidden flex-shrink-0 cursor-pointer transition-all ${
                    thumbnail === img ? 'border-emerald-500 scale-105 shadow-xs' : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="English, Beginners, Grammar, Pronunciation"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold transition-all shadow-sm flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Create Course'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
