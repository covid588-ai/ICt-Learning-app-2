// Chapter Detail Client Component - Topics List
'use client';

import Link from 'next/link';
import { Topic } from '@/types';
import { cn, formatDuration, formatRelativeTime } from '@/lib/utils';

interface ChapterDetailClientProps {
  chapter: any;
  topics: (Topic & { totalMaterials: number; completedMaterials: number; progressPercentage: number; totalDuration: number; watchedDuration: number })[];
  chapterProgress: number;
  totalMaterials: number;
  completedMaterials: number;
}

export default function ChapterDetailClient({
  chapter,
  topics,
  chapterProgress,
  totalMaterials,
  completedMaterials,
}: ChapterDetailClientProps) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-16 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container-main px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href={`/student/subjects/${chapter.subjectId}`}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <Link
                  href={`/student/subjects/${chapter.subjectId}`}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline mb-1 block"
                >
                  {chapter.subject?.title}
                </Link>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{chapter.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{topics.length} topics</span>
                <span>•</span>
                <span>{totalMaterials} materials</span>
              </span>
              <div className="w-32 sm:w-48">
                <div className="progress-bar h-2">
                  <div className="progress-fill" style={{ width: `${chapterProgress}%` }} />
                </div>
              </div>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400 w-12 text-right">
                {chapterProgress}%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Topics */}
      <main className="container-main px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {topics.length === 0 ? (
            <div className="card p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No topics yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Content will be added soon</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topics.map((topic, index) => (
                <TopicCard key={topic.id} topic={topic} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TopicCard({
  topic,
  index,
}: {
  topic: Topic & {
    totalMaterials: number;
    completedMaterials: number;
    progressPercentage: number;
    totalDuration: number;
    watchedDuration: number;
    materials: any[];
  };
  index: number;
}) {
  const hasProgress = topic.progressPercentage > 0;
  const firstMaterial = topic.materials[0];
  const hasVideo = topic.materials.some(m => m.type === 'VIDEO');
  const hasPdf = topic.materials.some(m => m.type === 'PDF');

  return (
    <Link
      href={`/student/subjects/${topic.chapter?.subjectId}/chapters/${topic.chapterId}/topics/${topic.id}`}
      className={cn(
        'card-hover p-4 group animate-in',
        'style',
        { animationDelay: `${index * 50}ms` }
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-4">{topic.title}</h3>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {hasVideo && <span className="badge-primary">🎬 Video</span>}
              {hasPdf && <span className="badge-secondary">📕 PDF</span>}
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{topic.description || 'No description'}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{topic.totalMaterials} materials</span>
            {topic.totalDuration > 0 && (
              <span>• {formatDuration(topic.totalDuration)}</span>
            )}
          </div>
          {hasProgress && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 progress-bar h-1.5">
                <div className="progress-fill" style={{ width: `${topic.progressPercentage}%` }} />
              </div>
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400 w-12 text-right">
                {topic.progressPercentage}%
              </span>
            </div>
          )}
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}