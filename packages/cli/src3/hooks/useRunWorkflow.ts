import { useCallback } from 'react';
import { useExecutionsStore } from '../stores/executions';
import { useWorkflowStore } from '../stores/workflows';
import { useAgentRequestStore } from '../stores/agentRequest';

interface UseRunWorkflowOptions {
	router?: any;
}

export function useRunWorkflow(options: UseRunWorkflowOptions = {}) {
	const { router } = options;
	const executionsStore = useExecutionsStore();
	const workflowStore = useWorkflowStore();
	const agentRequestStore = useAgentRequestStore();

	const runWorkflow = useCallback(
		async (options?: { destinationNode?: string; source?: string }) => {
			const workflowId = workflowStore.getState().workflow.id;
			if (!workflowId) {
				throw new Error('No workflow ID available');
			}

			try {
				const executionId = await executionsStore.getState().run(workflowId);
				console.log('Workflow started with execution ID:', executionId);
				return executionId;
			} catch (error) {
				console.error('Failed to run workflow:', error);
				throw error;
			}
		},
		[executionsStore, workflowStore],
	);

	const runEntireWorkflow = useCallback(
		async (source: string = 'main') => {
			return runWorkflow({ source });
		},
		[runWorkflow],
	);

	const runWorkflowToNode = useCallback(
		async (nodeId: string) => {
			const workflowId = workflowStore.getState().workflow.id;
			if (!workflowId) throw new Error('No workflow ID available');
			try {
				agentRequestStore.clearAgentRequests(workflowId, nodeId);
				return await runWorkflow({ destinationNode: nodeId, source: 'canvas' });
			} catch (e) {
				throw e;
			}
		},
		[workflowStore, agentRequestStore, runWorkflow],
	);

	const stopCurrentExecution = useCallback(
		async (executionId?: string) => {
			const id = executionId || executionsStore.getState().activeExecution?.id;
			if (!id) {
				throw new Error('No execution ID available');
			}

			try {
				await executionsStore.getState().stop(id);
				console.log('Execution stopped:', id);
			} catch (error) {
				console.error('Failed to stop execution:', error);
				throw error;
			}
		},
		[executionsStore],
	);

	const stopWaitingForWebhook = useCallback(async () => {
		// This would typically stop a webhook waiting execution
		// For now, we'll just call stopCurrentExecution
		return stopCurrentExecution();
	}, [stopCurrentExecution]);

	return {
		runWorkflow,
		runEntireWorkflow,
		runWorkflowToNode,
		stopCurrentExecution,
		stopWaitingForWebhook,
	};
}
