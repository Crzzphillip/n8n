import { createEventBus } from '@n8n/utils/event-bus';

export const canvasEventBus = createEventBus();

// Event types for canvas events
export interface CanvasEvents {
	fitView: void;
	'nodes:select': { ids: string[] };
	tidyUp: { source: string; nodeIdsFilter?: string[] };
	'saved:workflow': void;
	'open:execution': any;
}