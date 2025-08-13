## src2/middlewares/list-query/dtos/credentials.filter.dto.ts

Overview: src2/middlewares/list-query/dtos/credentials.filter.dto.ts is a core component (CredentialsFilter) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Expose } from 'class-transformer';
- import { IsOptional, IsString } from 'class-validator';
- import { BaseFilter } from './base.filter.dto';

### Declarations

- Classes: CredentialsFilter
- Exports: CredentialsFilter

### Recreate

Place this file at `src2/middlewares/list-query/dtos/credentials.filter.dto.ts` and use the following source:

```ts
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { BaseFilter } from './base.filter.dto';

export class CredentialsFilter extends BaseFilter {
	@IsString()
	@IsOptional()
	@Expose()
	name?: string;

	@IsString()
	@IsOptional()
	@Expose()
	type?: string;

	@IsString()
	@IsOptional()
	@Expose()
	projectId?: string;

	static async fromString(rawFilter: string) {
		return await this.toFilter(rawFilter, CredentialsFilter);
	}
}

```
