## src2/ldap.ee/types.ts

Overview: src2/ldap.ee/types.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { LdapConfig } from '@n8n/constants';
- import type { AuthenticatedRequest, RunningMode } from '@n8n/db';

### Recreate

Place this file at `src2/ldap.ee/types.ts` and use the following source:

```ts
import type { LdapConfig } from '@n8n/constants';
import type { AuthenticatedRequest, RunningMode } from '@n8n/db';

export declare namespace LdapConfiguration {
	type Update = AuthenticatedRequest<{}, {}, LdapConfig, {}>;
	type Sync = AuthenticatedRequest<{}, {}, { type: RunningMode }, {}>;
	type GetSync = AuthenticatedRequest<{}, {}, {}, { page?: string; perPage?: string }>;
}

```
