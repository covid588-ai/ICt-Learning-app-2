// Video Player / PDF Viewer Client Component
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn, formatDuration, formatRelativeTime } from '@/lib/utils';
import { ContentType } from '@prisma/client';

interface PlayerPageClientProps {
  material: any;
  progress: {
    id: string;
    playbackPosition: number;
    completed: boolean;
    completedAt: Date | null;
    lastWatched: Date;
    watchCount: number;
  } | null;
  isBookmarked: boolean;
  prevMaterial: { id: string; title: string; topicId: string; type: string } | null;
  nextMaterial: { id: string; title: string; topicId: string; type: string } | null;
  userDriveToken: string | undefined;
  userRefreshToken: string | undefined;
  userTokenExpiry: number | undefined;
}

export default function PlayerPageClient({
  material,
  progress,
  isBookmarked: initialBookmarked,
  prevMaterial,
  nextMaterial,
  userDriveToken,
  userRefreshToken,
  userTokenExpiry,
}: PlayerPageClientProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [completed, setCompleted] = useState(progress?.completed || false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Video player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(progress?.playbackPosition || 0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [buffered, setBuffered] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // PDF viewer state
  const [pdfCurrentPage, setPdfCurrentPage] = useState(1);
  const [pdfTotalPages, setPdfTotalPages] = useState(0);
  const [pdfScale, setPdfScale] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(false);

  const isVideo = material.type === ContentType.VIDEO;
  const isPdf = material.type === ContentType.PDF;

  // Fetch stream URL on mount
  useEffect(() => {
    if (isVideo) {
      fetchVideoStream();
    } else if (isPdf) {
      fetchPdfUrl();
    }
  }, []);

  const fetchVideoStream = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/videos/${material.id}/stream`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${userDriveToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You do not have permission to watch this video. Please contact the administrator.');
        }
        if (response.status === 401) {
          throw new Error('Authentication expired. Please sign in again.');
        }
        throw new Error('Failed to load video');
      }

      // Get blob URL for video
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setStreamUrl(url);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPdfUrl = async () => {
    try {
      setLoading(true);
      setPdfLoading(true);
      const response = await fetch(`/api/pdfs/${material.id}/stream`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${userDriveToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You do not have permission to view this PDF. Please contact the administrator.');
        }
        if (response.status === 401) {
          throw new Error('Authentication expired. Please sign in again.');
        }
        throw new Error('Failed to load PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setPdfLoading(false);
    }
  };

  // Video event handlers
  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      // Resume from saved position
      if (progress?.playbackPosition && progress.playbackPosition < videoRef.current.duration) {
        videoRef.current.currentTime = progress.playbackPosition;
      }
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);

      // Save progress every 5 seconds
      if (Math.floor(time) % 5 === 0) {
        saveProgress(time);
      }
    }
  };

  const handleVideoProgress = () => {
    if (videoRef.current) {
      const bufferedEnd = videoRef.current.buffered.length
        ? videoRef.current.buffered.end(videoRef.current.buffered.length - 1)
        : 0;
      setBuffered(bufferedEnd);
    }
  };

  const handleVideoEnded = () => {
    setPlaying(false);
    if (!completed) {
      markComplete();
    }
    // Auto-play next if available
    if (nextMaterial) {
      setTimeout(() => {
        router.push(`/student/play/${nextMaterial.id}`);
      }, 3000);
    }
  };

  const handleVideoError = () => {
    setError('Video playback failed. The file format may not be supported.');
  };

  // Progress saving
  const saveProgress = useCallback(async (position: number) => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId: material.id,
          playbackPosition: Math.floor(position),
        }),
        credentials: 'include',
      });
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  }, [material.id]);

  const markComplete = async () => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId: material.id,
          completed: true,
        }),
        credentials: 'include',
      });
      setCompleted(true);
    } catch (err) {
      console.error('Failed to mark complete:', err);
    }
  };

  // Toggle bookmark
  const toggleBookmark = async () => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: bookmarked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId: material.id }),
        credentials: 'include',
      });

      if (response.ok) {
        setBookmarked(!bookmarked);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (vol: number) => {
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const toggleFullscreenVideo = () => {
    if (videoRef.current) {
      if (!fullscreen) {
        videoRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setFullscreen(!fullscreen);
    }
  };

  const handleRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSeek(Math.max(0, currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSeek(Math.min(duration, currentTime + 10));
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreenVideo();
          break;
        case '>':
        case '.':
          handleRateChange(Math.min(2, playbackRate + 0.25));
          break;
        case '<':
        case ',':
          handleRateChange(Math.max(0.25, playbackRate - 0.25));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, duration, volume, muted, fullscreen, playbackRate]);

  // Auto-hide controls
  useEffect(() => {
    if (playing && !fullscreen) {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [playing, fullscreen]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (streamUrl) URL.revokeObjectURL(streamUrl);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [streamUrl, pdfUrl]);

  // Render
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container-main px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href={`/student/subjects/${material.topic.chapter.subject.id}/chapters/${material.topic.chapter.id}/topics/${material.topic.id}`}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 truncate">
                  {material.topic.chapter.subject.title} › {material.topic.chapter.title}
                </p>
                <h1 className="font-semibold truncate">{material.topic.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleBookmark}
                className={cn(
                  'p-2 rounded-xl transition-colors',
                  bookmarked
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                )}
                aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <svg className={cn('w-5 h-5', bookmarked && 'fill-current')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              {completed && (
                <span className="badge-success text-xs">Completed</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Player Area */}
      <main className="pt-16 pb-20">
        <div className="container-main px-4">
          <div className="max-w-5xl mx-auto">
            {/* Video Player */}
            {isVideo && (
              <div className="video-container relative" onMouseEnter={() => setShowControls(true)} onMouseLeave={() => playing && !fullscreen && setShowControls(false)}>
                {error ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                    <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-xl font-semibold mb-2">Unable to Play Video</h2>
                    <p className="text-gray-400 mb-6 max-w-md">{error}</p>
                    <div className="flex gap-3">
                      <Link href={`/student/subjects/${material.topic.chapter.subject.id}/chapters/${material.topic.chapter.id}/topics/${material.topic.id}`} className="btn-outline">
                        Back to Topic
                      </Link>
                      {nextMaterial && (
                        <Link href={`/student/play/${nextMaterial.id}`} className="btn-primary">
                          Next Lecture →
                        </Link>
                      )}
                    </div>
                  </div>
                ) : loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="video-player"
                      src={streamUrl}
                      onLoadedMetadata={handleVideoLoadedMetadata}
                      onTimeUpdate={handleVideoTimeUpdate}
                      onProgress={handleVideoProgress}
                      onEnded={handleVideoEnded}
                      onError={handleVideoError}
                      onClick={togglePlay}
                      onDoubleClick={toggleFullscreenVideo}
                      playsInline
                      controls={false}
                    />

                    {/* Loading Overlay */}
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
                      </div>
                    )}

                    {/* Custom Controls */}
                    <div
                      className={cn(
                        'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300',
                        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      )}
                    >
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div
                          className="relative h-2 bg-gray-700 rounded-full cursor-pointer"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const percent = (e.clientX - rect.left) / rect.width;
                            handleSeek(percent * duration);
                          }}
                          onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const percent = (e.clientX - rect.left) / rect.width;
                            // Could show preview tooltip here
                          }}
                        >
                          {/* Buffered */}
                          {buffered > 0 && duration > 0 && (
                            <div
                              className="absolute top-0 left-0 h-full bg-gray-500 rounded-full"
                              style={{ width: `${(buffered / duration) * 100}%` }}
                            />
                          )}
                          {/* Played */}
                          {duration > 0 && (
                            <div
                              className="absolute top-0 left-0 h-full bg-primary-500 rounded-full"
                              style={{ width: `${(currentTime / duration) * 100}%` }}
                            />
                          )}
                          {/* Thumb */}
                          {duration > 0 && (
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transform"
                              style={{ left: `${(currentTime / duration) * 100}%` }}
                            />
                          )}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>{formatDuration(currentTime)}</span>
                          <span>{formatDuration(duration)}</span>
                        </div>
                      </div>

                      {/* Controls Row */}
                      <div className="flex items-center justify-between gap-4">
                        {/* Left Controls */}
                        <div className="flex items-center gap-2">
                          <button onClick={togglePlay} className="p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label={playing ? 'Pause' : 'Play'}>
                            {playing ? (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                            ) : (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            )}
                          </button>
                          <button onClick={() => handleSeek(Math.max(0, currentTime - 10))} className="p-2 rounded-full hover:bg-gray-800" aria-label="Rewind 10s">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                          </button>
                          <button onClick={() => handleSeek(Math.min(duration, currentTime + 10))} className="p-2 rounded-full hover:bg-gray-800" aria-label="Forward 10s">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                          </button>
                        </div>

                        {/* Center - Time */}
                        <div className="flex items-center gap-3 text-sm font-mono text-gray-300">
                          <span className="w-12 text-right">{formatDuration(currentTime)}</span>
                          <span className="text-gray-500">/</span>
                          <span className="w-12">{formatDuration(duration)}</span>
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-2 ml-auto">
                          {/* Volume */}
                          <div className="relative">
                            <button onClick={toggleMute} className="p-2 rounded-full hover:bg-gray-800" aria-label={muted ? 'Unmute' : 'Mute'}>
                              {muted || volume === 0 ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3z" /></svg>
                              ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                              )}
                            </button>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={volume}
                              onChange={(e) => handleVolumeChange(Number(e.target.value))}
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-24 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer opacity-0 pointer-events-none transition-opacity group-hover:opacity-100"
                              style={{ background: `linear-gradient(to right, #3b82f6 ${volume * 100}%, #374151 ${volume * 100}%)` }}
                            />
                          </div>

                          {/* Playback Rate */}
                          <select
                            value={playbackRate}
                            onChange={(e) => handleRateChange(Number(e.target.value))}
                            className="bg-gray-800 text-white text-xs px-2 py-1 rounded border border-gray-700"
                            aria-label="Playback speed"
                          >
                            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(r => (
                              <option key={r} value={r}>{r}x</option>
                            ))}
                          </select>

                          {/* Fullscreen */}
                          <button onClick={toggleFullscreenVideo} className="p-2 rounded-full hover:bg-gray-800" aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                            {fullscreen ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16l16-8z" /></svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Navigation Buttons (Mobile) */}
                <div className="flex items-center justify-between gap-3 mt-4 sm:hidden">
                  {prevMaterial && (
                    <Link href={`/student/play/${prevMaterial.id}`} className="btn-outline flex-1 justify-center text-sm">
                      ← Previous
                    </Link>
                  )}
                  {nextMaterial && (
                    <Link href={`/student/play/${nextMaterial.id}`} className="btn-primary flex-1 justify-center text-sm">
                      Next →
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* PDF Viewer */}
            {isPdf && (
              <div className="pdf-container relative">
                {error ? (
                  <div className="w-full h-[600px] flex flex-col items-center justify-center p-8 text-center">
                    <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-xl font-semibold mb-2">Unable to Load PDF</h2>
                    <p className="text-gray-400 mb-6 max-w-md">{error}</p>
                    <Link href={`/student/subjects/${material.topic.chapter.subject.id}/chapters/${material.topic.chapter.id}/topics/${material.topic.id}`} className="btn-outline">
                      Back to Topic
                    </Link>
                  </div>
                ) : pdfLoading ? (
                  <div className="w-full h-[600px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
                  </div>
                ) : pdfUrl ? (
                  <div className="w-full h-[600px] sm:h-[700px]">
                    <iframe
                      src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                      className="w-full h-full border-0"
                      title={material.title}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="w-full h-[600px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
                  </div>
                )}

                {/* PDF Controls Overlay */}
                {pdfUrl && !pdfLoading && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                    <button onClick={() => setPdfCurrentPage(p => Math.max(1, p - 1))} className="p-2 rounded-lg hover:bg-gray-700" aria-label="Previous page">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span className="text-sm font-mono px-2">
                      {pdfCurrentPage} / {pdfTotalPages || '—'}
                    </span>
                    <button onClick={() => setPdfCurrentPage(p => Math.min(pdfTotalPages || 999, p + 1))} className="p-2 rounded-lg hover:bg-gray-700" aria-label="Next page">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <div className="w-px h-6 bg-gray-600 mx-2" />
                    <button onClick={() => setPdfScale(s => Math.max(0.5, s - 0.25))} className="p-2 rounded-lg hover:bg-gray-700 text-xs" aria-label="Zoom out">−</button>
                    <span className="text-sm font-mono px-2 w-16 text-center">{Math.round(pdfScale * 100)}%</span>
                    <button onClick={() => setPdfScale(s => Math.min(3, s + 0.25))} className="p-2 rounded-lg hover:bg-gray-700 text-xs" aria-label="Zoom in">+</button>
                    <button onClick={() => setPdfScale(1)} className="p-2 rounded-lg hover:bg-gray-700 text-xs" aria-label="Reset zoom">Reset</button>
                    <div className="w-px h-6 bg-gray-600 mx-2" />
                    <button className="p-2 rounded-lg hover:bg-gray-700" aria-label="Rotate">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <button onClick={() => window.open(pdfUrl!, '_blank')} className="p-2 rounded-lg hover:bg-gray-700" aria-label="Open in new tab">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Material Info */}
            <div className="mt-6 card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{material.title}</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {material.topic.chapter.subject.title} › {material.topic.chapter.title} › {material.topic.title}
                    {material.order && <span className="mx-2">•</span> Lecture {material.order}}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {prevMaterial && (
                    <Link href={`/student/play/${prevMaterial.id}`} className="btn-outline">
                      ← Previous
                    </Link>
                  )}
                  {!completed && !loading && !error && (
                    <button onClick={markComplete} className="btn-accent">
                      ✓ Mark Complete
                    </button>
                  )}
                  {completed && (
                    <span className="badge-success">Completed</span>
                  )}
                  {nextMaterial && (
                    <Link href={`/student/play/${nextMaterial.id}`} className="btn-primary">
                      Next →
                    </Link>
                  )}
                </div>
              </div>

              {material.description && (
                <p className="text-gray-300 mt-4">{material.description}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}