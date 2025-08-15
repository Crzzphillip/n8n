import { useCallback } from 'react';
import { useNodeTypesStore } from '../stores/nodeTypes';
import type { INodeUi } from '../types/Interface';

export function useNodeHelpers() {
	const nodeTypesStore = useNodeTypesStore();

	const getNodeType = useCallback(
		(type: string, version?: number) => {
			return nodeTypesStore.getState().getNodeType(type, version);
		},
		[nodeTypesStore],
	);

	const isTriggerNode = useCallback(
		(type: string) => {
			return nodeTypesStore.getState().isTriggerNode(type);
		},
		[nodeTypesStore],
	);

	const getNodeInputs = useCallback(
		(node: INodeUi) => {
			const nodeType = getNodeType(node.type, node.typeVersion);
			return nodeType?.inputs || [];
		},
		[getNodeType],
	);

	const getNodeOutputs = useCallback(
		(node: INodeUi) => {
			const nodeType = getNodeType(node.type, node.typeVersion);
			return nodeType?.outputs || [];
		},
		[getNodeType],
	);

	const getNodeProperties = useCallback(
		(node: INodeUi) => {
			const nodeType = getNodeType(node.type, node.typeVersion);
			return nodeType?.properties || {};
		},
		[getNodeType],
	);

	const getNodeCredentials = useCallback(
		(node: INodeUi) => {
			const nodeType = getNodeType(node.type, node.typeVersion);
			return nodeType?.credentials || [];
		},
		[getNodeType],
	);

	const validateNode = useCallback(
		(node: INodeUi) => {
			const nodeType = getNodeType(node.type, node.typeVersion);
			if (!nodeType) {
				return { valid: false, error: 'Node type not found' };
			}

			// Basic validation - in a real implementation, this would be more comprehensive
			if (!node.name || node.name.trim() === '') {
				return { valid: false, error: 'Node name is required' };
			}

			return { valid: true };
		},
		[getNodeType],
	);

	const updateNodesInputIssues = useCallback(() => {
		// TODO: implement validations
	}, []);
	const updateNodesCredentialsIssues = useCallback(() => {
		// TODO: implement validations
	}, []);
	const updateNodesParameterIssues = useCallback(() => {
		// TODO: implement validations
	}, []);

	return {
		getNodeType,
		isTriggerNode,
		getNodeInputs,
		getNodeOutputs,
		getNodeProperties,
		getNodeCredentials,
		validateNode,
		updateNodesInputIssues,
		updateNodesCredentialsIssues,
		updateNodesParameterIssues,
	};
}
