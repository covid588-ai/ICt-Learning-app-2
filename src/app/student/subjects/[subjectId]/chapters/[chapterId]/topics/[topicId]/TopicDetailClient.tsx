// Topic Detail Client Component - Materials List
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn, formatDuration, formatRelativeTime } from '@/lib/utils';

interface TopicDetailClientProps {
  topic: any;
  materials: any[];
  prevMaterial: { id: string; title: string; topicId: string; type: string } | null;
  nextMaterial: { id: string; title: string; topicId: string; type: string } | null;
  chapter: any;
}

export default function TopicDetailClient({
  topic,
  materials,
  prevMaterial,
  nextMaterial,
  chapter,
}: TopicDetailClientProps) {
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null);

  const videos = materials.filter(m => m.type === 'VIDEO');
  const pdfs = materials.filter(m => m.type === 'PDF');

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-16 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container-main px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href={`/student/subjects/${chapter.subjectId}/chapters/${chapter.id}`}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <Link
                  href={`/student/subjects/${chapter.subjectId}/chapters/${chapter.id}`}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline mb-1 block"
                >
                  {chapter.title}
                </Link>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{topic.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {materials.length} material{materials.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Topic Description */}
      {topic.description && (
        <div className="container-main px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">{topic.description}</p>
        </div>
      )}

      {/* Materials */}
      <main className="container-main px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Videos Section */}
          {videos.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Video Lectures
              </h2>
              <div className="space-y-3">
                {videos.map((material, index) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    index={index}
                    expanded={expandedMaterial === material.id}
                    onToggle={() => setExpandedMaterial(expandedMaterial === material.id ? null : material.id)}
                    prevMaterial={prevMaterial}
                    nextMaterial={nextMaterial}
                  />
                ))}
              </div>
            </section>
          )}

          {/* PDFs Section */}
          {pdfs.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF Notes
              </h2>
              <div className="space-y-3">
                {pdfs.map((material, index) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    index={index}
                    expanded={expandedMaterial === material.id}
                    onToggle={() => setExpandedMaterial(expandedMaterial === material.id ? null : material.id)}
                    prevMaterial={prevMaterial}
                    nextMaterial={nextMaterial}
                  />
                ))}
              </div>
            </section>
          )}

          {materials.length === 0 && (
            <div className="card p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No materials yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Content will be added soon</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function MaterialCard({
  material,
  index,
  expanded,
  onToggle,
  prevMaterial,
  nextMaterial,
}: {
  material: any;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  prevMaterial: any;
  nextMaterial: any;
}) {
  const isVideo = material.type === 'VIDEO';
  const progress = material.progress;
  const progressPercent = progress && material.duration
    ? Math.round((progress.playbackPosition / material.duration) * 100)
    : progress?.completed ? 100 : 0;

  return (
    <div className={cn('card overflow-hidden animate-in', 'style', { animationDelay: `${index * 50}ms` })}>
      {/* Main Card */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-4 text-left"
        aria-expanded={expanded}
      >
        <div className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
          isVideo ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-secondary-100 dark:bg-secondary-900/30'
        )}>
          {isVideo ? (
            <svg className="w-7 h-7 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-4">{material.title}</h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {progress?.completed && (
                <span className="badge-success">Completed</span>
              )}
              {progress && !progress.completed && progressPercent > 0 && (
                <span className="badge-primary">{progressPercent}%</span>
              )}
              {material.isBookmarked && (
                <span className="badge-accent">🔖 Bookmarked</span>
              )}
            </div>
          </div>

          {material.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{material.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {material.duration && <span>{formatDuration(material.duration)}</span>}
            {progress?.lastWatched && !progress.completed && (
              <span>Last: {formatRelativeTime(progress.lastWatched)}</span>
            )}
            {progress?.completed && progress?.completedAt && (
              <span className="text-green-600 dark:text-green-400">Completed {formatRelativeTime(progress.completedAt)}</span>
            )}
          </div>

          {(progressPercent > 0 || progress?.completed) && (
            <div className="mt-2 progress-bar h-1.5">
              <div className={cn('progress-fill rounded-full', progress?.completed && 'bg-green-500')} style={{ width: `${progressPercent}%` }} />
            </div>
          )}
        </div>

        <svg
          className={cn('w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200', expanded && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50 animate-in">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/student/play/${material.id}`}
              className="btn-primary flex-1 sm:flex-none justify-center"
            >
              {isVideo ? '▶ Watch Video' : '📖 Open PDF'}
            </Link>

            <button
              className="btn-outline flex-1 sm:flex-none justify-center"
              onClick={(e) => { e.stopPropagation(); toggleBookmark(material.id); }}
            >
              {material.isBookmarked ? '🔖 Remove Bookmark' : '🔖 Bookmark'}
            </button>

            {progress && !progress.completed && (
              <button
                className="btn-accent flex-1 sm:flex-none justify-center"
                onClick={(e) => { e.stopPropagation(); markComplete(material.id); }}
              >
                ✓ Mark Complete
              </button>
            )}

            {/* Navigation */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {prevMaterial && (
                <Link
                  href={`/student/play/${prevMaterial.id}`}
                  className="btn-ghost text-sm flex-1 sm:flex-none justify-center"
                >
                  ← Previous
                </Link>
              )}
              {nextMaterial && (
                <Link
                  href={`/student/play/${nextMaterial.id}`}
                  className="btn-primary text-sm flex-1 sm:flex-none justify-center"
                >
                  Next →
                </Link>
              )}
            </div>
          </div>

          {material.description && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{material.description}</p>
          )}
        </div>
      )}
    </div>
  );
}

function toggleBookmark(materialId: string) {
  // TODO: Implement bookmark toggle via API
  console.log('Toggle bookmark:', materialId);
}

function markComplete(materialId: string) {
  // TODO: Implement mark complete via API
  console.log('Mark complete:', materialId);
}