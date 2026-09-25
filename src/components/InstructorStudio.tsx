import React, { useState } from 'react';
import { 
  Users, 
  PlusCircle, 
  Video, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  Upload, 
  Link as LinkIcon, 
  Check, 
  Sparkles, 
  Layers
} from 'lucide-react';
import { Course, Lesson, Module, QuizQuestion } from '../types';
import { INITIAL_COHORT_DATA } from '../data/courses';

interface InstructorStudioProps {
  course: Course;
  onAddLessonToCourse: (moduleId: string, newLesson: Lesson) => void;
  onSwitchToStudentView: () => void;
}

export const InstructorStudio: React.FC<InstructorStudioProps> = ({
  course,
  onAddLessonToCourse,
  onSwitchToStudentView
}) => {
  const [activeTab, setActiveTab] = useState<'cohort' | 'add_video' | 'add_quiz'>('cohort');

  // New Video Lesson Form State
  const [targetModuleId, setTargetModuleId] = useState<string>(course.modules[0]?.id || '');
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [videoDurationMins, setVideoDurationMins] = useState<number>(10);
  const [videoUrlInput, setVideoUrlInput] = useState<string>('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);

  // New Quiz Lesson Form State
  const [quizTargetModuleId, setQuizTargetModuleId] = useState<string>(course.modules[0]?.id || '');
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [quizPassingScore, setQuizPassingScore] = useState<number>(80);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-new-1',
      question: 'What is the primary benefit of automated student progress tracking in an LMS?',
      options: [
        'It forces students to take paper exams in person',
        'It captures actual watch duration and instant quiz scoring to guarantee competency',
        'It eliminates the need for video hosting',
        'It slows down student learning intentionally'
      ],
      correctIndex: 1,
      explanation: 'Automated tracking eliminates manual paperwork and verifies real video engagement depth and comprehension instantly.'
    }
  ]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedVideoFile(file);
      setVideoTitle(prev => prev || file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  // Submit Video Lesson
  const handleCreateVideoLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      alert('Please enter a lesson title.');
      return;
    }

    let finalVideoUrl = videoUrlInput.trim();
    if (uploadedVideoFile) {
      finalVideoUrl = URL.createObjectURL(uploadedVideoFile);
    }

    const newLesson: Lesson = {
      id: 'lesson-custom-' + Date.now(),
      moduleId: targetModuleId,
      title: videoTitle.trim(),
      description: videoDescription.trim() || 'Custom instructor uploaded video lesson.',
      type: 'video',
      durationMinutes: videoDurationMins,
      durationSeconds: videoDurationMins * 60,
      videoUrl: finalVideoUrl,
      videoSources: [
        { label: uploadedVideoFile ? 'Uploaded File (Local Blob)' : 'Direct CDN Stream', url: finalVideoUrl }
      ],
      videoThumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
    };

    onAddLessonToCourse(targetModuleId, newLesson);
    alert(`Video lesson "${newLesson.title}" has been published and added to the curriculum!`);
    
    // Reset
    setVideoTitle('');
    setVideoDescription('');
    setUploadedVideoFile(null);
    setActiveTab('cohort');
  };

  // Add Question to Quiz builder
  const handleAddQuestionRow = () => {
    setQuizQuestions(prev => [
      ...prev,
      {
        id: 'q-new-' + (prev.length + 1),
        question: `Question ${prev.length + 1}: `,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: 0,
        explanation: 'Explanatory notes for why this answer is correct.'
      }
    ]);
  };

  // Submit Quiz Lesson
  const handleCreateQuizLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) {
      alert('Please enter a quiz title.');
      return;
    }

    const newQuizLesson: Lesson = {
      id: 'lesson-quiz-' + Date.now(),
      moduleId: quizTargetModuleId,
      title: quizTitle.trim(),
      description: 'Technical evaluation with automated grading and review.',
      type: 'quiz',
      durationMinutes: 15,
      quiz: {
        id: 'quiz-' + Date.now(),
        title: quizTitle.trim(),
        passingScorePercent: quizPassingScore,
        questions: quizQuestions
      }
    };

    onAddLessonToCourse(quizTargetModuleId, newQuizLesson);
    alert(`Quiz assessment "${quizTitle}" has been added to the course!`);
    setQuizTitle('');
    setActiveTab('cohort');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Studio Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instructor & Admin Management Studio</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {course.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor real-time cohort completion metrics, host new video lessons, and build interactive technical quizzes.
          </p>
        </div>

        <button
          onClick={onSwitchToStudentView}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex-shrink-0"
        >
          <Layers className="w-4 h-4" />
          <span>Switch to Student Learning View</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 sm:space-x-4">
        <button
          onClick={() => setActiveTab('cohort')}
          className={`flex items-center space-x-2 pb-3 px-1 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'cohort'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Cohort Tracking ({INITIAL_COHORT_DATA.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('add_video')}
          className={`flex items-center space-x-2 pb-3 px-1 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'add_video'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Host New Video Lesson</span>
        </button>

        <button
          onClick={() => setActiveTab('add_quiz')}
          className={`flex items-center space-x-2 pb-3 px-1 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'add_quiz'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Create Interactive Quiz</span>
        </button>
      </div>

      {/* Tab 1: Cohort Automated Progress Tracking Roster */}
      {activeTab === 'cohort' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Live Cohort Progress & Drop-off Tracker
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated telemetry tracking video watch completion (≥90%) and passing quiz scores across enrolled students.
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
              Avg Course Completion: <strong>73%</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-medium border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Automated Progress</th>
                  <th className="py-3 px-4">Lessons Done</th>
                  <th className="py-3 px-4">Time Spent</th>
                  <th className="py-3 px-4">Avg Quiz Grade</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {INITIAL_COHORT_DATA.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={student.avatar} 
                          alt={student.name} 
                          className="w-8 h-8 rounded-full object-cover" 
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                          <div className="text-[11px] text-slate-400">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          <span>{student.progressPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              student.progressPercent === 100 
                                ? 'bg-emerald-500' 
                                : student.progressPercent > 50 
                                ? 'bg-indigo-600' 
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${student.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                      {student.completedLessons} / {student.totalLessons}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {student.timeSpentHours} hrs
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {student.averageQuizScore}%
                    </td>
                    <td className="py-3.5 px-4">
                      {student.status === 'completed' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Certified
                        </span>
                      ) : student.status === 'active' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                          On Track
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Needs Support
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Host New Video Lesson */}
      {activeTab === 'add_video' && (
        <form onSubmit={handleCreateVideoLesson} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
              <Video className="w-5 h-5 mr-2 text-indigo-600" />
              Upload & Host New Video Lesson
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Host a new video lecture in your curriculum. Students' watch progress will be tracked automatically with timestamps and auto-completion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Module
              </label>
              <select
                value={targetModuleId}
                onChange={(e) => setTargetModuleId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                {course.modules.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estimated Duration (Minutes)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={videoDurationMins}
                onChange={(e) => setVideoDurationMins(parseInt(e.target.value) || 10)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Lesson Title
            </label>
            <input
              type="text"
              placeholder="e.g. Asynchronous Event Streams & Kafka Integration"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description & Learning Objectives
            </label>
            <textarea
              rows={3}
              placeholder="Explain the architectural takeaways and code examples covered in this lesson..."
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          {/* Video Hosting Input: Local Upload or Hosted Stream URL */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Video Media Source
            </h4>

            {/* Drag & Drop File */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30">
              <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {uploadedVideoFile ? `Selected: ${uploadedVideoFile.name} (${(uploadedVideoFile.size / (1024 * 1024)).toFixed(1)} MB)` : 'Upload Video File'}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Supports MP4, WebM, OGG</p>
              <label className="inline-block mt-3 px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                Browse Files
                <input 
                  type="file" 
                  accept="video/mp4,video/webm" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            </div>

            <div className="text-center text-xs text-slate-400 font-semibold">— OR USE HOSTED STREAM URL —</div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://.../video.mp4"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Video Lesson</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Interactive Quiz Builder */}
      {activeTab === 'add_quiz' && (
        <form onSubmit={handleCreateQuizLesson} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-indigo-600" />
              Interactive Quiz & Assessment Builder
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Create a multiple-choice technical exam with automatic grading, custom passing scores, and instantaneous feedback explanations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Module
              </label>
              <select
                value={quizTargetModuleId}
                onChange={(e) => setQuizTargetModuleId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                {course.modules.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                min={50}
                max={100}
                value={quizPassingScore}
                onChange={(e) => setQuizPassingScore(parseInt(e.target.value) || 80)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Quiz Title
            </label>
            <input
              type="text"
              placeholder="e.g. Distributed Consensus & High Availability Certification Exam"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              required
            />
          </div>

          {/* Question List in Builder */}
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Questions ({quizQuestions.length})
              </h4>
              <button
                type="button"
                onClick={handleAddQuestionRow}
                className="flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
                <span>Add Question</span>
              </button>
            </div>

            {quizQuestions.map((q, qIndex) => (
              <div key={q.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Question #{qIndex + 1}
                </div>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => {
                    const text = e.target.value;
                    setQuizQuestions(prev => prev.map((item, idx) => idx === qIndex ? { ...item, question: text } : item));
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  placeholder="Enter the question prompt..."
                />

                {/* Options */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-500">Options (Select radio for correct answer):</div>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctIndex === optIdx}
                        onChange={() => {
                          setQuizQuestions(prev => prev.map((item, idx) => idx === qIndex ? { ...item, correctIndex: optIdx } : item));
                        }}
                        className="accent-indigo-600"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuizQuestions(prev => prev.map((item, idx) => {
                            if (idx === qIndex) {
                              const newOpts = [...item.options];
                              newOpts[optIdx] = val;
                              return { ...item, options: newOpts };
                            }
                            return item;
                          }));
                        }}
                        className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                      />
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Correct Answer Explanation (displayed to students upon review):
                  </label>
                  <input
                    type="text"
                    value={q.explanation}
                    onChange={(e) => {
                      const text = e.target.value;
                      setQuizQuestions(prev => prev.map((item, idx) => idx === qIndex ? { ...item, explanation: text } : item));
                    }}
                    className="w-full px-3 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    placeholder="Provide the technical justification..."
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
            >
              <Check className="w-4 h-4" />
              <span>Save & Publish Quiz</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
