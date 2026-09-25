import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  RotateCw, 
  Maximize, 
  Minimize, 
  CheckCircle, 
  Upload, 
  Link as LinkIcon, 
  Bookmark, 
  Trash2, 
  Clock, 
  Sliders, 
  Check, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Lesson, LessonProgress, VideoBookmarkNote } from '../types';
import { formatTimeSeconds } from '../utils/formatters';
import { getLessonNotes, addLessonNote, deleteLessonNote } from '../utils/progressStorage';

interface VideoPlayerProps {
  lesson: Lesson;
  moduleId: string;
  courseId: string;
  progress?: LessonProgress;
  onUpdateProgress: (currentTime: number, duration: number) => void;
  onAutoCompleted: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  lesson,
  progress,
  onUpdateProgress,
  onAutoCompleted
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active video source state (supports custom uploaded or custom URL)
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(lesson.videoUrl || '');
  const [activeSourceLabel, setActiveSourceLabel] = useState<string>('Primary CDN');

  // Playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(progress?.lastPlaybackPositionSeconds || 0);
  const [duration, setDuration] = useState<number>(lesson.durationSeconds || 0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [showSourceModal, setShowSourceModal] = useState<boolean>(false);

  // Custom Video Hosting Input States
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Notes state
  const [notes, setNotes] = useState<VideoBookmarkNote[]>([]);
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);

  // Auto-completion notification banner
  const [showCompletedBanner, setShowCompletedBanner] = useState<boolean>(false);

  // Progress threshold (90% required to auto-complete)
  const COMPLETION_THRESHOLD = 90;
  const currentPercentage = duration > 0 ? Math.min(100, Math.round((currentTime / duration) * 100)) : 0;
  const maxWatchedPercent = progress?.maxPercentageWatched || currentPercentage;
  const isCompleted = progress?.status === 'completed' || maxWatchedPercent >= COMPLETION_THRESHOLD;

  // Initialize and load notes
  useEffect(() => {
    setCurrentVideoUrl(lesson.videoUrl || '');
    setUploadedFileName(null);
    setNotes(getLessonNotes(lesson.id));
    setShowCompletedBanner(false);
    
    // Set initial position if returning
    if (progress?.lastPlaybackPositionSeconds && progress.lastPlaybackPositionSeconds > 5 && progress.status !== 'completed') {
      setCurrentTime(progress.lastPlaybackPositionSeconds);
    } else {
      setCurrentTime(0);
    }
  }, [lesson.id]);

