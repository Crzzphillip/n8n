## src2/public-api/v1/handlers/audit/audit.handler.ts

Overview: src2/public-api/v1/handlers/audit/audit.handler.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Container } from '@n8n/di';
- import type { Response } from 'express';
- import type { AuditRequest } from '@/public-api/types';
- import { apiKeyHasScopeWithGlobalScopeFallback } from '../../shared/middlewares/global.middleware';

### Recreate

Place this file at `src2/public-api/v1/handlers/audit/audit.handler.ts` and use the following source:

```ts
import { Container } from '@n8n/di';
import type { Response } from 'express';

import type { AuditRequest } from '@/public-api/types';

import { apiKeyHasScopeWithGlobalScopeFallback } from '../../shared/middlewares/global.middleware';

export = {
	generateAudit: [
		apiKeyHasScopeWithGlobalScopeFallback({ scope: 'securityAudit:generate' }),
		async (req: AuditRequest.Generate, res: Response): Promise<Response> => {
			try {
				const { SecurityAuditService } = await import('@/security-audit/security-audit.service');
				const result = await Container.get(SecurityAuditService).run(
					req.body?.additionalOptions?.categories,
					req.body?.additionalOptions?.daysAbandonedWorkflow,
				);

				return res.json(result);
			} catch (error) {
				return res.status(500).json(error);
			}
		},
	],
};

```
