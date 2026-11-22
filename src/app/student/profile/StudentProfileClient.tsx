// Student Profile Client Component
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn, formatRelativeTime, getInitials } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';

interface StudentProfileClientProps {
  user: any;
  stats: {
    completedCount: number;
    inProgressCount: number;
    totalProgressCount: number;
    bookmarkCount: number;
  };
  recentProgress: any[];
  recentBookmarks: any[];
}

export default function StudentProfileClient({
  user,
  stats,
  recentProgress,
  recentBookmarks,
}: StudentProfileClientProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'bookmarks' | 'settings'>('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email,
  });

  const handleSaveProfile = async () => {
    // TODO: Call API to update profile
    console.log('Save profile:', formData);
    setEditingProfile(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-16 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container-main px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage your account and learning preferences</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-main px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="card p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-4xl font-medium text-primary-600 dark:text-primary-400 flex-shrink-0">
                {getInitials(user.name || user.email)}
              </div>
              <div className="flex-1">
                {editingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="label">Display Name</label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="input"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="label">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        className="input bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                        disabled
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSaveProfile} className="btn-primary">Save Changes</button>
                      <button onClick={() => setEditingProfile(false)} className="btn-outline">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.name || 'Unnamed Student'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className={cn('badge', user.status === 'ACTIVE' ? 'badge-success' : 'badge-danger')}>
                        {user.status}
                      </span>
                      <span className="badge-outline">Member since {formatRelativeTime(user.createdAt)}</span>
                      {user.googleId && (
                        <span className="badge-primary">Google Connected</span>
                      )}
                    </div>
                    <button onClick={() => setEditingProfile(true)} className="btn-outline mt-4">
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <button onClick={handleSignOut} className="btn-danger">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Completed" value={stats.completedCount} icon={<CheckIcon className="w-6 h-6" />} color="success" />
            <StatCard title="In Progress" value={stats.inProgressCount} icon={<PlayIcon className="w-6 h-6" />} color="primary" />
            <StatCard title="Total Started" value={stats.totalProgressCount} icon={<BookIcon className="w-6 h-6" />} color="secondary" />
            <StatCard title="Bookmarks" value={stats.bookmarkCount} icon={<BookmarkIcon className="w-6 h-6" />} color="accent" />
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="flex gap-1" aria-label="Profile tabs">
              {[
                { id: 'overview', label: 'Overview', icon: HomeIcon },
                { id: 'activity', label: 'Recent Activity', icon: ClockIcon },
                { id: 'bookmarks', label: 'Bookmarks', icon: BookmarkIcon },
                { id: 'settings', label: 'Settings', icon: SettingsIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="card">
            {activeTab === 'overview' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Overview</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Progress</span>
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                        {stats.totalProgressCount > 0 ? Math.round((stats.completedCount / stats.totalProgressCount) * 100) : 0}%
                      </span>
                    </div>
                    <div className="progress-bar h-3">
                      <div className="progress-fill" style={{ width: `${stats.totalProgressCount > 0 ? Math.round((stats.completedCount / stats.totalProgressCount) * 100) : 0}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Completed Lectures</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completedCount}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">In Progress</p>
                      <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgressCount}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bookmarked</p>
                      <p className="text-3xl font-bold text-accent-600 dark:text-accent-400">{stats.bookmarkCount}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Started</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProgressCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentProgress.length === 0 ? (
                  <div className="p-12 text-center">
                    <ClockIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No activity yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">Start learning to see your activity here</p>
                    <Link href="/student/subjects" className="btn-primary mt-4 inline-block">Browse Subjects</Link>
                  </div>
                ) : (
                  recentProgress.map((item, index) => (
                    <Link
                      key={item.id}
                      href={`/student/play/${item.material.id}`}
                      className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        item.material.type === 'VIDEO' ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-secondary-100 dark:bg-secondary-900/30'
                      )}>
                        {item.material.type === 'VIDEO' ? (
                          <PlayIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        ) : (
                          <FileIcon className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{item.material.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {item.material.topic?.chapter?.subject?.title} › {item.material.topic?.chapter?.title} › {item.material.topic?.title}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {item.completed ? '✓ Completed' : `${Math.round((item.playbackPosition / (item.material.duration || 1)) * 100)}% watched`}
                        </p>
                      </div>
                      <span className={cn('badge text-xs', item.material.type === 'VIDEO' ? 'badge-primary' : 'badge-secondary')}>
                        {item.material.type}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentBookmarks.length === 0 ? (
                  <div className="p-12 text-center">
                    <BookmarkIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No bookmarks yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">Save lectures and notes for quick access</p>
                  </div>
                ) : (
                  recentBookmarks.map((item, index) => (
                    <Link
                      key={item.id}
                      href={`/student/play/${item.material.id}`}
                      className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        item.material.type === 'VIDEO' ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-secondary-100 dark:bg-secondary-900/30'
                      )}>
                        {item.material.type === 'VIDEO' ? (
                          <PlayIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        ) : (
                          <FileIcon className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{item.material.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {item.material.topic?.chapter?.subject?.title} › {item.material.topic?.chapter?.title}
                        </p>
                      </div>
                      <span className={cn('badge text-xs', item.material.type === 'VIDEO' ? 'badge-primary' : 'badge-secondary')}>
                        {item.material.type}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-6 space-y-8">
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Use system preference</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about new content</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Progress Tracking</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save playback position</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Language</h3>
                  <div className="flex gap-3">
                    <button className="btn-primary">Bengali (বাংলা)</button>
                    <button className="btn-outline">English</button>
                  </div>
                </section>

                <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Danger Zone</h3>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-red-700 dark:text-red-300 mb-4">Deleting your account will permanently remove all your progress, bookmarks, and data. This action cannot be undone.</p>
                    <button className="btn-danger">Delete Account</button>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: 'primary' | 'secondary' | 'success' | 'accent' }) {
  const colors = {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    secondary: 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    accent: 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400',
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={cn('p-3 rounded-xl', colors[color])}>{icon}</div>
      </div>
    </div>
  );
}

// Icons
function HomeIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
}

function ClockIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}

function BookmarkIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>;
}

function SettingsIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}

function CheckIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
}

function PlayIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}

function BookIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
}

function FileIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}