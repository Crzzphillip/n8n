import { useCallback } from 'react';
import { useWorkflowStore } from '../stores/workflows';
import { useNDVStore } from '../stores/ndv';
import { canvasEventBus } from '../event-bus/canvas';

export function useWorkflowHelpers() {
	const workflowStore = useWorkflowStore();
	const ndvStore = useNDVStore();

	const setDocumentTitle = useCallback((workflowName: string, status: string) => {
		const title = status === 'IDLE' ? workflowName : `${workflowName} (${status})`;
		document.title = title;
	}, []);

	const getWorkflowName = useCallback(() => {
		return workflowStore.getState().workflow.name;
	}, [workflowStore]);

	const getWorkflowId = useCallback(() => {
		return workflowStore.getState().workflow.id;
	}, [workflowStore]);

	const isWorkflowDirty = useCallback(() => {
		return workflowStore.getState().dirty;
	}, [workflowStore]);

	const saveWorkflow = useCallback(async () => {
		const workflow = workflowStore.getState().workflow;
		const isNew = !workflow.id;

		try {
			if (isNew) {
				const response = await fetch('/api/rest/workflows', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(workflow),
				});
				const result = await response.json();
				workflowStore.getState().setWorkflowId(result.id);
			} else {
				await fetch(`/api/rest/workflows/${workflow.id}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(workflow),
				});
			}
			workflowStore.getState().setDirty(false);
			return true;
		} catch (error) {
			console.error('Failed to save workflow:', error);
			return false;
		}
	}, [workflowStore]);

	const loadWorkflow = useCallback(
		async (id: string) => {
			try {
				const response = await fetch(`/api/rest/workflows/${id}`);
				if (!response.ok) {
					throw new Error('Failed to load workflow');
				}
				const workflow = await response.json();
				workflowStore.getState().setWorkflow(workflow);
				return workflow;
			} catch (error) {
				console.error('Failed to load workflow:', error);
				throw error;
			}
		},
		[workflowStore],
	);

	const createNewWorkflow = useCallback(() => {
		workflowStore.getState().resetWorkflow();
	}, [workflowStore]);

	const exportWorkflow = useCallback(() => {
		const workflow = workflowStore.getState().workflow;
		const dataStr = JSON.stringify(workflow, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${workflow.name || 'workflow'}.json`;
		link.click();
		URL.revokeObjectURL(url);
	}, [workflowStore]);

	const importWorkflow = useCallback(
		async (workflowData: any) => {
			try {
				workflowStore.getState().setWorkflow(workflowData);
				workflowStore.getState().setDirty(true);
				return true;
			} catch (error) {
				console.error('Failed to import workflow:', error);
				return false;
			}
		},
		[workflowStore],
	);

	const resetWorkspace = useCallback(() => {
		// Clear selections and NDV, and reset logs/executions UI if needed
		ndvStore.getState().setActiveNode(null);
		canvasEventBus.emit('nodes:select', { ids: [] });
	}, [ndvStore]);

	const initializeWorkspace = useCallback(
		(workflowData: any) => {
			workflowStore.getState().setWorkflow(workflowData);
			ndvStore.getState().setActiveNode(null);
			setTimeout(() => canvasEventBus.emit('fitView'));
		},
		[workflowStore, ndvStore],
	);

	const openWorkflow = useCallback(
		(workflowData: any) => {
			resetWorkspace();
			initializeWorkspace(workflowData);
			if (workflowData?.name) setDocumentTitle(workflowData.name, 'IDLE');
		},
		[resetWorkspace, initializeWorkspace, setDocumentTitle],
	);

	return {
		setDocumentTitle,
		getWorkflowName,
		getWorkflowId,
		isWorkflowDirty,
		saveWorkflow,
		loadWorkflow,
		createNewWorkflow,
		exportWorkflow,
		importWorkflow,
		resetWorkspace,
		initializeWorkspace,
		openWorkflow,
	};
}
