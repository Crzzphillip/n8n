## src2/middlewares/list-query/index.ts

Overview: src2/middlewares/list-query/index.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { type NextFunction, type Response } from 'express';
- import type { ListQuery } from '@/requests';
- import { filterListQueryMiddleware } from './filter';
- import { paginationListQueryMiddleware } from './pagination';
- import { selectListQueryMiddleware } from './select';
- import { sortByQueryMiddleware } from './sort-by';

### Declarations

- Exports: ListQueryMiddleware, listQueryMiddleware

### Recreate

Place this file at `src2/middlewares/list-query/index.ts` and use the following source:

```ts
import { type NextFunction, type Response } from 'express';

import type { ListQuery } from '@/requests';

import { filterListQueryMiddleware } from './filter';
import { paginationListQueryMiddleware } from './pagination';
import { selectListQueryMiddleware } from './select';
import { sortByQueryMiddleware } from './sort-by';

export type ListQueryMiddleware = (
	req: ListQuery.Request,
	res: Response,
	next: NextFunction,
) => void;

/**
 * @deprecated Please create Zod validators in `@n8n/api-types` instead.
 */
export const listQueryMiddleware: ListQueryMiddleware[] = [
	filterListQueryMiddleware,
	selectListQueryMiddleware,
	paginationListQueryMiddleware,
	sortByQueryMiddleware,
];

```
