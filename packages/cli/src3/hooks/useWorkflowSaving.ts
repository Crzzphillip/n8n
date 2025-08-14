import { useCallback } from 'react';
import { useWorkflowStore } from '../stores/workflows';
import { useWorkflowHelpers } from './useWorkflowHelpers';

interface UseWorkflowSavingOptions {
	router?: any;
}

export function useWorkflowSaving(options: UseWorkflowSavingOptions = {}) {
	const { router } = options;
	const workflowStore = useWorkflowStore();
	const workflowHelpers = useWorkflowHelpers();

	const saveCurrentWorkflow = useCallback(async () => {
		const success = await workflowHelpers.saveWorkflow();
		if (success) {
			// Emit saved event or show success message
			console.log('Workflow saved successfully');
		}
		return success;
	}, [workflowHelpers]);

	const promptSaveUnsavedWorkflowChanges = useCallback(async (
		next: () => void,
		options: {
			confirm: () => Promise<boolean>;
		}
	) => {
		const isDirty = workflowStore.getState().dirty;
		
		if (!isDirty) {
			next();
			return;
		}

		// In a real implementation, this would show a confirmation dialog
		// For now, we'll just save automatically
		const saved = await saveCurrentWorkflow();
		if (saved) {
			const shouldContinue = await options.confirm();
			if (shouldContinue) {
				next();
			}
		}
	}, [workflowStore, saveCurrentWorkflow]);

	return {
		saveCurrentWorkflow,
		promptSaveUnsavedWorkflowChanges,
	};
}