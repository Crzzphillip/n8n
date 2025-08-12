## src2/environments.ee/source-control/types/exportable-workflow.ts

Overview: src2/environments.ee/source-control/types/exportable-workflow.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { INode, IConnections, IWorkflowSettings } from 'n8n-workflow';
- import type { RemoteResourceOwner } from './resource-owner';

### Declarations

- Exports: ExportableWorkflow

### Recreate

Place this file at `src2/environments.ee/source-control/types/exportable-workflow.ts` and use the following source:

```ts
import type { INode, IConnections, IWorkflowSettings } from 'n8n-workflow';

import type { RemoteResourceOwner } from './resource-owner';

export interface ExportableWorkflow {
	id: string;
	name: string;
	nodes: INode[];
	connections: IConnections;
	settings?: IWorkflowSettings;
	triggerCount: number;
	versionId?: string;
	owner: RemoteResourceOwner;
	parentFolderId: string | null;
	isArchived: boolean;
}

```
