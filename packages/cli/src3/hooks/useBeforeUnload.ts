import { useEffect } from 'react';
import { useWorkflowStore } from '../stores/workflows';

interface UseBeforeUnloadOptions {
	route?: any;
}

export function useBeforeUnload(options: UseBeforeUnloadOptions = {}) {
	const workflowStore = useWorkflowStore();

	const addBeforeUnloadEventBindings = () => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (workflowStore.getState().dirty) {
				e.preventDefault();
				e.returnValue = '';
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	};

	const removeBeforeUnloadEventBindings = () => {
		// This is handled by the cleanup function from addBeforeUnloadEventBindings
	};

	useEffect(() => {
		const cleanup = addBeforeUnloadEventBindings();
		return cleanup;
	}, [workflowStore]);

	return {
		addBeforeUnloadEventBindings,
		removeBeforeUnloadEventBindings,
	};
}