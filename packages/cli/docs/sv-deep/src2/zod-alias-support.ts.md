## src2/zod-alias-support.ts

Overview: src2/zod-alias-support.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { z } from 'zod';

### Recreate

Place this file at `src2/zod-alias-support.ts` and use the following source:

```ts
import { z } from 'zod';

// Monkey-patch zod to support aliases
declare module 'zod' {
	interface ZodType {
		alias<T extends ZodType>(this: T, aliasName: string): T;
	}
	interface ZodTypeDef {
		_alias: string;
	}
}

z.ZodType.prototype.alias = function <T extends z.ZodType>(this: T, aliasName: string) {
	this._def._alias = aliasName;
	return this;
};

```
