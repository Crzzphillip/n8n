import { createEventBus } from '@n8n/utils/event-bus';

export const historyBus = createEventBus();

// Event types for history events
export interface HistoryEvents {
	nodeMove: { nodeName: string; position: [number, number] };
	revertAddNode: { node: any };
	revertRemoveNode: { node: any };
	revertAddConnection: { connection: [any, any] };
	revertRemoveConnection: { connection: [any, any] };
	revertRenameNode: { currentName: string; newName: string };
	revertReplaceNodeParameters: { nodeId: string; currentProperties: any; newProperties: any };
	enableNodeToggle: { nodeName: string; isDisabled: boolean };
}