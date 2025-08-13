## src2/errors/response-errors/service-unavailable.error.ts

Overview: src2/errors/response-errors/service-unavailable.error.ts is a core component (ServiceUnavailableError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { ResponseError } from './abstract/response.error';

### Declarations

- Classes: ServiceUnavailableError
- Exports: ServiceUnavailableError

### Recreate

Place this file at `src2/errors/response-errors/service-unavailable.error.ts` and use the following source:

```ts
import { ResponseError } from './abstract/response.error';

export class ServiceUnavailableError extends ResponseError {
	constructor(message: string, errorCode = 503) {
		super(message, 503, errorCode);
	}
}

```
