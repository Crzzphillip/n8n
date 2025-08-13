"use client";
import { useEffect } from 'react';

export function useKeyboardShortcuts(handlers: {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onTidy?: () => void;
  onAlign?: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const mod = isMac ? e.metaKey : e.ctrlKey;
      const key = e.key.toLowerCase();
      if (mod && key === 's') {
        e.preventDefault();
        handlers.onSave?.();
        return;
      }
      if (mod && key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handlers.onUndo?.();
        return;
      }
      if (mod && (key === 'y' || (key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handlers.onRedo?.();
        return;
      }
      if (key === 'delete' || key === 'backspace') {
        handlers.onDelete?.();
        return;
      }
      if (mod && key === 't') {
        e.preventDefault();
        handlers.onTidy?.();
        return;
      }
      if (mod && key === 'a') {
        e.preventDefault();
        handlers.onAlign?.();
        return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlers]);
}