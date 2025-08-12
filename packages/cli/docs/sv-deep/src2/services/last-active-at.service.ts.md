## src2/services/last-active-at.service.ts

Overview: src2/services/last-active-at.service.ts provides a service (LastActiveAtService) encapsulating domain logic and integrations.

How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.

Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.

### Imports

- import { Logger } from '@n8n/backend-common';
- import type { AuthenticatedRequest } from '@n8n/db';
- import { UserRepository } from '@n8n/db';
- import { Service } from '@n8n/di';
- import type { NextFunction, Response } from 'express';
- import { DateTime } from 'luxon';

### Declarations

- Classes: LastActiveAtService
- Exports: LastActiveAtService

### Recreate

Place this file at `src2/services/last-active-at.service.ts` and use the following source:

```ts
import { Logger } from '@n8n/backend-common';
import type { AuthenticatedRequest } from '@n8n/db';
import { UserRepository } from '@n8n/db';
import { Service } from '@n8n/di';
import type { NextFunction, Response } from 'express';
import { DateTime } from 'luxon';

@Service()
export class LastActiveAtService {
	private readonly lastActiveCache = new Map<string, string>();

	constructor(
		private readonly userRepository: UserRepository,
		private readonly logger: Logger,
	) {}

	async middleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
		if (req.user) {
			this.updateLastActiveIfStale(req.user.id).catch((error: unknown) => {
				this.logger.error('Failed to update last active timestamp', { error });
			});
			next();
		} else {
			res.status(401).json({ status: 'error', message: 'Unauthorized' });
		}
	}

	async updateLastActiveIfStale(userId: string) {
		const now = DateTime.now().startOf('day');
		const dateNow = now.toISODate();
		const last = this.lastActiveCache.get(userId);

		// Update if date changed (or not set)
		if (!last || last !== dateNow) {
			await this.userRepository
				.createQueryBuilder()
				.update()
				.set({ lastActiveAt: now.toJSDate() })
				.where('id = :id', { id: userId })
				.execute();

			this.lastActiveCache.set(userId, dateNow);
		}
	}
}

```
