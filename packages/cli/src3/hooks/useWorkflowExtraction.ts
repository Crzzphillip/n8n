import { useCallback } from 'react';
import { useWorkflowStore } from '../stores/workflows';

export function useWorkflowExtraction() {
	const workflowStore = useWorkflowStore();

	const extractWorkflow = useCallback((nodeIds: string[]) => {
		const workflow = workflowStore.getState().workflow;
		
		// Extract nodes and their connections
		const extractedNodes = workflow.nodes.filter(node => nodeIds.includes(node.id));
		const extractedConnections: Record<string, any[]> = {};
		
		// Extract connections between the selected nodes
		for (const [sourceNode, connections] of Object.entries(workflow.connections)) {
			const sourceNodeObj = workflow.nodes.find(n => n.name === sourceNode);
			if (sourceNodeObj && nodeIds.includes(sourceNodeObj.id)) {
				const filteredConnections = connections.filter(connection => {
					const targetNodeObj = workflow.nodes.find(n => n.name === connection.node);
					return targetNodeObj && nodeIds.includes(targetNodeObj.id);
				});
				if (filteredConnections.length > 0) {
					extractedConnections[sourceNode] = filteredConnections;
				}
			}
		}
		
		return {
			nodes: extractedNodes,
			connections: extractedConnections,
		};
	}, [workflowStore]);

	return {
		extractWorkflow,
	};
}