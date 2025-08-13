import { createEventBus } from '@n8n/utils/event-bus';

export const canvasEventBus = createEventBus();

// Event types for canvas events
export interface CanvasEvents {
	fitView: void;
	'nodes:select': { ids: string[] };
	tidyUp: { source: string; nodeIdsFilter?: string[] };
	'saved:workflow': void;
	'open:execution': any;
	'toggle:focus-panel': void;
	'run:node': { nodeId: string };
	'update:node:inputs': { nodeId: string };
	'update:node:outputs': { nodeId: string };
	'create:sticky': void;
	'create:node': { source: string };
	'click:connection:add': { source: string; target?: string };
	'open:subworkflow': { nodeId: string };
	'logs:open': void;
	'logs:close': void;
	'logs:input-open': void;
	'logs:output-open': void;
}
