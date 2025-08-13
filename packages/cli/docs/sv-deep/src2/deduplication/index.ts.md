## src2/deduplication/index.ts

Overview: src2/deduplication/index.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { type IDataDeduplicator } from 'n8n-workflow';
- import { DeduplicationHelper } from './deduplication-helper';

### Declarations

- Functions: getDataDeduplicationService
- Exports: getDataDeduplicationService

### Recreate

Place this file at `src2/deduplication/index.ts` and use the following source:

```ts
import { type IDataDeduplicator } from 'n8n-workflow';

import { DeduplicationHelper } from './deduplication-helper';

export function getDataDeduplicationService(): IDataDeduplicator {
	return new DeduplicationHelper();
}

```
