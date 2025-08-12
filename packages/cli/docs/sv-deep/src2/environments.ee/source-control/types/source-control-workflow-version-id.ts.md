## src2/environments.ee/source-control/types/source-control-workflow-version-id.ts

Overview: src2/environments.ee/source-control/types/source-control-workflow-version-id.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { StatusResourceOwner } from './resource-owner';

### Declarations

- Exports: SourceControlWorkflowVersionId

### Recreate

Place this file at `src2/environments.ee/source-control/types/source-control-workflow-version-id.ts` and use the following source:

```ts
import type { StatusResourceOwner } from './resource-owner';

export interface SourceControlWorkflowVersionId {
	id: string;
	versionId: string;
	filename: string;
	name?: string;
	localId?: string;
	remoteId?: string;
	parentFolderId: string | null;
	updatedAt?: string;
	owner?: StatusResourceOwner;
}

```
