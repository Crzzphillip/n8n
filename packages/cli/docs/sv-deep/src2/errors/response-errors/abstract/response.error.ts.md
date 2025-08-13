## src2/errors/response-errors/abstract/response.error.ts

Overview: src2/errors/response-errors/abstract/response.error.ts is a core component (ResponseError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { BaseError } from 'n8n-workflow';

### Declarations

- Classes: ResponseError

### Recreate

Place this file at `src2/errors/response-errors/abstract/response.error.ts` and use the following source:

```ts
import { BaseError } from 'n8n-workflow';

/**
 * Special Error which allows to return also an error code and http status code
 */
export abstract class ResponseError extends BaseError {
	/**
	 * Creates an instance of ResponseError.
	 * Must be used inside a block with `ResponseHelper.send()`.
	 */
	constructor(
		message: string,
		// The HTTP status code of  response
		readonly httpStatusCode: number,
		// The error code in the response
		readonly errorCode: number = httpStatusCode,
		// The error hint the response
		readonly hint: string | undefined = undefined,
		cause?: unknown,
	) {
		super(message, { cause });
		this.name = 'ResponseError';

		if (httpStatusCode >= 400 && httpStatusCode < 500) {
			this.level = 'warning'; // client errors (4xx)
		} else if (httpStatusCode >= 502 && httpStatusCode <= 504) {
			this.level = 'info'; // transient errors (502, 503, 504)
		} else {
			this.level = 'error'; // other 5xx
		}
	}
}

```
