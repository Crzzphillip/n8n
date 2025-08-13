## src2/middlewares/list-query/dtos/workflow.filter.dto.ts

Overview: src2/middlewares/list-query/dtos/workflow.filter.dto.ts is a core component (WorkflowFilter) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Expose } from 'class-transformer';
- import { IsOptional, IsString, IsBoolean, IsArray } from 'class-validator';
- import { BaseFilter } from './base.filter.dto';

### Declarations

- Classes: WorkflowFilter
- Exports: WorkflowFilter

### Recreate

Place this file at `src2/middlewares/list-query/dtos/workflow.filter.dto.ts` and use the following source:

```ts
import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsBoolean, IsArray } from 'class-validator';

import { BaseFilter } from './base.filter.dto';

export class WorkflowFilter extends BaseFilter {
	@IsString()
	@IsOptional()
	@Expose()
	name?: string;

	@IsBoolean()
	@IsOptional()
	@Expose()
	active?: boolean;

	@IsBoolean()
	@IsOptional()
	@Expose()
	isArchived?: boolean;

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	@Expose()
	tags?: string[];

	@IsString()
	@IsOptional()
	@Expose()
	projectId?: string;

	@IsString()
	@IsOptional()
	@Expose()
	parentFolderId?: string;

	static async fromString(rawFilter: string) {
		return await this.toFilter(rawFilter, WorkflowFilter);
	}
}

```
