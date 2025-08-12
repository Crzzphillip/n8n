## src2/middlewares/list-query/dtos/pagination.dto.ts

Overview: src2/middlewares/list-query/dtos/pagination.dto.ts is a core component (Pagination) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { UnexpectedError } from 'n8n-workflow';
- import { isIntegerString } from '@/utils';

### Declarations

- Classes: Pagination
- Exports: Pagination

### Recreate

Place this file at `src2/middlewares/list-query/dtos/pagination.dto.ts` and use the following source:

```ts
import { UnexpectedError } from 'n8n-workflow';

import { isIntegerString } from '@/utils';

export class Pagination {
	static fromString(rawTake: string, rawSkip: string) {
		if (!isIntegerString(rawTake)) {
			throw new UnexpectedError('Parameter take is not an integer string');
		}

		if (!isIntegerString(rawSkip)) {
			throw new UnexpectedError('Parameter skip is not an integer string');
		}

		const [take, skip] = [rawTake, rawSkip].map((o) => parseInt(o, 10));

		const MAX_ITEMS_PER_PAGE = 50;

		return {
			take: Math.min(take, MAX_ITEMS_PER_PAGE),
			skip,
		};
	}
}

```
