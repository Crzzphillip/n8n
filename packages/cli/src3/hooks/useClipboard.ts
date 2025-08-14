import { useCallback, useEffect } from 'react';

interface UseClipboardOptions {
	onPaste?: (plainTextData: string) => Promise<void>;
}

export function useClipboard(options: UseClipboardOptions = {}) {
	const { onPaste } = options;

	const copyToClipboard = useCallback(async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
			return false;
		}
	}, []);

	const readFromClipboard = useCallback(async () => {
		try {
			const text = await navigator.clipboard.readText();
			return text;
		} catch (error) {
			console.error('Failed to read from clipboard:', error);
			return '';
		}
	}, []);

	useEffect(() => {
		if (!onPaste) return;

		const handlePaste = async (event: ClipboardEvent) => {
			const plainTextData = event.clipboardData?.getData('text/plain');
			if (plainTextData) {
				await onPaste(plainTextData);
			}
		};

		document.addEventListener('paste', handlePaste);
		return () => {
			document.removeEventListener('paste', handlePaste);
		};
	}, [onPaste]);

	return {
		copyToClipboard,
		readFromClipboard,
	};
}