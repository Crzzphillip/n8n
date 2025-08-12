## src2/middlewares/list-query/pagination.ts

Overview: src2/middlewares/list-query/pagination.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { RequestHandler } from 'express';
- import { UnexpectedError } from 'n8n-workflow';
- import type { ListQuery } from '@/requests';
- import * as ResponseHelper from '@/response-helper';
- import { toError } from '@/utils';
- import { Pagination } from './dtos/pagination.dto';

### Declarations

- Exports: paginationListQueryMiddleware

### Recreate

Place this file at `src2/middlewares/list-query/pagination.ts` and use the following source:

```ts
import type { RequestHandler } from 'express';
import { UnexpectedError } from 'n8n-workflow';

import type { ListQuery } from '@/requests';
import * as ResponseHelper from '@/response-helper';
import { toError } from '@/utils';

import { Pagination } from './dtos/pagination.dto';

export const paginationListQueryMiddleware: RequestHandler = (
	req: ListQuery.Request,
	res,
	next,
) => {
	const { take: rawTake, skip: rawSkip = '0' } = req.query;

	try {
		if (!rawTake && req.query.skip) {
			throw new UnexpectedError('Please specify `take` when using `skip`');
		}

		if (!rawTake) return next();

		const { take, skip } = Pagination.fromString(rawTake, rawSkip);

		req.listQueryOptions = { ...req.listQueryOptions, skip, take };

		next();
	} catch (maybeError) {
		ResponseHelper.sendErrorResponse(res, toError(maybeError));
	}
};

```
