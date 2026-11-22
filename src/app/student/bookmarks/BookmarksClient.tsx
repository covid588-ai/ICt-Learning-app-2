// Bookmarks Client Component
'use client';

import Link from 'next/link';
import { cn, formatDuration, formatRelativeTime } from '@/lib/utils';

interface BookmarksClientProps {
  bookmarks: any[];
}

export default function BookmarksClient({ bookmarks }: BookmarksClientProps) {
  const videos = bookmarks.filter(b => b.material.type === 'VIDEO');
  const pdfs = bookmarks.filter(b => b.material.type === 'PDF');

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-16 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container-main px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookmarks</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {bookmarks.length} saved item{bookmarks.length !== 1 ? 's' : ''}
              </p>
            </div>

            {bookmarks.length > 0 && (
              <div className="flex gap-2">
                <button className="btn-ghost text-sm">Clear All</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-main px-4 py-6">
        {bookmarks.length === 0 ? (
          <div className="card p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No bookmarks yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Save lectures and notes for quick access</p>
            <Link href="/student/subjects" className="btn-primary">Browse Subjects</Link>
          </div>
        ) : (
          <>
            {videos.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Video Lectures ({videos.length})
                </h2>
                <div className="space-y-3">
                  {videos.map((bookmark, index) => (
                    <BookmarkItem key={bookmark.id} bookmark={bookmark} index={index} />
                  ))}
                </div>
              </section>
            )}

            {pdfs.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF Notes ({pdfs.length})
                </h2>
                <div className="space-y-3">
                  {pdfs.map((bookmark, index) => (
                    <BookmarkItem key={bookmark.id} bookmark={bookmark} index={index} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function BookmarkItem({ bookmark, index }: { bookmark: any; index: number }) {
  const { material, createdAt, progress } = bookmark;
  const isVideo = material.type === 'VIDEO';
  const progressPercent = progress && material.duration
    ? Math.round((progress.playbackPosition / material.duration) * 100)
    : progress?.completed ? 100 : 0;

  return (
    <Link
      href={`/student/play/${material.id}`}
      className={cn('card-hover p-4 group animate-in', 'style', { animationDelay: `${index * 50}ms` })}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300',
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
              {progress?.completed && <span className="badge-success">Completed</span>}
              {progress && !progress.completed && progressPercent > 0 && <span className="badge-primary">{progressPercent}%</span>}
              <span className={cn('badge', isVideo ? 'badge-primary' : 'badge-secondary')}>
                {isVideo ? 'Video' : 'PDF'}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {material.topic?.chapter?.subject?.title} › {material.topic?.chapter?.title} › {material.topic?.title}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {material.duration && <span>{formatDuration(material.duration)}</span>}
            {progress?.lastWatched && !progress.completed && <span>Last: {formatRelativeTime(progress.lastWatched)}</span>}
            {progress?.completed && progress?.completedAt && <span className="text-green-600 dark:text-green-400">Completed {formatRelativeTime(progress.completedAt)}</span>}
            <span>Saved {formatRelativeTime(createdAt)}</span>
          </div>

          {(progressPercent > 0 || progress?.completed) && (
            <div className="mt-2 progress-bar h-1.5">
              <div className={cn('progress-fill rounded-full', progress?.completed && 'bg-green-500')} style={{ width: `${progressPercent}%` }} />
            </div>
          )}
        </div>

        <button className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0" aria-label="Remove bookmark">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Link>
  );
}