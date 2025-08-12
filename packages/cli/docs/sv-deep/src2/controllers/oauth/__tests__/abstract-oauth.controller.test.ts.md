## src2/controllers/oauth/__tests__/abstract-oauth.controller.test.ts

Overview: src2/controllers/oauth/__tests__/abstract-oauth.controller.test.ts defines an HTTP controller that exposes Express routes for a focused domain.

How it works: Registered via the ControllerRegistry during server bootstrap. Each handler delegates to services and applies DTO validation, returning sanitized responses.

Why: Separation of transport and domain logic improves testability and consistency of route registration.

### Imports

- import { shouldSkipAuthOnOAuthCallback } from '../abstract-oauth.controller';

### Recreate

Place this file at `src2/controllers/oauth/__tests__/abstract-oauth.controller.test.ts` and use the following source:

```ts
import { shouldSkipAuthOnOAuthCallback } from '../abstract-oauth.controller';

describe('shouldSkipAuthOnOAuthCallback', () => {
	const originalEnv = process.env.N8N_SKIP_AUTH_ON_OAUTH_CALLBACK;

	afterEach(() => {
		// Restore original environment variable after each test
		if (originalEnv === undefined) {
			delete process.env.N8N_SKIP_AUTH_ON_OAUTH_CALLBACK;
		} else {
			process.env.N8N_SKIP_AUTH_ON_OAUTH_CALLBACK = originalEnv;
		}
	});

	describe('when N8N_SKIP_AUTH_ON_OAUTH_CALLBACK is not set', () => {
		beforeEach(() => {
			delete process.env.N8N_SKIP_AUTH_ON_OAUTH_CALLBACK;
		});

		it('should return true', () => {
			expect(shouldSkipAuthOnOAuthCallback()).toBe(true);
		});
	});

	describe('with various environment variable values', () => {
		const testCases = [
			{ value: 'true', expected: true },
			{ value: 'TRUE', expected: true },
			{ value: 'True', expected: true },
			{ value: 'false', expected: false },
			{ value: 'FALSE', expected: false },
			{ value: 'False', expected: false },
			{ value: '', expected: false },
			{ value: '1', expected: false },
			{ value: 'yes', expected: false },
			{ value: 'on', expected: false },
			{ value: 'enabled', expected: false },
			{ value: '   ', expected: false },
			{ value: ' true ', expected: false },
		] as const;

		test.each(testCases)('"%s" value should return %s', ({ value, expected }) => {
			process.env.N8N_SKIP_AUTH_ON_OAUTH_CALLBACK = value;
			expect(shouldSkipAuthOnOAuthCallback()).toBe(expected);
		});
	});
});

```
