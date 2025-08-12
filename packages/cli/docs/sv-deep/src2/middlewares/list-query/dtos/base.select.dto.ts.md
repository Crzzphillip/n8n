## src2/middlewares/list-query/dtos/base.select.dto.ts

Overview: src2/middlewares/list-query/dtos/base.select.dto.ts is a core component (BaseSelect) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { isStringArray } from '@n8n/db';
- import { jsonParse, UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: BaseSelect
- Exports: BaseSelect

### Recreate

Place this file at `src2/middlewares/list-query/dtos/base.select.dto.ts` and use the following source:

```ts
import { isStringArray } from '@n8n/db';
import { jsonParse, UnexpectedError } from 'n8n-workflow';

export class BaseSelect {
	static selectableFields: Set<string>;

	protected static toSelect(rawFilter: string, Select: typeof BaseSelect) {
		const dto = jsonParse(rawFilter, { errorMessage: 'Failed to parse filter JSON' });

		if (!isStringArray(dto)) throw new UnexpectedError('Parsed select is not a string array');

		return dto.reduce<Record<string, true>>((acc, field) => {
			if (!Select.selectableFields.has(field)) return acc;
			return (acc[field] = true), acc;
		}, {});
	}
}

```
