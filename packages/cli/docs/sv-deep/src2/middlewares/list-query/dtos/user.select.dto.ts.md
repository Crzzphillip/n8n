## src2/middlewares/list-query/dtos/user.select.dto.ts

Overview: src2/middlewares/list-query/dtos/user.select.dto.ts is a core component (UserSelect) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { BaseSelect } from './base.select.dto';

### Declarations

- Classes: UserSelect
- Exports: UserSelect

### Recreate

Place this file at `src2/middlewares/list-query/dtos/user.select.dto.ts` and use the following source:

```ts
import { BaseSelect } from './base.select.dto';

export class UserSelect extends BaseSelect {
	static get selectableFields() {
		return new Set(['id', 'email', 'firstName', 'lastName']);
	}

	static fromString(rawFilter: string) {
		return this.toSelect(rawFilter, UserSelect);
	}
}

```
