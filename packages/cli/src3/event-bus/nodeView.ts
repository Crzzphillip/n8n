import { createEventBus } from '@n8n/utils/event-bus';

export const nodeViewEventBus = createEventBus();

// Event types for node view events
export interface NodeViewEvents {
	importWorkflowData: { data: any; regenerateIds?: boolean; tidyUp?: boolean; nodesIdsToTidyUp?: string[] };
	importWorkflowUrl: { url: string };
	openChat: void;
	'runWorkflowButton:mouseenter': void;
	'runWorkflowButton:mouseleave': void;
}