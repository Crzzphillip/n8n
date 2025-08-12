## src2/environments.ee/source-control/types/exportable-tags.ts

Overview: src2/environments.ee/source-control/types/exportable-tags.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { TagEntity, WorkflowTagMapping } from '@n8n/db';

### Declarations

- Exports: ExportableTags

### Recreate

Place this file at `src2/environments.ee/source-control/types/exportable-tags.ts` and use the following source:

```ts
import type { TagEntity, WorkflowTagMapping } from '@n8n/db';

export type ExportableTags = { tags: TagEntity[]; mappings: WorkflowTagMapping[] };

```
