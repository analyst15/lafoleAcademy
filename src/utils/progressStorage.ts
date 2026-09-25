import { LessonProgress, CourseProgress, QuizAttempt, VideoBookmarkNote } from '../types';

const PROGRESS_KEY = 'coursepulse_progress_v2';
const COURSE_SUMMARY_KEY = 'coursepulse_course_summary_v2';
const NOTES_KEY = 'coursepulse_video_notes_v2';

// Initial pre-populated progress state for demo richness
const DEFAULT_INITIAL_PROGRESS: Record<string, LessonProgress> = {
  'vocab-lesson-1': {
    lessonId: 'vocab-lesson-1',
    moduleId: 'mod-vocab-1',
    courseId: 'course-english-for-beginners',
    status: 'completed',
    videoWatchSeconds: 590,
    videoDurationSeconds: 600,
    maxPercentageWatched: 98,
    lastPlaybackPositionSeconds: 590,
    completedAt: '2026-09-22T14:30:00Z',
    quizAttempts: []
  },
  'vocab-lesson-2': {
    lessonId: 'vocab-lesson-2',
    moduleId: 'mod-vocab-1',
    courseId: 'course-english-for-beginners',
    status: 'in_progress',
    videoWatchSeconds: 280,
    videoDurationSeconds: 720,
    maxPercentageWatched: 39,
    lastPlaybackPositionSeconds: 280,
    quizAttempts: []
  },
  'beg-lesson-1': {
    lessonId: 'beg-lesson-1',
    moduleId: 'mod-primary-one',
    courseId: 'course-english-beginners-a1-a2',
    status: 'completed',
    videoWatchSeconds: 710,
    videoDurationSeconds: 720,
    maxPercentageWatched: 98,
    lastPlaybackPositionSeconds: 710,
    completedAt: '2026-09-24T08:00:00Z',
    quizAttempts: []
  },
  'beg-lesson-2': {
    lessonId: 'beg-lesson-2',
    moduleId: 'mod-primary-one',
    courseId: 'course-english-beginners-a1-a2',
    status: 'in_progress',
    videoWatchSeconds: 320,
    videoDurationSeconds: 720,
    maxPercentageWatched: 44,
    lastPlaybackPositionSeconds: 320,
    quizAttempts: []
  }
};

export function getStoredLessonProgress(): Record<string, LessonProgress> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(DEFAULT_INITIAL_PROGRESS));
      return DEFAULT_INITIAL_PROGRESS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse lesson progress:', e);
    return DEFAULT_INITIAL_PROGRESS;
  }
}

export function saveLessonProgress(progressMap: Record<string, LessonProgress>): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressMap));
  } catch (e) {
    console.error('Failed to save lesson progress:', e);
  }
}

/**
 * Update video watching progress and automatically evaluate completion threshold (>= 90%)
 */
export function updateVideoWatchProgress(
  lessonId: string,
  moduleId: string,
  courseId: string,
  currentTimeSeconds: number,
  durationSeconds: number,
  completionThreshold = 90
): { progress: LessonProgress; justCompleted: boolean } {
  const all = getStoredLessonProgress();
  const existing = all[lessonId] || {
    lessonId,
    moduleId,
    courseId,
    status: 'in_progress',
    videoWatchSeconds: 0,
    videoDurationSeconds: durationSeconds,
    maxPercentageWatched: 0,
    lastPlaybackPositionSeconds: 0,
    quizAttempts: []
  };

  const currentPercent = durationSeconds > 0 ? (currentTimeSeconds / durationSeconds) * 100 : 0;
  const maxPercent = Math.min(100, Math.max(existing.maxPercentageWatched || 0, Math.round(currentPercent)));
  const watchSeconds = Math.max(existing.videoWatchSeconds || 0, Math.round(currentTimeSeconds));

  const previouslyCompleted = existing.status === 'completed';
  const shouldMarkCompleted = maxPercent >= completionThreshold;
  const justCompleted = !previouslyCompleted && shouldMarkCompleted;

  const updated: LessonProgress = {
    ...existing,
    videoWatchSeconds: watchSeconds,
    videoDurationSeconds: durationSeconds,
    maxPercentageWatched: maxPercent,
    lastPlaybackPositionSeconds: Math.round(currentTimeSeconds),
    status: previouslyCompleted || shouldMarkCompleted ? 'completed' : 'in_progress',
    completedAt: previouslyCompleted
      ? existing.completedAt
      : shouldMarkCompleted
      ? new Date().toISOString()
      : undefined
  };

  all[lessonId] = updated;
  saveLessonProgress(all);

  return { progress: updated, justCompleted };
}

/**
 * Record a quiz attempt and automatically mark lesson complete if score passes threshold
 */
