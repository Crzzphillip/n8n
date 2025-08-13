import { useCallback } from 'react';

interface MessageOptions {
	title?: string;
	message: string;
	type?: 'info' | 'warning' | 'error' | 'success';
	confirmText?: string;
	cancelText?: string;
}

export function useMessage() {
	const showMessage = useCallback((options: MessageOptions): Promise<boolean> => {
		return new Promise((resolve) => {
			// In a real implementation, this would show a message dialog
			console.log('Message:', options);
			
			// For now, we'll just resolve with true (user confirmed)
			// In a real implementation, this would show a modal and wait for user input
			resolve(true);
		});
	}, []);

	const confirm = useCallback((message: string, title?: string): Promise<boolean> => {
		return showMessage({
			message,
			title: title || 'Confirm',
			type: 'warning',
			confirmText: 'Yes',
			cancelText: 'No',
		});
	}, [showMessage]);

	const alert = useCallback((message: string, title?: string): Promise<void> => {
		return showMessage({
			message,
			title: title || 'Alert',
			type: 'info',
			confirmText: 'OK',
		}).then(() => {});
	}, [showMessage]);

	return {
		showMessage,
		confirm,
		alert,
	};
}