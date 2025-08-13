## src2/middlewares/list-query/filter.ts

Overview: src2/middlewares/list-query/filter.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { NextFunction, Response } from 'express';
- import type { ListQuery } from '@/requests';
- import * as ResponseHelper from '@/response-helper';
- import { toError } from '@/utils';
- import { CredentialsFilter } from './dtos/credentials.filter.dto';
- import { UserFilter } from './dtos/user.filter.dto';
- import { WorkflowFilter } from './dtos/workflow.filter.dto';

### Declarations

- Exports: filterListQueryMiddleware

### Recreate

Place this file at `src2/middlewares/list-query/filter.ts` and use the following source:

```ts
import type { NextFunction, Response } from 'express';

import type { ListQuery } from '@/requests';
import * as ResponseHelper from '@/response-helper';
import { toError } from '@/utils';

import { CredentialsFilter } from './dtos/credentials.filter.dto';
import { UserFilter } from './dtos/user.filter.dto';
import { WorkflowFilter } from './dtos/workflow.filter.dto';

export const filterListQueryMiddleware = async (
	req: ListQuery.Request,
	res: Response,
	next: NextFunction,
) => {
	const { filter: rawFilter } = req.query;

	if (!rawFilter) return next();

	let Filter;

	if (req.baseUrl.endsWith('workflows')) {
		Filter = WorkflowFilter;
	} else if (req.baseUrl.endsWith('credentials')) {
		Filter = CredentialsFilter;
	} else if (req.baseUrl.endsWith('users')) {
		Filter = UserFilter;
	} else {
		return next();
	}

	try {
		const filter = await Filter.fromString(rawFilter);

		if (Object.keys(filter).length === 0) return next();

		req.listQueryOptions = { ...req.listQueryOptions, filter };

		next();
	} catch (maybeError) {
		ResponseHelper.sendErrorResponse(res, toError(maybeError));
	}
};

```
