## src2/middlewares/list-query/dtos/base.filter.dto.ts

Overview: src2/middlewares/list-query/dtos/base.filter.dto.ts is a core component (BaseFilter) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { isObjectLiteral } from '@n8n/backend-common';
- import { plainToInstance, instanceToPlain } from 'class-transformer';
- import { validate } from 'class-validator';
- import { jsonParse, UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: BaseFilter, undefined
- Exports: BaseFilter

### Recreate

Place this file at `src2/middlewares/list-query/dtos/base.filter.dto.ts` and use the following source:

```ts
import { isObjectLiteral } from '@n8n/backend-common';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { validate } from 'class-validator';
import { jsonParse, UnexpectedError } from 'n8n-workflow';

export class BaseFilter {
	protected static async toFilter(rawFilter: string, Filter: typeof BaseFilter) {
		const dto = jsonParse(rawFilter, { errorMessage: 'Failed to parse filter JSON' });

		if (!isObjectLiteral(dto)) throw new UnexpectedError('Filter must be an object literal');

		const instance = plainToInstance(Filter, dto, {
			excludeExtraneousValues: true, // remove fields not in class
		});

		await instance.validate();

		return instanceToPlain(instance, {
			exposeUnsetFields: false, // remove in-class undefined fields
		});
	}

	private async validate() {
		const result = await validate(this);

		if (result.length > 0) throw new UnexpectedError('Parsed filter does not fit the schema');
	}
}

```
