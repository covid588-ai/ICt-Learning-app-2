// Subject Detail Client Component
'use client';

import Link from 'next/link';
import { Chapter } from '@/types';
import { cn, formatRelativeTime } from '@/lib/utils';

interface SubjectDetailClientProps {
  subject: any;
  chapters: (Chapter & { totalMaterials: number; completedMaterials: number; progressPercentage: number })[];
  subjectProgress: number;
  totalMaterials: number;
  completedMaterials: number;
}

export default function SubjectDetailClient({
  subject,
  chapters,
  subjectProgress,
  totalMaterials,
  completedMaterials,
}: SubjectDetailClientProps) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header with Cover */}
      <header className="relative">
        {subject.coverImage && (
          <div className="absolute inset-0 h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: `url(${subject.coverImage})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
          </div>
        )}
        <div className="relative container-main px-4 pt-24 pb-6 md:pt-32 md:pb-8">
          <div className="max-w-4xl">
            <Link
              href="/student/subjects"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Subjects
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-4xl">
                {subject.icon || '📚'}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{subject.title}</h1>
                <p className="text-white/80 mt-1">{subject.description || 'No description'}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                {chapters.length} chapters
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                {totalMaterials} materials
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                {subjectProgress}% complete
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container-main px-4 -mt-4 md:-mt-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Progress</span>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{subjectProgress}%</span>
          </div>
          <div className="progress-bar h-3 rounded-full">
            <div className="progress-fill rounded-full" style={{ width: `${subjectProgress}%` }} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
            {completedMaterials} of {totalMaterials} completed
          </p>
        </div>
      </div>

      {/* Chapters */}
      <main className="container-main px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Course Content</h2>

          {chapters.length === 0 ? (
            <div className="card p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No chapters yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Content will be added soon</p>
            </div>
          ) : (
            <div className="space-y-3">
              {chapters.map((chapter, index) => (
                <ChapterCard key={chapter.id} chapter={chapter} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ChapterCard({ chapter, index }: { chapter: Chapter & { totalMaterials: number; completedMaterials: number; progressPercentage: number }; index: number }) {
  const hasProgress = chapter.progressPercentage > 0;

  return (
    <Link
      href={`/student/subjects/${chapter.subjectId}/chapters/${chapter.id}`}
      className={cn(
        'card-hover p-4 group animate-in',
        'style',
        { animationDelay: `${index * 50}ms` }
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <svg className="w-6 h-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">{chapter.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">{chapter.description || 'No description'}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{chapter.topics?.length || 0} topics</span>
            <span>•</span>
            <span>{chapter.totalMaterials} materials</span>
          </div>
          {hasProgress && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 progress-bar h-1.5">
                <div className="progress-fill" style={{ width: `${chapter.progressPercentage}%` }} />
              </div>
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400 w-12 text-right">
                {chapter.progressPercentage}%
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