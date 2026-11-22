// Admin PDFs Client Component
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn, extractDriveFileId } from '@/lib/utils';

interface AdminPdfsClientProps {
  pdfs: any[];
}

export default function AdminPdfsClient({ pdfs }: AdminPdfsClientProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPdf, setEditingPdf] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="container-main px-4 py-4 lg:px-6 lg:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PDF Notes Management</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {pdfs.length} PDFs • Add, edit, and manage PDF content
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add PDF
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-main px-4 py-6 lg:px-6 lg:py-8">
        {pdfs.length === 0 ? (
          <div className="card p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No PDFs yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Add your first PDF notes</p>
            <button onClick={() => setShowCreateModal(true)} className="btn-secondary">
              Add PDF
            </button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">PDF</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Topic</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Chapter</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Subject</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {pdfs.map((pdf) => (
                    <tr key={pdf.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">{pdf.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              Drive ID: {pdf.driveFileId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-gray-600 dark:text-gray-400 truncate block max-w-xs">
                          {pdf.topic?.title}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-gray-600 dark:text-gray-400">
                          {pdf.topic?.chapter?.title}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-gray-600 dark:text-gray-400">
                          {pdf.topic?.chapter?.subject?.title}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-600 dark:text-gray-400 font-mono">{pdf.order}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('badge', pdf.published ? 'badge-success' : 'badge-warning')}>
                          {pdf.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setPreviewPdf(pdf.driveFileId)}
                            className="p-2 rounded-xl text-gray-500 hover:text-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors"
                            title="Preview"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>

                          <button
                            onClick={() => setEditingPdf(pdf)}
                            className="p-2 rounded-xl text-gray-500 hover:text-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M11 5a2 2 0 10-4 0v3a2 2 0 004 0V5zM20 19l-7-7" /></svg>
                          </button>

                          <button
                            onClick={() => setDeleteConfirm(pdf.id)}
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
          <PdfModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreatePdf}
          />
        )}

        {editingPdf && (
          <PdfModal
            pdf={editingPdf}
            onClose={() => setEditingPdf(null)}
            onSubmit={handleUpdatePdf}
          />
        )}

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <DeleteConfirmModal
            itemId={deleteConfirm}
            itemType="PDF"
            onClose={() => setDeleteConfirm(null)}
            onConfirm={handleDeletePdf}
          />
        )}

        {/* Preview Modal */}
        {previewPdf && (
          <PreviewModal
            driveFileId={previewPdf}
            onClose={() => setPreviewPdf(null)}
          />
        )}
      </main>
    </div>
  );
}

function PdfModal({
  pdf,
  onClose,
  onSubmit,
}: {
  pdf?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    topicId: pdf?.topicId || '',
    title: pdf?.title || '',
    description: pdf?.description || '',
    driveUrl: pdf?.driveFileId ? `https://drive.google.com/file/d/${pdf.driveFileId}/view` : '',
    order: pdf?.order || 0,
    published: pdf?.published ?? false,
  });
  const [driveFileId, setDriveFileId] = useState(pdf?.driveFileId || '');
  const [driveError, setDriveError] = useState('');

  const handleDriveUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, driveUrl: url });
    const extractedId = extractDriveFileId(url);
    if (extractedId) {
      setDriveFileId(extractedId);
      setDriveError('');
    } else if (url) {
      setDriveError('Invalid Google Drive URL format');
    } else {
      setDriveFileId('');
      setDriveError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveFileId) {
      setDriveError('Please enter a valid Google Drive URL');
      return;
    }
    onSubmit({ ...formData, driveFileId, driveUrl: formData.driveUrl });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {pdf ? 'Edit PDF Notes' : 'Add PDF Notes'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="topicId" className="label">Topic *</label>
            <select
              id="topicId"
              value={formData.topicId}
              onChange={e => setFormData({ ...formData, topicId: e.target.value })}
              className="input"
              required
            >
              <option value="">Select a topic...</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Topics will be loaded from the server
            </p>
          </div>

          <div>
            <label htmlFor="title" className="label">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="input"
              required
              placeholder="PDF notes title"
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
              placeholder="PDF description..."
            />
          </div>

          <div>
            <label htmlFor="driveUrl" className="label">Google Drive URL *</label>
            <input
              id="driveUrl"
              type="url"
              value={formData.driveUrl}
              onChange={handleDriveUrlChange}
              className="input"
              required
              placeholder="https://drive.google.com/file/d/FILE_ID/view"
            />
            {driveFileId && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Extracted File ID: {driveFileId}
              </p>
            )}
            {driveError && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{driveError}</p>
            )}
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
              className="w-4 h-4 rounded border-gray-300 text-secondary-600 focus:ring-secondary-500"
            />
            <label htmlFor="published" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Published (visible to students)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-secondary flex-1">
              {pdf ? 'Update' : 'Add PDF'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PreviewModal({
  driveFileId,
  onClose,
}: {
  driveFileId: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">PDF Preview</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="h-[70vh]">
          <iframe
            src={`https://drive.google.com/file/d/${driveFileId}/preview`}
            className="w-full h-full border-0"
            allowFullScreen
          />
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          Preview uses Google Drive's embedded viewer. Actual viewing in the app uses secure streaming.
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  itemId,
  itemType,
  onClose,
  onConfirm,
}: {
  itemId: string;
  itemType: string;
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
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete {itemType}?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This action cannot be undone. All student progress for this {itemType} will also be removed.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(itemId); onClose(); }}
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

function handleCreatePdf(data: any) {
  console.log('Create PDF:', data);
}

function handleUpdatePdf(data: any) {
  console.log('Update PDF:', data);
}

function handleDeletePdf(id: string) {
  console.log('Delete PDF:', id);
}