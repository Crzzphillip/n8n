## src2/middlewares/list-query/dtos/user.filter.dto.ts

Overview: src2/middlewares/list-query/dtos/user.filter.dto.ts is a core component (UserFilter) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Expose } from 'class-transformer';
- import { IsOptional, IsString, IsBoolean } from 'class-validator';
- import { BaseFilter } from './base.filter.dto';

### Declarations

- Classes: UserFilter
- Exports: UserFilter

### Recreate

Place this file at `src2/middlewares/list-query/dtos/user.filter.dto.ts` and use the following source:

```ts
import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

import { BaseFilter } from './base.filter.dto';

export class UserFilter extends BaseFilter {
	@IsString()
	@IsOptional()
	@Expose()
	email?: string;

	@IsString()
	@IsOptional()
	@Expose()
	firstName?: string;

	@IsString()
	@IsOptional()
	@Expose()
	lastName?: string;

	@IsBoolean()
	@IsOptional()
	@Expose()
	isOwner?: boolean;

	static async fromString(rawFilter: string) {
		return await this.toFilter(rawFilter, UserFilter);
	}
}

```
