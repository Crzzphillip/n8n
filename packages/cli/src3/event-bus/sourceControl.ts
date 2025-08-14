import { createEventBus } from '@n8n/utils/event-bus';

export const sourceControlEventBus = createEventBus();

// Event types for source control events
export interface SourceControlEvents {
	pull: void;
	push: void;
	commit: { message: string };
	branchChanged: { branchName: string };
	repositoryChanged: { repositoryUrl: string };
}