## src2/middlewares/list-query/dtos/workflow.select.dto.ts

Overview: src2/middlewares/list-query/dtos/workflow.select.dto.ts is a core component (WorkflowSelect) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { BaseSelect } from './base.select.dto';

### Declarations

- Classes: WorkflowSelect
- Exports: WorkflowSelect

### Recreate

Place this file at `src2/middlewares/list-query/dtos/workflow.select.dto.ts` and use the following source:

```ts
import { BaseSelect } from './base.select.dto';

export class WorkflowSelect extends BaseSelect {
	static get selectableFields() {
		return new Set([
			'id', // always included downstream
			'name',
			'active',
			'tags',
			'createdAt',
			'updatedAt',
			'versionId',
			'ownedBy', // non-entity field
			'parentFolder',
		]);
	}

	static fromString(rawFilter: string) {
		return this.toSelect(rawFilter, WorkflowSelect);
	}
}

```
