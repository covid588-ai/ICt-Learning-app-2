// Admin Dashboard Client Component
'use client';

import Link from 'next/link';
import { cn, formatRelativeTime } from '@/lib/utils';

interface AdminDashboardClientProps {
  stats: {
    totalSubjects: number;
    totalChapters: number;
    totalTopics: number;
    totalVideos: number;
    totalPdfs: number;
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
  };
  recentMaterials: any[];
  recentStudents: any[];
}

export default function AdminDashboardClient({ stats, recentMaterials, recentStudents }: AdminDashboardClientProps) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="container-main px-4 py-4 lg:px-6 lg:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage your educational platform</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-main px-4 py-6 lg:px-6 lg:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Subjects"
            value={stats.totalSubjects}
            icon={<BookIcon className="w-6 h-6" />}
            color="primary"
            href="/admin/subjects"
          />
          <StatCard
            title="Chapters"
            value={stats.totalChapters}
            icon={<ChapterIcon className="w-6 h-6" />}
            color="secondary"
            href="/admin/chapters"
          />
          <StatCard
            title="Topics"
            value={stats.totalTopics}
            icon={<TopicIcon className="w-6 h-6" />}
            color="accent"
            href="/admin/topics"
          />
          <StatCard
            title="Videos"
            value={stats.totalVideos}
            icon={<VideoIcon className="w-6 h-6" />}
            color="success"
            href="/admin/videos"
          />
          <StatCard
            title="PDFs"
            value={stats.totalPdfs}
            icon={<PdfIcon className="w-6 h-6" />}
            color="warning"
            href="/admin/pdfs"
          />
          <StatCard
            title="Students"
            value={stats.totalStudents}
            icon={<UsersIcon className="w-6 h-6" />}
            color="primary"
            href="/admin/students"
          />
          <StatCard
            title="Active"
            value={stats.activeStudents}
            icon={<CheckIcon className="w-6 h-6" />}
            color="success"
            subtitle={`${stats.inactiveStudents} inactive`}
          />
          <StatCard
            title="Content Items"
            value={stats.totalVideos + stats.totalPdfs}
            icon={<FileIcon className="w-6 h-6" />}
            color="secondary"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/admin/subjects/new" className="card-hover p-4 text-center group">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <BookIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">Add Subject</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create new subject</p>
            </Link>
            <Link href="/admin/videos/new" className="card-hover p-4 text-center group">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-success-100 dark:bg-green-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <VideoIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">Add Video</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload video lecture</p>
            </Link>
            <Link href="/admin/pdfs/new" className="card-hover p-4 text-center group">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <PdfIcon className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">Add PDF</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload PDF notes</p>
            </Link>
            <Link href="/admin/students" className="card-hover p-4 text-center group">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <UsersIcon className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">Manage Students</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View & manage users</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Materials */}
          <section className="card">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">Recent Content</h2>
              <Link href="/admin/videos" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentMaterials.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">No content yet</div>
              ) : (
                recentMaterials.map((material) => (
                  <Link
                    key={material.id}
                    href={`/admin/${material.type.toLowerCase()}s/${material.id}`}
                    className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      material.type === 'VIDEO' ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-secondary-100 dark:bg-secondary-900/30'
                    )}>
                      {material.type === 'VIDEO' ? (
                        <VideoIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      ) : (
                        <PdfIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{material.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {material.topic?.chapter?.subject?.title} › {material.topic?.chapter?.title} › {material.topic?.title}
                      </p>
                    </div>
                    <span className={cn('badge text-xs', material.type === 'VIDEO' ? 'badge-primary' : 'badge-secondary')}>
                      {material.type}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Recent Students */}
          <section className="card">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">Recent Students</h2>
              <Link href="/admin/students" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentStudents.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">No students yet</div>
              ) : (
                recentStudents.map((student) => (
                  <div key={student.id} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium flex-shrink-0">
                      {student.name?.[0]?.toUpperCase() || student.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{student.name || 'Unnamed'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{student.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn('badge text-xs', student.status === 'ACTIVE' ? 'badge-success' : 'badge-danger')}>
                        {student.status}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {student._count.progress} progress
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatRelativeTime(student.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  href,
  subtitle,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'accent';
  href?: string;
  subtitle?: string;
}) {
  const colors = {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    secondary: 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    accent: 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400',
  };

  const Content = href ? Link : 'div';

  return (
    <Content href={href} className={cn('card p-5 transition-colors', href && 'hover:shadow-card-hover cursor-pointer')}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
          {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={cn('p-3 rounded-xl', colors[color])}>{icon}</div>
      </div>
    </Content>
  );
}

// Icons
function BookIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
}

function ChapterIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
}

function TopicIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}

function VideoIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
}

function PdfIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}

function UsersIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
}

function CheckIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
}

function FileIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}