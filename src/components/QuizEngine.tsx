import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  AlertTriangle,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, QuizData, LessonProgress, QuizAttempt } from '../types';

interface QuizEngineProps {
  lesson: Lesson;
  moduleId: string;
  courseId: string;
  progress?: LessonProgress;
  onQuizCompleted: (attempt: QuizAttempt, passed: boolean) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  lesson,
  progress,
  onQuizCompleted
}) => {
  const quiz: QuizData | undefined = lesson.quiz;

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);

  // Initialize selected answers when quiz changes
  useEffect(() => {
    if (quiz) {
      // If student already has attempts, load the best/last attempt
      const attempts = progress?.quizAttempts || [];
      if (attempts.length > 0) {
        const latest = attempts[attempts.length - 1];
        setLastAttempt(latest);
        setSelectedAnswers(latest.selectedAnswers || new Array(quiz.questions.length).fill(-1));
        setSubmitted(true);
      } else {
        setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
        setSubmitted(false);
        setLastAttempt(null);
      }
      setCurrentQuestionIdx(0);
    }
  }, [lesson.id, quiz]);

  if (!quiz) {
    return (
      <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-2" />
        <p className="text-slate-600 dark:text-slate-300">No quiz data configured for this lesson.</p>
      </div>
    );
  }

  const handleSelectOption = (optionIndex: number) => {
    if (submitted) return; // Locked once evaluated
    setSelectedAnswers(prev => {
      const next = [...prev];
      next[currentQuestionIdx] = optionIndex;
      return next;
    });
  };

  const calculateResults = (): QuizAttempt => {
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScorePercent;

    return {
      attemptId: 'att_' + Date.now(),
      timestamp: new Date().toISOString(),
      score,
      correctAnswersCount: correctCount,
      totalQuestions: quiz.questions.length,
      passed,
      selectedAnswers: [...selectedAnswers]
    };
  };

  const handleSubmitQuiz = () => {
    // Check if all questions are answered
    const unanswered = selectedAnswers.filter(a => a === -1 || a === undefined).length;
    if (unanswered > 0) {
      const confirmSubmit = window.confirm(`You have ${unanswered} unanswered question(s). Are you sure you want to submit?`);
      if (!confirmSubmit) return;
    }

    const attempt = calculateResults();
    setLastAttempt(attempt);
    setSubmitted(true);

    if (attempt.passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }

    onQuizCompleted(attempt, attempt.passed);
  };

  const handleRetake = () => {
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
    setSubmitted(false);
    setCurrentQuestionIdx(0);
  };

  const currentQ = quiz.questions[currentQuestionIdx];
  const allAnswered = selectedAnswers.every(a => a !== -1 && a !== undefined);
  const bestScore = progress?.bestQuizScore ?? lastAttempt?.score ?? 0;
  const isLessonCompleted = progress?.status === 'completed' || (lastAttempt?.passed ?? false);

  return (
    <div className="space-y-6">
      {/* Quiz Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              Technical Assessment
            </span>
            <span className="text-xs text-slate-400">
              Passing grade: {quiz.passingScorePercent}%
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {quiz.title}
          </h2>
          {quiz.description && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {quiz.description}
            </p>
          )}
        </div>

        {/* Score & Progress Badge */}
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Automated Status</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {isLessonCompleted ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" /> Passed ({bestScore}%)
                </span>
              ) : lastAttempt ? (
                <span className="text-red-500 flex items-center">
                  <XCircle className="w-3.5 h-3.5 mr-1 inline" /> Failed ({lastAttempt.score}%)
                </span>
              ) : (
                <span className="text-amber-500">Not Attempted</span>
              )}
            </div>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
            isLessonCompleted 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
          }`}>
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Results Banner if Submitted */}
      {submitted && lastAttempt && (
        <div className={`rounded-2xl p-5 border ${
          lastAttempt.passed
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
            : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-xl mt-0.5 ${
                lastAttempt.passed ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {lastAttempt.passed ? <Sparkles className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                <h3 className={`text-base font-bold ${
                  lastAttempt.passed ? 'text-emerald-900 dark:text-emerald-200' : 'text-red-900 dark:text-red-200'
                }`}>
                  {lastAttempt.passed 
                    ? `Assessment Passed with ${lastAttempt.score}%!` 
                    : `Score: ${lastAttempt.score}% (Passing: ${quiz.passingScorePercent}%)`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                  {lastAttempt.passed
                    ? `Great job! You answered ${lastAttempt.correctAnswersCount} of ${lastAttempt.totalQuestions} questions correctly. Progress has been automatically recorded to your course transcript.`
                    : `You answered ${lastAttempt.correctAnswersCount} of ${lastAttempt.totalQuestions} correctly. Review the explanations below and retake to meet the ${quiz.passingScorePercent}% threshold.`}
                </p>
              </div>
            </div>

            <button
              id="btn-retake-quiz"
              onClick={handleRetake}
              className="flex items-center space-x-1.5 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm transition-colors flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Question Header & Navigation Tabs */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Question {currentQuestionIdx + 1} of {quiz.questions.length}
          </div>

          {/* Question Step Indicator Pills */}
          <div className="flex items-center space-x-1.5">
            {quiz.questions.map((_, idx) => {
              const answered = selectedAnswers[idx] !== -1 && selectedAnswers[idx] !== undefined;
              const isCurrent = currentQuestionIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30'
                      : submitted
                      ? selectedAnswers[idx] === quiz.questions[idx].correctIndex
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                      : answered
                      ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                  title={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Prompt */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options List */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;
              const isCorrect = optIdx === currentQ.correctIndex;
              
              let optionStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-300';
              
              if (submitted) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-red-50 dark:bg-red-950/40 border-red-400 dark:border-red-600 text-red-900 dark:text-red-200';
                } else {
                  optionStyle = 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500/20';
              }

              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between cursor-pointer transition-all ${optionStyle}`}
                >
                  <div className="flex items-center space-x-3 pr-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </div>

                  {submitted && (
                    <div className="flex-shrink-0 ml-2">
                      {isCorrect && (
                        <span className="flex items-center text-emerald-600 text-xs font-bold">
                          <Check className="w-4 h-4 mr-1" /> Correct Answer
                        </span>
                      )}
                      {isSelected && !isCorrect && (
                        <span className="flex items-center text-red-600 text-xs font-bold">
                          <XCircle className="w-4 h-4 mr-1" /> Your Choice
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Answer Explanation (Shown when submitted) */}
        {submitted && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1.5 animate-fadeIn">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <FileCheck2 className="w-4 h-4 text-indigo-500" />
              <span>Technical Explanation:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Action Controls & Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            id="btn-prev-question"
            disabled={currentQuestionIdx === 0}
            onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            {currentQuestionIdx < quiz.questions.length - 1 ? (
              <button
                id="btn-next-question"
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                className="flex items-center space-x-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : !submitted ? (
              <button
                id="btn-submit-quiz"
                onClick={handleSubmitQuiz}
                className="flex items-center space-x-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Submit Assessment</span>
              </button>
            ) : (
              <button
                onClick={handleRetake}
                className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
