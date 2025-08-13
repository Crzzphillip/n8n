## src2/errors/non-json-body.error.ts

Overview: src2/errors/non-json-body.error.ts is a core component (NonJsonBodyError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UserError } from 'n8n-workflow';

### Declarations

- Classes: NonJsonBodyError
- Exports: NonJsonBodyError

### Recreate

Place this file at `src2/errors/non-json-body.error.ts` and use the following source:

```ts
import { UserError } from 'n8n-workflow';

export class NonJsonBodyError extends UserError {
	constructor() {
		super('Body must be valid JSON. Please make sure `content-type` is `application/json`.');
	}
}

```
