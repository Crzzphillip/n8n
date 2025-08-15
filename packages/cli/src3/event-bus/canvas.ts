import { createEventBus } from '@n8n/utils/event-bus';
import type { IExecutionResponse } from '../types/Interface';

export type CanvasNodeEventBusEvents = {
	'update:sticky:color': { color?: number } | undefined;
	'update:node:activated': undefined;
	'update:node:class': { className: string; add?: boolean };
};

export interface CanvasEventBusEvents {
	fitView: undefined;
	'saved:workflow': undefined;
	'open:execution': IExecutionResponse;
	'nodes:select': { ids: string[]; panIntoView?: boolean };
	'nodes:action': {
		ids: string[];
		action: keyof CanvasNodeEventBusEvents;
		payload?: CanvasNodeEventBusEvents[keyof CanvasNodeEventBusEvents];
	};
	tidyUp: { source: string; nodeIdsFilter?: string[] };

	// Editor extensions beyond Vue parity
	'toggle:focus-panel': undefined;
	'run:node': { nodeId: string };
	'update:node:inputs': { nodeId: string };
	'update:node:outputs': { nodeId: string };
	'create:sticky': undefined;
	'create:node': { source: string };
	'click:connection:add': { source: string; target?: string };
	'open:subworkflow': { nodeId: string };
	'logs:open': undefined;
	'logs:close': undefined;
	'logs:input-open': undefined;
	'logs:output-open': undefined;
	'copy:nodes': string[];
	'delete:nodes': string[];
	'duplicate:nodes': string[];
	'update:nodes:pin': string[];
	'update:node:name': string;
	'extract-workflow': string[];
	'selection:end': { x: number; y: number };
}

export const canvasEventBus = createEventBus<CanvasEventBusEvents>();
