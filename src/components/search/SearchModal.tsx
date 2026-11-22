// Search Modal Component - Global Search with Keyboard Shortcut
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { cn, formatRelativeTime } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'subject' | 'chapter' | 'topic' | 'material';
  title: string;
  description?: string;
  icon?: string;
  materialType?: string;
  parentId?: string;
  parentTitle?: string;
  published: boolean;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Fetch results on query change
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`, {
          credentials: 'include',
        });
        const data = await response.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          navigateToResult(results[selectedIndex]);
        }
        break;
    }
  }, [results, selectedIndex, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const navigateToResult = (result: SearchResult) => {
    let href = '/';
    switch (result.type) {
      case 'subject':
        href = `/student/subjects/${result.id}`;
        break;
      case 'chapter':
        href = `/student/subjects/${result.parentId}/chapters/${result.id}`;
        break;
      case 'topic':
        href = `/student/subjects/${result.parentId}/topics/${result.id}`;
        break;
      case 'material':
        href = `/student/play/${result.id}`;
        break;
    }
    router.push(href);
    onClose();
  };

  // We'll use window.location for now since we don't have router in this component
  const router = {
    push: (url: string) => { window.location.href = url; }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl mx-4" onClick={e => e.stopPropagation()}>
        {/* Search Input */}
        <div className="card shadow-2xl overflow-hidden">
          <div className="p-4 relative">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search subjects, chapters, topics, videos, PDFs... (Press ⌘K to open)"
                className="input w-full pl-12 pr-12 text-lg"
                autoComplete="off"
                spellCheck={false}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Keyboard Shortcut Hint */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 font-mono">⌘K</kbd> to open • <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 font-mono">↑↓</kbd> navigate • <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 font-mono">Enter</kbd> select • <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300 font-mono">Esc</kbd> close
            </p>
          </div>

          {/* Results */}
          <div
            ref={resultsRef}
            className="max-h-[60vh] overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700"
          >
            {loading && (
              <div className="p-8 text-center">
                <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent" />
                  Searching...
                </div>
              </div>
            )}

            {results.length === 0 && !loading && query.length >= 2 && (
              <div className="p-8 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
              </div>
            )}

            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => navigateToResult(result)}
                className={cn(
                  'w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-start gap-4',
                  index === selectedIndex && 'bg-primary-50 dark:bg-primary-900/20'
                )}
              >
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  result.type === 'subject' ? 'bg-primary-100 dark:bg-primary-900/30' :
                  result.type === 'chapter' ? 'bg-secondary-100 dark:bg-secondary-900/30' :
                  result.type === 'topic' ? 'bg-accent-100 dark:bg-accent-900/30' :
                  result.materialType === 'VIDEO' ? 'bg-primary-100 dark:bg-primary-900/30' :
                  'bg-secondary-100 dark:bg-secondary-900/30'
                )}>
                  {result.icon ? (
                    <span className="text-xl">{result.icon}</span>
                  ) : (
                    result.type === 'subject' && <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  ) : (
                    result.type === 'chapter' && <svg className="w-6 h-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  ) : (
                    result.type === 'topic' && <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  ) : (
                    result.materialType === 'VIDEO' && <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  ) : (
                    <svg className="w-6 h-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">{result.title}</h4>
                    {result.type === 'material' && (
                      <span className={cn('badge text-xs', result.materialType === 'VIDEO' ? 'badge-primary' : 'badge-secondary')}>
                        {result.materialType}
                      </span>
                    )}
                    {!result.published && (
                      <span className="badge-warning text-xs">Draft</span>
                    )}
                  </div>
                  {result.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-1">{result.description}</p>
                  )}
                  {result.parentTitle && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{result.parentTitle}</p>
                  )}
                </div>

                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}