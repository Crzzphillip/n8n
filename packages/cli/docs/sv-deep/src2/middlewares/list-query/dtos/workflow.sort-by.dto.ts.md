## src2/middlewares/list-query/dtos/workflow.sort-by.dto.ts

Overview: src2/middlewares/list-query/dtos/workflow.sort-by.dto.ts is a core component (WorkflowSortByParameter) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
- import { IsString, Validate, ValidatorConstraint } from 'class-validator';

### Declarations

- Classes: WorkflowSortByParameter, WorkflowSorting
- Exports: WorkflowSortByParameter, WorkflowSorting

### Recreate

Place this file at `src2/middlewares/list-query/dtos/workflow.sort-by.dto.ts` and use the following source:

```ts
import type { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { IsString, Validate, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ name: 'WorkflowSortByParameter', async: false })
export class WorkflowSortByParameter implements ValidatorConstraintInterface {
	validate(text: string, _: ValidationArguments) {
		const [column, order] = text.split(':');
		if (!column || !order) return false;

		return ['name', 'createdAt', 'updatedAt'].includes(column) && ['asc', 'desc'].includes(order);
	}

	defaultMessage(_: ValidationArguments) {
		return 'Invalid value for sortBy parameter';
	}
}

export class WorkflowSorting {
	@IsString()
	@Validate(WorkflowSortByParameter)
	sortBy?: string;
}

```
