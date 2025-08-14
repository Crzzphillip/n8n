'use client';
import { useEffect } from 'react';

export function useKeyboardShortcuts(
	handlers: {
		onSave?: () => void;
		onUndo?: () => void;
		onRedo?: () => void;
		onDelete?: () => void;
		onTidy?: () => void;
		onAlign?: () => void;
		onCopy?: () => void;
		onPaste?: () => void;
		onRename?: () => void;
		onTab?: () => void;
		onShiftS?: () => void;
	},
	enabled: boolean = true,
) {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (!enabled) return;
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
			if (mod && key === 'c') {
				e.preventDefault();
				handlers.onCopy?.();
				return;
			}
			if (mod && key === 'v') {
				e.preventDefault();
				handlers.onPaste?.();
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
			// Additional mappings
			if (key === 'f2') {
				e.preventDefault();
				handlers.onRename?.();
				return;
			}
			if (e.shiftKey && !mod && key === 's') {
				e.preventDefault();
				handlers.onShiftS?.();
				return;
			}
			if (!mod && key === 'tab') {
				e.preventDefault();
				handlers.onTab?.();
				return;
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [handlers, enabled]);
}
