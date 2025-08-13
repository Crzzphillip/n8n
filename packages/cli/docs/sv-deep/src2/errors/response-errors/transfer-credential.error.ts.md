## src2/errors/response-errors/transfer-credential.error.ts

Overview: src2/errors/response-errors/transfer-credential.error.ts is a core component (TransferCredentialError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { ResponseError } from './abstract/response.error';

### Declarations

- Classes: TransferCredentialError
- Exports: TransferCredentialError

### Recreate

Place this file at `src2/errors/response-errors/transfer-credential.error.ts` and use the following source:

```ts
import { ResponseError } from './abstract/response.error';

export class TransferCredentialError extends ResponseError {
	constructor(message: string) {
		super(message, 400, 400);
	}
}

```
