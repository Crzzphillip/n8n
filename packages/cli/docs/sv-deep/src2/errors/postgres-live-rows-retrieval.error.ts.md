## src2/errors/postgres-live-rows-retrieval.error.ts

Overview: src2/errors/postgres-live-rows-retrieval.error.ts is a core component (PostgresLiveRowsRetrievalError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: PostgresLiveRowsRetrievalError
- Exports: PostgresLiveRowsRetrievalError

### Recreate

Place this file at `src2/errors/postgres-live-rows-retrieval.error.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

export class PostgresLiveRowsRetrievalError extends UnexpectedError {
	constructor(rows: unknown) {
		super('Failed to retrieve live execution rows in Postgres', { extra: { rows } });
	}
}

```
