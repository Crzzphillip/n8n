import { useCallback } from 'react';
import { useExecutionsStore } from '../stores/executions';

export function useExecutionDebugging() {
	const executionsStore = useExecutionsStore();

	const applyExecutionData = useCallback((executionId: string, data: any) => {
		// In a real implementation, this would apply execution data for debugging
		console.log('Applying execution data:', executionId, data);
		
		// This would typically update the execution store with debug data
		executionsStore.getState().setActiveExecution({
			id: executionId,
			status: 'running',
			data,
		});
	}, [executionsStore]);

	const debugExecution = useCallback(async (executionId: string) => {
		try {
			const execution = await executionsStore.getState().fetchExecution(executionId);
			// Apply debug data
			applyExecutionData(executionId, execution);
		} catch (error) {
			console.error('Failed to debug execution:', error);
		}
	}, [executionsStore, applyExecutionData]);

	return {
		applyExecutionData,
		debugExecution,
	};
}