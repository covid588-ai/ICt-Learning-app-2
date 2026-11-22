// Search Hook - Global Keyboard Shortcut (⌘K / Ctrl+K)
'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseSearchOptions {
  onOpen: () => void;
  onClose: () => void;
  enabled?: boolean;
}

export function useSearch({ onOpen, onClose, enabled = true }: UseSearchOptions) {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');
  const modifierKey = isMac ? 'metaKey' : 'ctrlKey';

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    // Check for ⌘K / Ctrl+K
    if (e[modifierKey] && e.key.toLowerCase() === 'k') {
      // Prevent browser's default find behavior
      e.preventDefault();
      e.stopPropagation();
      onOpen();
    }

    // Escape to close
    if (e.key === 'Escape') {
      onClose();
    }
  }, [enabled, modifierKey, onOpen, onClose]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [enabled, handleKeyDown]);
}

// Hook for managing search modal state
export function useSearchModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle };
}