import type { IConnection } from 'n8n-workflow';

export interface CanvasConnectionHandle {
	mode: 'inputs' | 'outputs';
	type: string;
	index: number;
}

export function createCanvasConnectionHandleString(handle: CanvasConnectionHandle): string {
	return `${handle.mode}-${handle.type}-${handle.index}`;
}

export function parseCanvasConnectionHandleString(handleString: string): CanvasConnectionHandle {
	const [mode, type, indexStr] = handleString.split('-');
	return {
		mode: mode as 'inputs' | 'outputs',
		type,
		index: parseInt(indexStr, 10),
	};
}

export function mapLegacyConnectionToCanvasConnection(connection: IConnection): CanvasConnectionHandle {
	return {
		mode: 'outputs',
		type: connection.type || 'main',
		index: connection.index || 0,
	};
}

export function mapCanvasConnectionToLegacyConnection(handle: CanvasConnectionHandle): IConnection {
	return {
		type: handle.type,
		index: handle.index,
	};
}

export function mapLegacyConnectionsToCanvasConnections(connections: Record<string, IConnection[]>): Record<string, CanvasConnectionHandle[]> {
	const result: Record<string, CanvasConnectionHandle[]> = {};
	
	for (const [nodeName, nodeConnections] of Object.entries(connections)) {
		result[nodeName] = nodeConnections.map(mapLegacyConnectionToCanvasConnection);
	}
	
	return result;
}