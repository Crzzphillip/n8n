## src2/public-api/v1/shared/services/pagination.service.ts

Overview: src2/public-api/v1/shared/services/pagination.service.ts provides a service encapsulating domain logic and integrations.

How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.

Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.

### Imports

- import { jsonParse } from 'n8n-workflow';
- import type {

### Declarations

- Exports: decodeCursor, encodeNextCursor

### Recreate

Place this file at `src2/public-api/v1/shared/services/pagination.service.ts` and use the following source:

```ts
import { jsonParse } from 'n8n-workflow';

import type {
	CursorPagination,
	OffsetPagination,
	PaginationCursorDecoded,
	PaginationOffsetDecoded,
} from '../../../types';

export const decodeCursor = (cursor: string): PaginationOffsetDecoded | PaginationCursorDecoded => {
	return jsonParse(Buffer.from(cursor, 'base64').toString());
};

const encodeOffSetPagination = (pagination: OffsetPagination): string | null => {
	if (pagination.numberOfTotalRecords > pagination.offset + pagination.limit) {
		return Buffer.from(
			JSON.stringify({
				limit: pagination.limit,
				offset: pagination.offset + pagination.limit,
			}),
		).toString('base64');
	}
	return null;
};

const encodeCursorPagination = (pagination: CursorPagination): string | null => {
	if (pagination.numberOfNextRecords) {
		return Buffer.from(
			JSON.stringify({
				lastId: pagination.lastId,
				limit: pagination.limit,
			}),
		).toString('base64');
	}
	return null;
};

export const encodeNextCursor = (
	pagination: OffsetPagination | CursorPagination,
): string | null => {
	if ('offset' in pagination) {
		return encodeOffSetPagination(pagination);
	}
	return encodeCursorPagination(pagination);
};

```
