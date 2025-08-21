import { useCallback } from 'react';
import { useWorkflowStore } from '../stores/workflows';
import { useHistoryStore } from '../stores/history';
import { useNDVStore } from '../stores/ndv';
import { useCanvasStore } from '../stores/canvas';
import { useExecutionsStore } from '../stores/executions';
import { useLogsStore } from '../stores/logs';
import type {
	INodeUi,
	XYPosition,
	CanvasNodeMoveEvent,
	AddedNodesAndConnections,
	CanvasConnectionCreateData,
	ViewportBoundaries,
} from '../types/Interface';
import type { IConnection } from 'n8n-workflow';
import {
	MoveNodeCommand,
	AddNodeCommand,
	RemoveNodeCommand,
	AddConnectionCommand,
	RemoveConnectionCommand,
	RenameNodeCommand,
	ReplaceNodeParametersCommand,
	EnableNodeToggleCommand,
} from '../models/history';

export function useCanvasOperations() {
	const workflowStore = useWorkflowStore();
	const historyStore = useHistoryStore();
	const ndvStore = useNDVStore();
	const canvasStore = useCanvasStore();
	const executionsStore = useExecutionsStore();

	const updateNodePosition = useCallback(
		(id: string, position: { x: number; y: number }, options?: { trackHistory?: boolean }) => {
			const node = workflowStore.getState().workflow.nodes.find((n) => n.id === id);
			if (!node) return;

			const oldPosition: XYPosition = [node.position[0], node.position[1]];
			const newPosition: XYPosition = [position.x, position.y];

			workflowStore.getState().updateNodePosition(id, newPosition);

			if (options?.trackHistory) {
				const command = new MoveNodeCommand(node.name, oldPosition, newPosition, Date.now());
				historyStore.getState().pushCommandToUndo(command);
			}
		},
		[workflowStore, historyStore],
	);

	const updateNodesPosition = useCallback(
		(events: CanvasNodeMoveEvent[], options?: { trackHistory?: boolean }) => {
			events.forEach((event) => {
				updateNodePosition(event.id, event.position, options);
			});
		},
		[updateNodePosition],
	);

	const deleteNode = useCallback(
		(id: string, options?: { trackHistory?: boolean }) => {
			const node = workflowStore.getState().workflow.nodes.find((n) => n.id === id);
			if (!node) return;

			workflowStore.getState().removeNode(id);

			if (options?.trackHistory) {
				const command = new RemoveNodeCommand(node, Date.now());
				historyStore.getState().pushCommandToUndo(command);
			}
		},
		[workflowStore, historyStore],
	);

	const deleteNodes = useCallback(
		(ids: string[]) => {
			ids.forEach((id) => deleteNode(id, { trackHistory: true }));
		},
		[deleteNode],
	);

	const addNodes = useCallback(
		async (
			nodes: Array<{ type: string; position?: XYPosition; parameters?: Record<string, any> }>,
			options?: {
				dragAndDrop?: boolean;
				position?: XYPosition;
				viewport?: ViewportBoundaries;
				trackHistory?: boolean;
				telemetry?: boolean;
			},
		) => {
			const addedNodes: INodeUi[] = [];

			for (const nodeData of nodes) {
				const node: INodeUi = {
					id: `node_${Date.now()}_${Math.random().toString(36).slice(2)}`,
					name: `Node ${workflowStore.getState().workflow.nodes.length + 1}`,
					type: nodeData.type,
					typeVersion: 1,
					position: nodeData.position || [100, 100],
					parameters: nodeData.parameters || {},
				};

				workflowStore.getState().addNode(node);
				addedNodes.push(node);

				if (options?.trackHistory) {
					const command = new AddNodeCommand(node, Date.now());
					historyStore.getState().pushCommandToUndo(command);
				}
			}

			return addedNodes;
		},
		[workflowStore, historyStore],
	);

	const createConnection = useCallback(
		(
			connection: { source: string; target: string; sourceHandle?: string; targetHandle?: string },
			options?: { trackHistory?: boolean },
		) => {
			const sourceNode = workflowStore
				.getState()
				.workflow.nodes.find((n) => n.id === connection.source);
			const targetNode = workflowStore
				.getState()
				.workflow.nodes.find((n) => n.id === connection.target);

			if (!sourceNode || !targetNode) return;

			const connectionData: [IConnection, IConnection] = [
				{ node: sourceNode.name, type: 'main', index: 0 },
				{ node: targetNode.name, type: 'main', index: 0 },
			];

			workflowStore.getState().addConnection(connectionData[0], connectionData[1]);

			if (options?.trackHistory) {
				const command = new AddConnectionCommand(connectionData, Date.now());
				historyStore.getState().pushCommandToUndo(command);
			}
		},
		[workflowStore, historyStore],
	);

	const addConnections = useCallback(
		async (connections: CanvasConnectionCreateData[], options?: { trackHistory?: boolean }) => {
			for (const c of connections) {
				await createConnection(
					{ source: c.source, target: c.target },
					{ trackHistory: options?.trackHistory },
				);
			}
		},
		[createConnection],
	);

	const deleteConnection = useCallback(
		(connection: { source: string; target: string }, options?: { trackHistory?: boolean }) => {
			const sourceNode = workflowStore
				.getState()
				.workflow.nodes.find((n) => n.id === connection.source);
			const targetNode = workflowStore
				.getState()
				.workflow.nodes.find((n) => n.id === connection.target);

			if (!sourceNode || !targetNode) return;

			const connectionData: [IConnection, IConnection] = [
				{ node: sourceNode.name, type: 'main', index: 0 },
				{ node: targetNode.name, type: 'main', index: 0 },
			];

			workflowStore.getState().removeConnection(connectionData[0], connectionData[1]);

			if (options?.trackHistory) {
				const command = new RemoveConnectionCommand(connectionData, Date.now());
				historyStore.getState().pushCommandToUndo(command);
			}
		},
		[workflowStore, historyStore],
	);

	const renameNode = useCallback(
		async (currentName: string, newName: string, options?: { trackHistory?: boolean }) => {
			const node = workflowStore.getState().workflow.nodes.find((n) => n.name === currentName);
			if (!node) return;

			workflowStore.getState().renameNode(currentName, newName);

			if (options?.trackHistory) {
				const command = new RenameNodeCommand(currentName, newName, Date.now());
				historyStore.getState().pushCommandToUndo(command);
			}
		},
		[workflowStore, historyStore],
	);

	const setNodeParameters = useCallback(
		(id: string, parameters: Record<string, unknown>) => {
			const node = workflowStore.getState().workflow.nodes.find((n) => n.id === id);
			if (!node) return;

			const currentParameters = { ...node.parameters };
			const newParameters = { ...node.parameters, ...parameters };

			workflowStore.getState().updateNodeParameters(id, newParameters);

			const command = new ReplaceNodeParametersCommand(
				id,
				currentParameters,
				newParameters,
				Date.now(),
			);
			historyStore.getState().pushCommandToUndo(command);
		},
		[workflowStore, historyStore],
	);

	const toggleNodesDisabled = useCallback(
		(ids: string[]) => {
			ids.forEach((id) => {
				const node = workflowStore.getState().workflow.nodes.find((n) => n.id === id);
				if (!node) return;

				const oldState = node.disabled || false;
				const newState = !oldState;

				workflowStore.getState().toggleNodeDisabled(id);

				const command = new EnableNodeToggleCommand(node.name, oldState, newState, Date.now());
				historyStore.getState().pushCommandToUndo(command);
			});
		},
		[workflowStore, historyStore],
	);

	const setNodeActive = useCallback(
		(id: string) => {
			const node = workflowStore.getState().workflow.nodes.find((n) => n.id === id);
			if (node) {
				ndvStore.getState().setActiveNode(node);
			}
		},
		[workflowStore, ndvStore],
	);

	const setNodeSelected = useCallback(
		(id?: string) => {
			// This would typically update the canvas selection state
			// For now, we'll just clear the NDV if no node is selected
			if (!id) {
				ndvStore.getState().setActiveNode(null);
			}
		},
		[ndvStore],
	);

	const runWorkflow = useCallback(
		async (workflowId: string, options?: { destinationNode?: string }) => {
			try {
				const executionId = await executionsStore.getState().run(workflowId);
				return executionId;
			} catch (error) {
				console.error('Failed to run workflow:', error);
				throw error;
			}
		},
		[executionsStore],
	);

	const stopCurrentExecution = useCallback(
		async (executionId: string) => {
			try {
				await executionsStore.getState().stop(executionId);
			} catch (error) {
				console.error('Failed to stop execution:', error);
				throw error;
			}
		},
		[executionsStore],
	);

	const tidyUp = useCallback(
		(event: { source: string; nodeIdsFilter?: string[] }) => {
			// Simple tidy up implementation - arrange nodes in a grid
			const nodes = workflowStore.getState().workflow.nodes;
			const filteredNodes = event.nodeIdsFilter
				? nodes.filter((n) => event.nodeIdsFilter!.includes(n.id))
				: nodes;

			filteredNodes.forEach((node, index) => {
				const row = Math.floor(index / 4);
				const col = index % 4;
				const x = 100 + col * 200;
				const y = 100 + row * 150;

				updateNodePosition(node.id, { x, y }, { trackHistory: true });
			});
		},
		[workflowStore, updateNodePosition],
	);

	const revalidateNodeInputConnections = useCallback((id: string) => {
		// no-op placeholder
	}, []);

	const revalidateNodeOutputConnections = useCallback((id: string) => {
		// no-op placeholder
	}, []);

	const startChat = useCallback((source: string = 'main') => {
		try {
			useLogsStore.getState().toggleOpen(true);
		} catch {}
	}, []);

	const tryToOpenSubworkflowInNewTab = useCallback(
		(nodeId: string): boolean => {
			const node = workflowStore.getState().workflow.nodes.find((n) => n.id === nodeId);
			if (!node) return false;
			// Heuristic: look for a parameter that points to a workflow ID
			const subId = (node as any).parameters?.workflowId || (node as any).parameters?.subWorkflowId;
			if (typeof subId === 'string' && subId.length > 0) {
				try {
					window.open(`/workflow/existing?id=${encodeURIComponent(subId)}`, '_blank');
					return true;
				} catch {
					return false;
				}
			}
			return false;
		},
		[workflowStore],
	);

	return {
		updateNodePosition,
		updateNodesPosition,
		deleteNode,
		deleteNodes,
		addNodes,
		createConnection,
		addConnections,
		deleteConnection,
		renameNode,
		setNodeParameters,
		toggleNodesDisabled,
		setNodeActive,
		setNodeSelected,
		runWorkflow,
		stopCurrentExecution,
		tidyUp,
		revalidateNodeInputConnections,
		revalidateNodeOutputConnections,
		startChat,
		tryToOpenSubworkflowInNewTab,
	};
}
