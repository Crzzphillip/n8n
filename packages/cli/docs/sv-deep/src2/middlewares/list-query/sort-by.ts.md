## src2/middlewares/list-query/sort-by.ts

Overview: src2/middlewares/list-query/sort-by.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { plainToInstance } from 'class-transformer';
- import { validateSync } from 'class-validator';
- import type { RequestHandler } from 'express';
- import { UnexpectedError } from 'n8n-workflow';
- import type { ListQuery } from '@/requests';
- import * as ResponseHelper from '@/response-helper';
- import { toError } from '@/utils';
- import { WorkflowSorting } from './dtos/workflow.sort-by.dto';

### Declarations

- Exports: sortByQueryMiddleware

### Recreate

Place this file at `src2/middlewares/list-query/sort-by.ts` and use the following source:

```ts
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import type { RequestHandler } from 'express';
import { UnexpectedError } from 'n8n-workflow';

import type { ListQuery } from '@/requests';
import * as ResponseHelper from '@/response-helper';
import { toError } from '@/utils';

import { WorkflowSorting } from './dtos/workflow.sort-by.dto';

export const sortByQueryMiddleware: RequestHandler = (req: ListQuery.Request, res, next) => {
	const { sortBy } = req.query;

	if (!sortBy) return next();

	let SortBy;

	try {
		if (req.baseUrl.endsWith('workflows')) {
			SortBy = WorkflowSorting;
		} else {
			return next();
		}

		const validationResponse = validateSync(plainToInstance(SortBy, { sortBy }));

		if (validationResponse.length) {
			const validationError = validationResponse[0];
			throw new UnexpectedError(validationError.constraints?.workflowSortBy ?? '');
		}

		req.listQueryOptions = { ...req.listQueryOptions, sortBy };

		next();
	} catch (maybeError) {
		ResponseHelper.sendErrorResponse(res, toError(maybeError));
	}
};

```
