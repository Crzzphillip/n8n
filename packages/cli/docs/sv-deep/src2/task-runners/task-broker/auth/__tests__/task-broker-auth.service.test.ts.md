## src2/task-runners/task-broker/auth/__tests__/task-broker-auth.service.test.ts

Overview: src2/task-runners/task-broker/auth/__tests__/task-broker-auth.service.test.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { mockInstance } from '@n8n/backend-test-utils';
- import { GlobalConfig } from '@n8n/config';
- import { sleep } from 'n8n-workflow';
- import config from '@/config';
- import { CacheService } from '@/services/cache/cache.service';
- import { retryUntil } from '@test-integration/retry-until';
- import { TaskBrokerAuthService } from '../task-broker-auth.service';

### Recreate

Place this file at `src2/task-runners/task-broker/auth/__tests__/task-broker-auth.service.test.ts` and use the following source:

```ts
import { mockInstance } from '@n8n/backend-test-utils';
import { GlobalConfig } from '@n8n/config';
import { sleep } from 'n8n-workflow';

import config from '@/config';
import { CacheService } from '@/services/cache/cache.service';
import { retryUntil } from '@test-integration/retry-until';

import { TaskBrokerAuthService } from '../task-broker-auth.service';

describe('TaskBrokerAuthService', () => {
	config.set('taskRunners.authToken', 'random-secret');

	const globalConfig = mockInstance(GlobalConfig, {
		cache: {
			backend: 'memory',
			memory: {
				maxSize: 1024,
				ttl: 9999,
			},
		},
		taskRunners: {
			authToken: 'random-secret',
		},
	});
	const TTL = 100;
	const cacheService = new CacheService(globalConfig);
	const authService = new TaskBrokerAuthService(globalConfig, cacheService, TTL);

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('isValidAuthToken', () => {
		it('should be valid for the configured token', () => {
			expect(authService.isValidAuthToken('random-secret')).toBe(true);
		});

		it('should be invalid for anything else', () => {
			expect(authService.isValidAuthToken('!random-secret')).toBe(false);
		});
	});

	describe('createGrantToken', () => {
		it('should generate a random token', async () => {
			expect(typeof (await authService.createGrantToken())).toBe('string');
		});

		it('should store the generated token in cache', async () => {
			// Arrange
			const cacheSetSpy = jest.spyOn(cacheService, 'set');

			// Act
			const token = await authService.createGrantToken();

			// Assert
			expect(cacheSetSpy).toHaveBeenCalledWith(`grant-token:${token}`, '1', TTL);
		});
	});

	describe('tryConsumeGrantToken', () => {
		it('should return false for an invalid grant token', async () => {
			expect(await authService.tryConsumeGrantToken('random-secret')).toBe(false);
		});

		it('should return true for a valid grant token', async () => {
			// Arrange
			const grantToken = await authService.createGrantToken();

			// Act
			expect(await authService.tryConsumeGrantToken(grantToken)).toBe(true);
		});

		it('should return false for a already used grant token', async () => {
			// Arrange
			const grantToken = await authService.createGrantToken();

			// Act
			expect(await authService.tryConsumeGrantToken(grantToken)).toBe(true);
			expect(await authService.tryConsumeGrantToken(grantToken)).toBe(false);
		});

		it('should return false for an expired grant token', async () => {
			// Arrange
			const grantToken = await authService.createGrantToken();

			// Act
			await sleep(TTL + 1);

			await retryUntil(async () =>
				expect(await authService.tryConsumeGrantToken(grantToken)).toBe(false),
			);
		});
	});
});

```
