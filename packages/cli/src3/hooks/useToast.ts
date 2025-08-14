import { useCallback } from 'react';

interface ToastOptions {
	title?: string;
	message?: string;
	type?: 'success' | 'error' | 'warning' | 'info';
	duration?: number;
}

export function useToast() {
	const showToast = useCallback((options: ToastOptions) => {
		// In a real implementation, this would show a toast notification
		console.log('Toast:', options);
		
		// Example implementation with a toast library:
		// toast(options.message, {
		//   type: options.type || 'info',
		//   title: options.title,
		//   duration: options.duration || 5000,
		// });
	}, []);

	const showSuccess = useCallback((message: string, title?: string) => {
		showToast({ message, title, type: 'success' });
	}, [showToast]);

	const showError = useCallback((error: any, title?: string, message?: string) => {
		const errorMessage = message || (error instanceof Error ? error.message : String(error));
		showToast({ 
			message: errorMessage, 
			title: title || 'Error', 
			type: 'error' 
		});
	}, [showToast]);

	const showWarning = useCallback((message: string, title?: string) => {
		showToast({ message, title, type: 'warning' });
	}, [showToast]);

	const showInfo = useCallback((message: string, title?: string) => {
		showToast({ message, title, type: 'info' });
	}, [showToast]);

	return {
		showToast,
		showSuccess,
		showError,
		showWarning,
		showInfo,
	};
}