  // Sync video time to saved playback position on mount
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      if (progress?.lastPlaybackPositionSeconds && progress.lastPlaybackPositionSeconds > 0) {
        videoRef.current.currentTime = progress.lastPlaybackPositionSeconds;
      }
    }
  };

  // Video time update - Automated Progress Tracking Engine
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || duration;
    setCurrentTime(curr);

    // Call automated progress tracking updates
    onUpdateProgress(curr, dur);

    // Trigger auto-complete banner if crossing 90% for the first time
    const pct = dur > 0 ? (curr / dur) * 100 : 0;
    if (pct >= COMPLETION_THRESHOLD && progress?.status !== 'completed' && !showCompletedBanner) {
      setShowCompletedBanner(true);
      onAutoCompleted();
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log('Autoplay prevented or error:', err));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  const skipSeconds = (seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  // Handle local video file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setCurrentVideoUrl(blobUrl);
      setUploadedFileName(file.name);
      setActiveSourceLabel(`Uploaded: ${file.name}`);
      setShowSourceModal(false);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  // Handle custom hosted video URL
  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInputUrl.trim()) {
      setCurrentVideoUrl(customInputUrl.trim());
      setActiveSourceLabel('Custom Stream URL');
      setUploadedFileName(null);
      setShowSourceModal(false);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  // Handle adding notes at current timestamp
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const note = addLessonNote(lesson.id, currentTime, newNoteText);
    setNotes(prev => [...prev, note].sort((a, b) => a.timestampSeconds - b.timestampSeconds));
    setNewNoteText('');
    setShowNoteInput(false);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteLessonNote(lesson.id, noteId);
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const jumpToTimestamp = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div 
        ref={containerRef}
        className="relative bg-black rounded-2xl overflow-hidden shadow-xl group border border-slate-800"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Actual Video Tag */}
        <video
          ref={videoRef}
          src={currentVideoUrl}
          className="w-full aspect-video object-contain cursor-pointer"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            if (!isCompleted) {
              onAutoCompleted();
            }
          }}
          poster={lesson.videoThumbnail}
          playsInline
        />

        {/* Big Center Play Button overlay when paused */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer transition-opacity"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-600/90 text-white flex items-center justify-center pl-1 shadow-2xl hover:scale-105 transition-transform hover:bg-indigo-500">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
            </div>
          </div>
        )}

        {/* Automated Tracking Status Overlay Badge (Top Right) */}
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
          {isCompleted ? (
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/90 text-white rounded-full text-xs font-semibold backdrop-blur-md shadow-lg">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Auto-Completed ({maxWatchedPercent}%)</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-slate-900/80 text-amber-300 rounded-full text-xs font-medium backdrop-blur-md border border-amber-500/30">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Tracking: {maxWatchedPercent}% / 90%</span>
            </div>
          )}

          {/* Host / Source Switcher Button */}
          <button
            id="btn-video-source-modal"
            onClick={() => setShowSourceModal(true)}
            title="Switch CDN resolution or upload custom video file"
            className="flex items-center space-x-1 px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-full text-xs font-medium backdrop-blur-md border border-slate-700 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Hosting Options</span>
          </button>
        </div>

        {/* Completion Toast Banner */}
        {showCompletedBanner && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl shadow-2xl animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold">Requirement met! Lesson marked completed automatically.</span>
            <button 
              onClick={() => setShowCompletedBanner(false)}
              className="ml-2 text-white/80 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Custom Video Control Bar */}
        <div 
          className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-200 z-20 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Timeline Scrubber */}
          <div className="relative mb-3 group/scrubber">
            {/* Background track */}
            <input
              id="video-timeline-scrubber"
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-700/80 hover:h-2.5 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all"
            />
            {/* Watched progress highlight indicator */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-indigo-500 rounded-l pointer-events-none transition-all"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between text-white text-xs sm:text-sm">
            {/* Left controls: Play, skip, volume, time */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                id="btn-play-pause"
                onClick={togglePlay}
                className="p-1.5 hover:text-indigo-400 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                id="btn-skip-back-10"
                onClick={() => skipSeconds(-10)}
                className="p-1 hover:text-indigo-400 transition-colors hidden sm:block"
                title="Rewind 10s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                id="btn-skip-forward-10"
                onClick={() => skipSeconds(10)}
                className="p-1 hover:text-indigo-400 transition-colors hidden sm:block"
                title="Forward 10s"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center space-x-1.5">
                <button 
                  id="btn-mute-toggle"
                  onClick={toggleMute} 
                  className="p-1 hover:text-indigo-400"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  id="input-volume-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-14 sm:w-20 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Timestamp Display */}
              <div className="text-slate-300 font-mono text-[11px] sm:text-xs">
                {formatTimeSeconds(currentTime)} / {formatTimeSeconds(duration)}
              </div>
            </div>

            {/* Right controls: Speed, Note bookmark, Fullscreen */}
            <div className="flex items-center space-x-2 sm:space-x-3 relative">
              {/* Add Note Bookmark Button */}
              <button
                id="btn-open-add-note"
                onClick={() => setShowNoteInput(!showNoteInput)}
                title="Add a timestamped note at current time"
                className="flex items-center space-x-1 px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline text-[11px]">Bookmark</span>
              </button>

              {/* Speed Menu */}
              <div className="relative">
                <button
                  id="btn-speed-selector"
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 rounded text-[11px] font-mono transition-colors"
                >
                  {playbackRate}x
                </button>

                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-28 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-1 z-30">
                    {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                          playbackRate === rate ? 'bg-indigo-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{rate}x</span>
                        {playbackRate === rate && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen Button */}
              <button
                id="btn-fullscreen-toggle"
                onClick={toggleFullscreen}
                className="p-1 hover:text-indigo-400 transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Automated Progress Tracker Status Banner */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`} />
            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              Automated Video Completion Tracker
            </h4>
            {isCompleted ? (
              <span className="text-[11px] px-2 py-0.5 font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Verified Complete
              </span>
            ) : (
              <span className="text-[11px] px-2 py-0.5 font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                In Progress ({maxWatchedPercent}%)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            System automatically tracks your video watch depth. Requires reaching <strong className="text-slate-700 dark:text-slate-200">90% watch time</strong> to trigger automated course completion.
          </p>
        </div>

        {/* Progress Bar Gauge */}
        <div className="w-full sm:w-56 space-y-1">
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>Progress: {maxWatchedPercent}%</span>
            <span>Target: 90%</span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`}
              style={{ width: `${Math.min(100, maxWatchedPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Note Input Box (when opened) */}
      {showNoteInput && (
        <form onSubmit={handleAddNote} className="bg-indigo-50/70 dark:bg-indigo-950/30 p-3 rounded-xl border border-indigo-200 dark:border-indigo-900/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-950 dark:text-indigo-200">
            <span className="flex items-center">
              <Bookmark className="w-3.5 h-3.5 mr-1 text-indigo-600" />
              Add Timestamped Note at {formatTimeSeconds(currentTime)}
            </span>
            <button 
              type="button" 
              onClick={() => setShowNoteInput(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Cancel
            </button>
          </div>
          <div className="flex gap-2">
            <input
              id="input-note-text"
              type="text"
              placeholder="e.g., Critical point on Raft term consistency..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <button
              id="btn-save-note"
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      {/* Saved Notes and Bookmarks List */}
      {notes.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 space-y-2">
          <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
            <Bookmark className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
            Your Video Bookmarks & Notes ({notes.length})
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {notes.map((note) => (
              <div 
                key={note.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-xs group"
              >
                <div 
                  onClick={() => jumpToTimestamp(note.timestampSeconds)}
                  className="flex-1 cursor-pointer flex items-center space-x-2 truncate"
                  title="Click to jump video to this point"
                >
                  <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 rounded font-mono text-[10px] font-medium flex-shrink-0">
                    {formatTimeSeconds(note.timestampSeconds)}
                  </span>
                  <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{note.text}</span>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-slate-400 hover:text-red-500 p-1 transition-colors opacity-60 group-hover:opacity-100"
                  title="Delete bookmark"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Hosting & Source Modal */}
      {showSourceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Video Hosting & Streams
                </h3>
              </div>
              <button 
                onClick={() => setShowSourceModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an alternate CDN resolution, provide any hosted video URL, or upload a local video file (MP4/WebM) to test video hosting capabilities.
            </p>

            {/* Current Active Source */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
              <div className="text-slate-400">Active Source:</div>
              <div className="font-semibold text-slate-900 dark:text-white break-all">
                {activeSourceLabel}
              </div>
            </div>

            {/* Pre-configured CDN Sources for this lesson */}
            {lesson.videoSources && lesson.videoSources.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  CDN Presets:
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {lesson.videoSources.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentVideoUrl(src.url);
                        setActiveSourceLabel(src.label);
                        setShowSourceModal(false);
                        setCurrentTime(0);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 transition-colors flex items-center justify-between"
                    >
                      <span>{src.label}</span>
                      <span className="text-[10px] text-slate-400">{src.resolution || 'MP4'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Local Video File */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                <Upload className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                Upload Local Video File (MP4, WebM)
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-xl p-3 cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 transition-colors">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {uploadedFileName ? uploadedFileName : 'Choose file or drag & drop'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">MP4, WebM, QuickTime (HTML5 compatible)</span>
                <input 
                  type="file" 
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            {/* Custom URL Input */}
            <form onSubmit={handleApplyCustomUrl} className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                <LinkIcon className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                Or Link Custom Hosted Video URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://.../video.mp4"
                  value={customInputUrl}
                  onChange={(e) => setCustomInputUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Load
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
