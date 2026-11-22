// Student Dashboard Client Component
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatRelativeTime, getInitials, cn } from '@/lib/utils';
import { LearningProgress, Bookmark, Subject } from '@/types';

interface DashboardData {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    createdAt: Date;
  };
  continueWatching: (LearningProgress & { material: any })[];
  recentlyCompleted: (LearningProgress & { material: any })[];
  bookmarks: (Bookmark & { material: any })[];
  subjectProgress: (Subject & { totalMaterials: number; completedMaterials: number; progressPercentage: number })[];
  stats: {
    completedCount: number;
    inProgressCount: number;
    totalSubjects: number;
  };
}

interface StudentDashboardClientProps {
  initialData: DashboardData;
}

export default function StudentDashboardClient({ initialData }: StudentDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'continue' | 'subjects' | 'progress'>('continue');
  const { user, continueWatching, recentlyCompleted, bookmarks, subjectProgress, stats } = initialData;

  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-16 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container-main px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {greeting}, {user.name?.split(' ')[0] || 'Learner'}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {activeTab === 'continue' && 'Pick up where you left off'}
                {activeTab === 'subjects' && 'Explore all available subjects'}
                {activeTab === 'progress' && 'Track your learning journey'}
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-full sm:w-auto">
              {[
                { id: 'continue', label: 'Continue', icon: PlayIcon },
                { id: 'subjects', label: 'Subjects', icon: BookIcon },
                { id: 'progress', label: 'Progress', icon: ChartIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-soft'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-main px-4 py-6">
        {activeTab === 'continue' && (
          <ContinueTab
            continueWatching={continueWatching}
            recentlyCompleted={recentlyCompleted}
            bookmarks={bookmarks}
          />
        )}
        {activeTab === 'subjects' && (
          <SubjectsTab subjectProgress={subjectProgress} />
        )}
        {activeTab === 'progress' && (
          <ProgressTab stats={stats} subjectProgress={subjectProgress} />
        )}
      </main>
    </div>
  );
}

// Continue Learning Tab
function ContinueTab({
  continueWatching,
  recentlyCompleted,
  bookmarks,
}: {
  continueWatching: DashboardData['continueWatching'];
  recentlyCompleted: DashboardData['recentlyCompleted'];
  bookmarks: DashboardData['bookmarks'];
}) {
  return (
    <div className="space-y-8 animate-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Continue Watching"
          value={continueWatching.length}
          icon={<PlayIcon className="w-6 h-6" />}
          color="primary"
        />
        <StatCard
          title="Completed"
          value={recentlyCompleted.length}
          icon={<CheckIcon className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="Bookmarks"
          value={bookmarks.length}
          icon={<BookmarkIcon className="w-6 h-6" />}
          color="accent"
        />
        <StatCard
          title="Study Streak"
          value="7 days"
          icon={<FireIcon className="w-6 h-6" />}
          color="warning"
        />
      </div>

      {/* Continue Watching */}
      {continueWatching.length > 0 ? (
        <Section title="Continue Watching" description="Resume your lessons">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {continueWatching.map((item, index) => (
              <ContinueCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </Section>
      ) : (
        <EmptyState
          icon={<PlayIcon className="w-12 h-12" />}
          title="Nothing to continue yet"
          description="Start a course to see your progress here"
          action={<Link href="/student/subjects" className="btn-primary">Browse Subjects</Link>}
        />
      )}

      {/* Recently Completed */}
      {recentlyCompleted.length > 0 && (
        <Section title="Recently Completed" description="Your latest achievements">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyCompleted.map((item, index) => (
              <CompletedCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </Section>
      )}

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <Section title="Bookmarked" description="Saved for later">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((item, index) => (
              <BookmarkCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// Subjects Tab
function SubjectsTab({ subjectProgress }: { subjectProgress: DashboardData['subjectProgress'] }) {
  const publishedSubjects = subjectProgress.filter(s => s.published);

  if (publishedSubjects.length === 0) {
    return (
      <EmptyState
        icon={<BookIcon className="w-12 h-12" />}
        title="No subjects available yet"
        description="Check back soon for new courses"
      />
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <Section title="All Subjects" description={`${publishedSubjects.length} subjects available`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {publishedSubjects.map((subject, index) => (
            <SubjectCard key={subject.id} subject={subject} progress={subject.progressPercentage} index={index} />
          ))}
        </div>
      </Section>
    </div>
  );
}

// Progress Tab
function ProgressTab({
  stats,
  subjectProgress,
}: {
  stats: DashboardData['stats'];
  subjectProgress: DashboardData['subjectProgress'];
}) {
  const publishedSubjects = subjectProgress.filter(s => s.published);
  const totalMaterials = publishedSubjects.reduce((acc, s) => acc + s.totalMaterials, 0);
  const completedMaterials = publishedSubjects.reduce((acc, s) => acc + s.completedMaterials, 0);
  const overallProgress = totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0;

  return (
    <div className="space-y-8 animate-in">
      {/* Overall Progress */}
      <div className="card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Overall Progress</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {completedMaterials} of {totalMaterials} materials completed
            </p>
          </div>
          <div className="w-full md:w-48">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion</span>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{overallProgress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Completed"
          value={stats.completedCount}
          icon={<CheckIcon className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressCount}
          icon={<PlayIcon className="w-6 h-6" />}
          color="primary"
        />
        <StatCard
          title="Subjects"
          value={stats.totalSubjects}
          icon={<BookIcon className="w-6 h-6" />}
          color="secondary"
        />
        <StatCard
          title="Bookmarks"
          value={0} // Would fetch from bookmarks
          icon={<BookmarkIcon className="w-6 h-6" />}
          color="accent"
        />
      </div>

      {/* Subject Progress */}
      <Section title="Subject Progress" description="Detailed breakdown by subject">
        <div className="space-y-4">
          {publishedSubjects.map((subject, index) => (
            <SubjectProgressRow key={subject.id} subject={subject} index={index} />
          ))}
        </div>
      </Section>
    </div>
  );
}

// Components
function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: 'primary' | 'secondary' | 'success' | 'warning' | 'accent' }) {
  const colors = {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    secondary: 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    accent: 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400',
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
}

function ContinueCard({ item, index }: { item: any; index: number }) {
  const { material, playbackPosition, lastWatched } = item;
  const progress = material.duration ? Math.round((playbackPosition / material.duration) * 100) : 0;

  return (
    <Link href={`/student/play/${material.id}`} className="card-hover p-4 group animate-in" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl relative overflow-hidden mb-3">
        {material.thumbnail ? (
          <img src={material.thumbnail} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <PlayIcon className="w-12 h-12" />
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {material.duration ? formatRelativeTime(material.duration * 1000) : '—'}
        </div>
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600" style={{ width: `${progress}%` }} />
        )}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{material.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {material.topic?.chapter?.subject?.title} › {material.topic?.chapter?.title} › {material.topic?.title}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">{formatRelativeTime(lastWatched)}</span>
        {progress > 0 && (
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{progress}% watched</span>
        )}
      </div>
    </Link>
  );
}

function CompletedCard({ item, index }: { item: any; index: number }) {
  const { material, completedAt } = item;

  return (
    <div className="card-hover p-4 animate-in" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
          <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{material.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {material.topic?.chapter?.subject?.title} › {material.topic?.chapter?.title}
          </p>
          <span className="text-xs text-gray-400 dark:text-gray-500">Completed {formatRelativeTime(completedAt!)}</span>
        </div>
      </div>
    </div>
  );
}

function BookmarkCard({ item, index }: { item: any; index: number }) {
  const { material } = item;

  return (
    <Link href={`/student/play/${material.id}`} className="card-hover p-4 animate-in" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
          {material.type === 'VIDEO' ? (
            <PlayIcon className="w-6 h-6 text-gray-400" />
          ) : (
            <FileIcon className="w-6 h-6 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{material.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {material.topic?.chapter?.subject?.title} › {material.topic?.chapter?.title}
          </p>
          <span className={`badge ${material.type === 'VIDEO' ? 'badge-primary' : 'badge-secondary'}`}>
            {material.type === 'VIDEO' ? 'Video' : 'PDF'}
          </span>
        </div>
      </div>
    </Link>
  );
}

function SubjectCard({ subject, progress, index }: { subject: any; progress: number; index: number }) {
  return (
    <Link href={`/student/subjects/${subject.id}`} className="card-hover p-4 group animate-in" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
        {subject.icon || '📚'}
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{subject.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{subject.description || 'No description'}</p>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="progress-bar h-1.5">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{progress}% complete</p>
        </div>
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Explore →</span>
      </div>
    </Link>
  );
}

function SubjectProgressRow({ subject, index }: { subject: any; index: number }) {
  return (
    <div className="card p-4 animate-in" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xl flex-shrink-0">
          {subject.icon || '📚'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{subject.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {subject.completedMaterials} / {subject.totalMaterials} materials
          </p>
        </div>
        <div className="w-32 text-right flex-shrink-0">
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{subject.progressPercentage}%</p>
          <div className="progress-bar h-1.5 mt-1">
            <div className="progress-fill" style={{ width: `${subject.progressPercentage}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="card p-12 text-center animate-in">
      <div className="text-gray-300 dark:text-gray-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{description}</p>
      {action && <div className="inline-block">{action}</div>}
    </div>
  );
}

// Icons
function PlayIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}

function BookIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
}

function ChartIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
}

function CheckIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
}

function BookmarkIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>;
}

function FireIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>;
}

function FileIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}