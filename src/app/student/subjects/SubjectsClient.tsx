// Subjects Client Component
'use client';

import Link from 'next/link';
import { Subject } from '@/types';
import { cn } from '@/lib/utils';

interface SubjectsClientProps {
  subjects: (Subject & { totalMaterials: number; completedMaterials: number; progressPercentage: number })[];
}

export default function SubjectsClient({ subjects }: SubjectsClientProps) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-16 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container-main px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Subjects</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {subjects.length} subjects available • Choose a subject to start learning
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-main px-4 py-6">
        {subjects.length === 0 ? (
          <div className="card p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No subjects available</h2>
            <p className="text-gray-500 dark:text-gray-400">Check back soon for new courses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subjects.map((subject, index) => (
              <SubjectCard key={subject.id} subject={subject} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SubjectCard({ subject, index }: { subject: Subject & { totalMaterials: number; completedMaterials: number; progressPercentage: number }; index: number }) {
  const hasProgress = subject.progressPercentage > 0;

  return (
    <Link
      href={`/student/subjects/${subject.id}`}
      className={cn(
        'card-hover p-5 group animate-in',
        'style',
        { animationDelay: `${index * 50}ms` }
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300',
          subject.icon?.includes('bg-') ? subject.icon : 'bg-primary-100 dark:bg-primary-900/30'
        )}>
          {subject.icon || '📚'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">{subject.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {subject.description || 'No description available'}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span>{subject.chapters?.length || 0} chapters</span>
            <span>•</span>
            <span>{subject.totalMaterials} materials</span>
          </div>
          {hasProgress && (
            <div className="flex items-center gap-2">
              <div className="flex-1 progress-bar h-1.5">
                <div className="progress-fill" style={{ width: `${subject.progressPercentage}%` }} />
              </div>
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400 w-12 text-right">
                {subject.progressPercentage}%
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}