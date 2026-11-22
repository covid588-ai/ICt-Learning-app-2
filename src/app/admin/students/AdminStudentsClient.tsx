// Admin Students Client Component
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn, formatRelativeTime, getInitials } from '@/lib/utils';

interface AdminStudentsClientProps {
  students: any[];
  total: number;
  page: number;
  limit: number;
}

export default function AdminStudentsClient({ students, total, page, limit }: AdminStudentsClientProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'INACTIVE'>('all');
  const [viewingStudent, setViewingStudent] = useState<any | null>(null);

  const totalPages = Math.ceil(total / limit);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="container-main px-4 py-4 lg:px-6 lg:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Management</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {total} students • Manage access and view progress
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-main px-4 py-6 lg:px-6 lg:py-8">
        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="input pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="input w-auto sm:w-48"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="card overflow-hidden">
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No students found</h2>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Progress</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Bookmarks</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                              {getInitials(student.name || student.email)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                                {student.name || 'Unnamed'}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className={cn('badge', student.status === 'ACTIVE' ? 'badge-success' : 'badge-danger')}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-xs progress-bar h-1.5">
                              <div className="progress-fill" style={{ width: `${student.progressPercentage}%` }} />
                            </div>
                            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 w-12 text-right">
                              {student.progressPercentage}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {student.completedCount} / {student.totalProgress} completed
                          </p>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <span className="text-gray-600 dark:text-gray-400">{student._count.bookmarks}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-gray-600 dark:text-gray-400">
                            {formatRelativeTime(student.createdAt)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingStudent(student)}
                              className="p-2 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                              title="View Details"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                            <button
                              onClick={() => toggleStudentStatus(student)}
                              className={cn(
                                'p-2 rounded-xl transition-colors',
                                student.status === 'ACTIVE'
                                  ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                                  : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                              )}
                              title={student.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                            >
                              {student.status === 'ACTIVE' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Page {page} of {totalPages} • {total} students total
                  </p>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => window.location.search = `page=${page - 1}`}
                      className="btn-outline btn-sm"
                    >
                      Previous
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => window.location.search = `page=${page + 1}`}
                      className="btn-outline btn-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Student Detail Modal */}
          {viewingStudent && (
            <StudentDetailModal
              student={viewingStudent}
              onClose={() => setViewingStudent(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function StudentDetailModal({
  student,
  onClose,
}: {
  student: any;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xl font-medium">
              {getInitials(student.name || student.email)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{student.name || 'Unnamed'}</h2>
              <p className="text-gray-500 dark:text-gray-400">{student.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status & Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <span className={cn('badge', student.status === 'ACTIVE' ? 'badge-success' : 'badge-danger')}>
                {student.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Joined</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatRelativeTime(student.createdAt)}</p>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Learning Progress</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{student.completedCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{student.totalProgress - student.completedCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{student.progressPercentage}%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
              </div>
            </div>
          </div>

          {/* Bookmarks */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Bookmarks: {student._count.bookmarks}</h3>
            <p className="text-gray-500 dark:text-gray-400">Bookmarked materials would be listed here</p>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex gap-3">
            <button
              onClick={() => toggleStudentStatus(student)}
              className={cn(
                'btn flex-1',
                student.status === 'ACTIVE' ? 'btn-warning' : 'btn-success'
              )}
            >
              {student.status === 'ACTIVE' ? 'Disable Account' : 'Enable Account'}
            </button>
            <button className="btn-danger">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function toggleStudentStatus(student: any) {
  console.log('Toggle student status:', student.id, student.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
  // TODO: Call API to update student status
}