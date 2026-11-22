// Admin Subjects Client Component
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AdminSubjectsClientProps {
  subjects: any[];
}

export default function AdminSubjectsClient({ subjects }: AdminSubjectsClientProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="container-main px-4 py-4 lg:px-6 lg:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subjects Management</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {subjects.length} subjects • Manage your course catalog
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Subject
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-main px-4 py-6 lg:px-6 lg:py-8">
        {subjects.length === 0 ? (
          <div className="card p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No subjects yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first subject to start building courses</p>
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">
              Create Subject
            </button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Chapters</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Topics</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Videos</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">PDFs</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {subjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xl">
                            {subject.icon || '📚'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{subject.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{subject.description || 'No description'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-gray-600 dark:text-gray-400">{subject._count.chapters}</span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-gray-600 dark:text-gray-400">{subject.totalTopics}</span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-primary-600 dark:text-primary-400 font-medium">{subject.totalVideos}</span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-secondary-600 dark:text-secondary-400 font-medium">{subject.totalPdfs}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('badge', subject.published ? 'badge-success' : 'badge-warning')}>
                          {subject.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-600 dark:text-gray-400 font-mono">{subject.order}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/subjects/${subject.id}`}
                            className="p-2 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                            title="View chapters"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </Link>
                          <button
                            onClick={() => setEditingSubject(subject)}
                            className="p-2 rounded-xl text-gray-500 hover:text-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M11 5a2 2 0 10-4 0v3a2 2 0 004 0V5zM20 19l-7-7" /></svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(subject.id)}
                            className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <SubjectModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateSubject}
          />
        )}

        {editingSubject && (
          <SubjectModal
            subject={editingSubject}
            onClose={() => setEditingSubject(null)}
            onSubmit={handleUpdateSubject}
          />
        )}

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <DeleteConfirmModal
            subjectId={deleteConfirm}
            onClose={() => setDeleteConfirm(null)}
            onConfirm={handleDeleteSubject}
          />
        )}
      </main>
    </div>
  );
}

function SubjectModal({
  subject,
  onClose,
  onSubmit,
}: {
  subject?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: subject?.title || '',
    description: subject?.description || '',
    icon: subject?.icon || '📚',
    coverImage: subject?.coverImage || '',
    order: subject?.order || 0,
    published: subject?.published ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, id: subject?.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {subject ? 'Edit Subject' : 'Create Subject'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="label">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="input"
              required
              placeholder="e.g., ICT"
            />
          </div>

          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[80px]"
              rows={3}
              placeholder="Subject description..."
            />
          </div>

          <div>
            <label htmlFor="icon" className="label">Icon (Emoji)</label>
            <input
              id="icon"
              type="text"
              value={formData.icon}
              onChange={e => setFormData({ ...formData, icon: e.target.value })}
              className="input text-2xl text-center"
              maxLength={4}
              placeholder="📚"
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="label">Cover Image URL</label>
            <input
              id="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
              className="input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="order" className="label">Display Order</label>
            <input
              id="order"
              type="number"
              value={formData.order}
              onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="input"
              min="0"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="published"
              type="checkbox"
              checked={formData.published}
              onChange={e => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="published" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Published (visible to students)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {subject ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  subjectId,
  onClose,
  onConfirm,
}: {
  subjectId: string;
  onClose: () => void;
  onConfirm: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Subject?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This will permanently delete the subject and all its chapters, topics, videos, and PDFs.
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(subjectId); onClose(); }}
              className="btn-danger flex-1"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Handler functions (would connect to API in real implementation)
function handleCreateSubject(data: any) {
  console.log('Create subject:', data);
  // TODO: Call API to create subject
}

function handleUpdateSubject(data: any) {
  console.log('Update subject:', data);
  // TODO: Call API to update subject
}

function handleDeleteSubject(id: string) {
  console.log('Delete subject:', id);
  // TODO: Call API to delete subject
}