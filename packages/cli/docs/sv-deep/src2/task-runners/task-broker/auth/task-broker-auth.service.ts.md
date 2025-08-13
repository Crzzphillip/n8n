## src2/task-runners/task-broker/auth/task-broker-auth.service.ts

Overview: src2/task-runners/task-broker/auth/task-broker-auth.service.ts is a core component (TaskBrokerAuthService) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { GlobalConfig } from '@n8n/config';
- import { Time } from '@n8n/constants';
- import { Service } from '@n8n/di';
- import { randomBytes, timingSafeEqual } from 'crypto';
- import { CacheService } from '@/services/cache/cache.service';

### Declarations

- Classes: TaskBrokerAuthService
- Exports: TaskBrokerAuthService

### Recreate

Place this file at `src2/task-runners/task-broker/auth/task-broker-auth.service.ts` and use the following source:

```ts
import { GlobalConfig } from '@n8n/config';
import { Time } from '@n8n/constants';
import { Service } from '@n8n/di';
import { randomBytes, timingSafeEqual } from 'crypto';

import { CacheService } from '@/services/cache/cache.service';

const GRANT_TOKEN_TTL = 15 * Time.seconds.toMilliseconds;

@Service()
export class TaskBrokerAuthService {
	private readonly authToken = Buffer.from(this.globalConfig.taskRunners.authToken);

	constructor(
		private readonly globalConfig: GlobalConfig,
		private readonly cacheService: CacheService,
		// For unit testing purposes
		private readonly grantTokenTtl = GRANT_TOKEN_TTL,
	) {}

	isValidAuthToken(token: string) {
		const tokenBuffer = Buffer.from(token);
		if (tokenBuffer.length !== this.authToken.length) return false;

		return timingSafeEqual(tokenBuffer, this.authToken);
	}

	/**
	 * @returns grant token that can be used to establish a task runner connection
	 */
	async createGrantToken() {
		const grantToken = this.generateGrantToken();

		const key = this.cacheKeyForGrantToken(grantToken);
		await this.cacheService.set(key, '1', this.grantTokenTtl);

		return grantToken;
	}

	/**
	 * Checks if the given `grantToken` is a valid token and marks it as
	 * used.
	 */
	async tryConsumeGrantToken(grantToken: string) {
		const key = this.cacheKeyForGrantToken(grantToken);
		const consumed = await this.cacheService.get<string>(key);
		// Not found from cache --> Invalid token
		if (consumed === undefined) return false;

		await this.cacheService.delete(key);
		return true;
	}

	private generateGrantToken() {
		return randomBytes(32).toString('hex');
	}

	private cacheKeyForGrantToken(grantToken: string) {
		return `grant-token:${grantToken}`;
	}
}

```
