## src2/workflows/workflow.request.ts

Overview: src2/workflows/workflow.request.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { AuthenticatedRequest } from '@n8n/db';
- import type {
- import type { ListQuery } from '@/requests';

### Recreate

Place this file at `src2/workflows/workflow.request.ts` and use the following source:

```ts
import type { AuthenticatedRequest } from '@n8n/db';
import type {
	INode,
	IConnections,
	IWorkflowSettings,
	IRunData,
	StartNodeData,
	ITaskData,
	IWorkflowBase,
	AiAgentRequest,
} from 'n8n-workflow';

import type { ListQuery } from '@/requests';

export declare namespace WorkflowRequest {
	type CreateUpdatePayload = Partial<{
		id: string; // deleted if sent
		name: string;
		nodes: INode[];
		connections: IConnections;
		settings: IWorkflowSettings;
		active: boolean;
		tags: string[];
		hash: string;
		meta: Record<string, unknown>;
		projectId: string;
		parentFolderId?: string;
	}>;

	type ManualRunPayload = {
		workflowData: IWorkflowBase;
		runData?: IRunData;
		startNodes?: StartNodeData[];
		destinationNode?: string;
		dirtyNodeNames?: string[];
		triggerToStartFrom?: {
			name: string;
			data?: ITaskData;
		};
		agentRequest?: AiAgentRequest;
	};

	type Create = AuthenticatedRequest<{}, {}, CreateUpdatePayload>;

	type Get = AuthenticatedRequest<{ workflowId: string }>;

	type GetMany = AuthenticatedRequest<
		{},
		{},
		{},
		ListQuery.Params & {
			includeScopes?: string;
			includeFolders?: string;
			onlySharedWithMe?: string;
		}
	> & {
		listQueryOptions: ListQuery.Options;
	};

	type Update = AuthenticatedRequest<
		{ workflowId: string },
		{},
		CreateUpdatePayload,
		{ forceSave?: string }
	>;

	type NewName = AuthenticatedRequest<{}, {}, {}, { name?: string }>;

	type ManualRun = AuthenticatedRequest<{ workflowId: string }, {}, ManualRunPayload, {}>;

	type Share = AuthenticatedRequest<{ workflowId: string }, {}, { shareWithIds: string[] }>;
}

```
