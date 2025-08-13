## src2/middlewares/list-query/dtos/credentials.select.dto.ts

Overview: src2/middlewares/list-query/dtos/credentials.select.dto.ts is a core component (CredentialsSelect) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { BaseSelect } from './base.select.dto';

### Declarations

- Classes: CredentialsSelect
- Exports: CredentialsSelect

### Recreate

Place this file at `src2/middlewares/list-query/dtos/credentials.select.dto.ts` and use the following source:

```ts
import { BaseSelect } from './base.select.dto';

export class CredentialsSelect extends BaseSelect {
	static get selectableFields() {
		return new Set([
			'id', // always included downstream
			'name',
			'type',
		]);
	}

	static fromString(rawFilter: string) {
		return this.toSelect(rawFilter, CredentialsSelect);
	}
}

```
