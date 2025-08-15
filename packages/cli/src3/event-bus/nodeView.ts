import { createEventBus } from '@n8n/utils/event-bus';
import type { IDataObject } from '../types/Interface';

export interface NodeViewEventBusEvents {
	/** Command to create a new workflow */
	newWorkflow: undefined;

	/** Command to open the chat */
	openChat: undefined;

	/** Command to import a workflow from given data */
	importWorkflowData: IDataObject;

	/** Command to import a workflow from given URL */
	importWorkflowUrl: IDataObject;

	'runWorkflowButton:mouseenter': undefined;
	'runWorkflowButton:mouseleave': undefined;

	/** Command to tidy up the canvas */
	tidyUp: undefined;
}

export const nodeViewEventBus = createEventBus<NodeViewEventBusEvents>();
