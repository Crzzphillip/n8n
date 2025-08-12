## src2/errors/response-errors/__tests__/webhook-not-found.error.test.ts

Overview: src2/errors/response-errors/__tests__/webhook-not-found.error.test.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { webhookNotFoundErrorMessage } from '@/errors/response-errors/webhook-not-found.error';

### Recreate

Place this file at `src2/errors/response-errors/__tests__/webhook-not-found.error.test.ts` and use the following source:

```ts
import { webhookNotFoundErrorMessage } from '@/errors/response-errors/webhook-not-found.error';

describe('utils test webhookNotFoundErrorMessage ', () => {
	it('should return a message with path and method', () => {
		const message = webhookNotFoundErrorMessage({ path: 'webhook12345', httpMethod: 'GET' });

		expect(message).toEqual('The requested webhook "GET webhook12345" is not registered.');
	});
	it('should return a message with path', () => {
		const message = webhookNotFoundErrorMessage({ path: 'webhook12345' });

		expect(message).toEqual('The requested webhook "webhook12345" is not registered.');
	});
	it('should return a message with method with tip', () => {
		const message = webhookNotFoundErrorMessage({
			path: 'webhook12345',
			httpMethod: 'POST',
			webhookMethods: ['GET', 'PUT'],
		});

		expect(message).toEqual(
			'This webhook is not registered for POST requests. Did you mean to make a GET or PUT request?',
		);
	});
	it('should return a message with method with tip', () => {
		const message = webhookNotFoundErrorMessage({
			path: 'webhook12345',
			httpMethod: 'POST',
			webhookMethods: ['PUT'],
		});

		expect(message).toEqual(
			'This webhook is not registered for POST requests. Did you mean to make a PUT request?',
		);
	});
	it('should return a message with method with tip', () => {
		const message = webhookNotFoundErrorMessage({
			path: 'webhook12345',
			httpMethod: 'POST',
			webhookMethods: ['GET', 'PUT', 'DELETE'],
		});

		expect(message).toEqual(
			'This webhook is not registered for POST requests. Did you mean to make a GET, PUT or DELETE request?',
		);
	});
});

```
