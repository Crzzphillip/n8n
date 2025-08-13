## src2/auth/jwt.ts

Overview: src2/auth/jwt.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { User } from '@n8n/db';
- import { Container } from '@n8n/di';
- import type { Response } from 'express';
- import { AuthService } from './auth.service';

### Declarations

- Functions: issueCookie
- Exports: issueCookie

### Recreate

Place this file at `src2/auth/jwt.ts` and use the following source:

```ts
import type { User } from '@n8n/db';
import { Container } from '@n8n/di';
import type { Response } from 'express';

import { AuthService } from './auth.service';

// This method is still used by cloud hooks.
// DO NOT DELETE until the hooks have been updated
/** @deprecated Use `AuthService` instead */
export function issueCookie(res: Response, user: User) {
	return Container.get(AuthService).issueCookie(res, user, user.mfaEnabled);
}

```
