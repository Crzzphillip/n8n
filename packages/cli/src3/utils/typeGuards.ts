import type { IConnection } from 'n8n-workflow';

export function isValidNodeConnectionType(type: string): boolean {
	const validTypes = ['main', 'ai', 'webhook', 'trigger'];
	return validTypes.includes(type);
}

export function isVueFlowConnection(connection: any): connection is { source: string; target: string; sourceHandle?: string; targetHandle?: string } {
	return connection && typeof connection.source === 'string' && typeof connection.target === 'string';
}

export function isValidConnection(connection: IConnection): boolean {
	return connection && 
		   typeof connection.node === 'string' && 
		   typeof connection.type === 'string' && 
		   typeof connection.index === 'number';
}