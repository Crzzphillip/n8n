## src2/environments.ee/source-control/types/import-result.ts

Overview: src2/environments.ee/source-control/types/import-result.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { TagEntity, WorkflowTagMapping } from '@n8n/db';

### Declarations

- Exports: ImportResult

### Recreate

Place this file at `src2/environments.ee/source-control/types/import-result.ts` and use the following source:

```ts
import type { TagEntity, WorkflowTagMapping } from '@n8n/db';

export interface ImportResult {
	workflows: Array<{
		id: string;
		name: string;
	}>;
	credentials: Array<{ id: string; name: string; type: string }>;
	variables: { imported: string[] };
	tags: { tags: TagEntity[]; mappings: WorkflowTagMapping[] };
	removedFiles?: string[];
}

```
