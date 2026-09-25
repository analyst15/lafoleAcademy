export type LessonType = 'video' | 'quiz';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizData {
  id: string;
  title: string;
  description?: string;
  passingScorePercent: number; // e.g. 75 or 80
  questions: QuizQuestion[];
}

export interface VideoSource {
  label: string;
  url: string;
  resolution?: string;
}

export interface LessonResource {
  id: string;
  title: string;
  url: string;
  type: 'pdf' | 'link' | 'code' | 'github';
  size?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: LessonType;
  durationMinutes: number;
  durationSeconds?: number;
  // Video hosting properties
  videoUrl?: string;
  videoSources?: VideoSource[];
  videoThumbnail?: string;
  // Quiz properties
  quiz?: QuizData;
  resources?: LessonResource[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  thumbnail: string;
  estimatedHours: number;
  modules: Module[];
  updatedAt: string;
  tags: string[];
  price?: number;
  originalPrice?: number;
  discountPercent?: number;
  totalLessonsCount?: number;
  resources?: LessonResource[];
}

export interface QuizAttempt {
  attemptId: string;
  timestamp: string;
  score: number; // percent
  correctAnswersCount: number;
  totalQuestions: number;
  passed: boolean;
  selectedAnswers: number[];
}

export interface LessonProgress {
  lessonId: string;
  moduleId: string;
  courseId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  videoWatchSeconds: number;
  videoDurationSeconds: number;
  maxPercentageWatched: number; // e.g., 95 means 95%
  lastPlaybackPositionSeconds: number;
  completedAt?: string;
  quizAttempts: QuizAttempt[];
  bestQuizScore?: number;
}

export interface CourseProgress {
  courseId: string;
  percentComplete: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  totalTimeSpentSeconds: number;
  lastAccessedLessonId?: string;
  lastAccessedAt: string;
  isCertificateUnlocked: boolean;
  certificateIssuedAt?: string;
}

export interface VideoBookmarkNote {
  id: string;
  lessonId: string;
  timestampSeconds: number;
  text: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledDate: string;
  learningStreakDays: number;
  badges: StudentBadge[];
}

export interface StudentBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
}

export interface CohortStudentProgress {
  id: string;
  name: string;
  email: string;
  avatar: string;
  courseId: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  timeSpentHours: number;
  averageQuizScore: number;
  lastActive: string;
  status: 'active' | 'completed' | 'behind';
}

export interface CartItem {
  courseId: string;
  title: string;
  price: number;
  thumbnail: string;
  category?: string;
  instructorName?: string;
}
