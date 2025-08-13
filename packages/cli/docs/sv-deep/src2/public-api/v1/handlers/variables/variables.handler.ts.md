## src2/public-api/v1/handlers/variables/variables.handler.ts

Overview: src2/public-api/v1/handlers/variables/variables.handler.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { VariablesRepository } from '@n8n/db';
- import { Container } from '@n8n/di';
- import type { Response } from 'express';
- import { VariablesController } from '@/environments.ee/variables/variables.controller.ee';
- import type { PaginatedRequest } from '@/public-api/types';
- import type { VariablesRequest } from '@/requests';
- import {
- import { encodeNextCursor } from '../../shared/services/pagination.service';

### Recreate

Place this file at `src2/public-api/v1/handlers/variables/variables.handler.ts` and use the following source:

```ts
import { VariablesRepository } from '@n8n/db';
import { Container } from '@n8n/di';
import type { Response } from 'express';

import { VariablesController } from '@/environments.ee/variables/variables.controller.ee';
import type { PaginatedRequest } from '@/public-api/types';
import type { VariablesRequest } from '@/requests';

import {
	apiKeyHasScopeWithGlobalScopeFallback,
	isLicensed,
	validCursor,
} from '../../shared/middlewares/global.middleware';
import { encodeNextCursor } from '../../shared/services/pagination.service';

type Create = VariablesRequest.Create;
type Delete = VariablesRequest.Delete;
type GetAll = PaginatedRequest;

export = {
	createVariable: [
		isLicensed('feat:variables'),
		apiKeyHasScopeWithGlobalScopeFallback({ scope: 'variable:create' }),
		async (req: Create, res: Response) => {
			await Container.get(VariablesController).createVariable(req);

			res.status(201).send();
		},
	],
	updateVariable: [
		isLicensed('feat:variables'),
		apiKeyHasScopeWithGlobalScopeFallback({ scope: 'variable:update' }),
		async (req: VariablesRequest.Update, res: Response) => {
			await Container.get(VariablesController).updateVariable(req);

			res.status(204).send();
		},
	],
	deleteVariable: [
		isLicensed('feat:variables'),
		apiKeyHasScopeWithGlobalScopeFallback({ scope: 'variable:delete' }),
		async (req: Delete, res: Response) => {
			await Container.get(VariablesController).deleteVariable(req);

			res.status(204).send();
		},
	],
	getVariables: [
		isLicensed('feat:variables'),
		apiKeyHasScopeWithGlobalScopeFallback({ scope: 'variable:list' }),
		validCursor,
		async (req: GetAll, res: Response) => {
			const { offset = 0, limit = 100 } = req.query;

			const [variables, count] = await Container.get(VariablesRepository).findAndCount({
				skip: offset,
				take: limit,
			});

			return res.json({
				data: variables,
				nextCursor: encodeNextCursor({
					offset,
					limit,
					numberOfTotalRecords: count,
				}),
			});
		},
	],
};

```