export function recordQuizAttempt(
  lessonId: string,
  moduleId: string,
  courseId: string,
  attempt: QuizAttempt,
  passingScorePercent: number
): { progress: LessonProgress; justPassed: boolean } {
  const all = getStoredLessonProgress();
  const existing = all[lessonId] || {
    lessonId,
    moduleId,
    courseId,
    status: 'in_progress',
    videoWatchSeconds: 0,
    videoDurationSeconds: 0,
    maxPercentageWatched: 0,
    lastPlaybackPositionSeconds: 0,
    quizAttempts: []
  };

  const attempts = [...(existing.quizAttempts || []), attempt];
  const bestScore = Math.max(existing.bestQuizScore || 0, attempt.score);
  const previouslyPassed = existing.status === 'completed';
  const passedNow = attempt.passed || attempt.score >= passingScorePercent;
  const justPassed = !previouslyPassed && passedNow;

  const updated: LessonProgress = {
    ...existing,
    quizAttempts: attempts,
    bestQuizScore: bestScore,
    status: previouslyPassed || passedNow ? 'completed' : 'in_progress',
    completedAt: previouslyPassed ? existing.completedAt : passedNow ? new Date().toISOString() : undefined
  };

  all[lessonId] = updated;
  saveLessonProgress(all);

  return { progress: updated, justPassed };
}

/**
 * Calculate automated overall course progress
 */
export function calculateCourseProgress(
  courseId: string,
  totalLessonsCount: number,
  allLessonsIds: string[]
): CourseProgress {
  const progressMap = getStoredLessonProgress();
  let completedCount = 0;
  let totalTimeSpent = 0;

  allLessonsIds.forEach((id) => {
    const p = progressMap[id];
    if (p) {
      if (p.status === 'completed') {
        completedCount += 1;
      }
      totalTimeSpent += p.videoWatchSeconds || 0;
      if (p.quizAttempts && p.quizAttempts.length > 0) {
        // approximate 3 mins (180s) per quiz attempt
        totalTimeSpent += p.quizAttempts.length * 180;
      }
    }
  });

  const percent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;
  const isCertificateUnlocked = percent >= 100;

  const storedSummary = getStoredCourseSummary(courseId);
  const updatedSummary: CourseProgress = {
    courseId,
    percentComplete: percent,
    completedLessonsCount: completedCount,
    totalLessonsCount,
    totalTimeSpentSeconds: totalTimeSpent,
    lastAccessedLessonId: storedSummary?.lastAccessedLessonId,
    lastAccessedAt: new Date().toISOString(),
    isCertificateUnlocked,
    certificateIssuedAt: isCertificateUnlocked ? (storedSummary?.certificateIssuedAt || new Date().toISOString()) : undefined
  };

  saveCourseSummary(courseId, updatedSummary);
  return updatedSummary;
}

export function getStoredCourseSummary(courseId: string): CourseProgress | null {
  try {
    const raw = localStorage.getItem(`${COURSE_SUMMARY_KEY}_${courseId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveCourseSummary(courseId: string, summary: CourseProgress): void {
  try {
    localStorage.setItem(`${COURSE_SUMMARY_KEY}_${courseId}`, JSON.stringify(summary));
  } catch (e) {
    console.error('Failed to save course summary:', e);
  }
}

// Notes management
export function getLessonNotes(lessonId: string): VideoBookmarkNote[] {
  try {
    const raw = localStorage.getItem(`${NOTES_KEY}_${lessonId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addLessonNote(lessonId: string, timestampSeconds: number, text: string): VideoBookmarkNote {
  const notes = getLessonNotes(lessonId);
  const newNote: VideoBookmarkNote = {
    id: 'note_' + Date.now(),
    lessonId,
    timestampSeconds: Math.round(timestampSeconds),
    text: text.trim(),
    createdAt: new Date().toISOString()
  };
  const updated = [...notes, newNote].sort((a, b) => a.timestampSeconds - b.timestampSeconds);
  localStorage.setItem(`${NOTES_KEY}_${lessonId}`, JSON.stringify(updated));
  return newNote;
}

export function deleteLessonNote(lessonId: string, noteId: string): void {
  const notes = getLessonNotes(lessonId);
  const updated = notes.filter((n) => n.id !== noteId);
  localStorage.setItem(`${NOTES_KEY}_${lessonId}`, JSON.stringify(updated));
}

// Reset progress utility for testing
export function resetCourseProgress(courseId: string, lessonIds: string[]): void {
  const all = getStoredLessonProgress();
  lessonIds.forEach((id) => {
    delete all[id];
  });
  saveLessonProgress(all);
  localStorage.removeItem(`${COURSE_SUMMARY_KEY}_${courseId}`);
}
