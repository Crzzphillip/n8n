## src2/modules/external-secrets.ee/providers/gcp-secrets-manager/types.ts

Overview: src2/modules/external-secrets.ee/providers/gcp-secrets-manager/types.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { SecretsProviderSettings } from '../../types';

### Declarations

- Exports: GcpSecretsManagerContext, RawGcpSecretAccountKey, GcpSecretAccountKey

### Recreate

Place this file at `src2/modules/external-secrets.ee/providers/gcp-secrets-manager/types.ts` and use the following source:

```ts
import type { SecretsProviderSettings } from '../../types';

type JsonString = string;

export type GcpSecretsManagerContext = SecretsProviderSettings<{
	serviceAccountKey: JsonString;
}>;

export type RawGcpSecretAccountKey = {
	project_id?: string;
	private_key?: string;
	client_email?: string;
};

export type GcpSecretAccountKey = {
	projectId: string;
	clientEmail: string;
	privateKey: string;
};

```
