import { useCallback } from 'react';

export function useDocumentTitle() {
	const setTitle = useCallback((title: string) => {
		document.title = title;
	}, []);

	const setWorkflowTitle = useCallback((workflowName: string, status?: string) => {
		const title = status ? `${workflowName} (${status})` : workflowName;
		document.title = title;
	}, []);

	const resetTitle = useCallback(() => {
		document.title = 'n8n - Workflow Automation';
	}, []);

	return {
		setTitle,
		setWorkflowTitle,
		resetTitle,
	};
}