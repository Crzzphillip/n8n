## src2/modules/external-secrets.ee/providers/azure-key-vault/types.ts

Overview: src2/modules/external-secrets.ee/providers/azure-key-vault/types.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { SecretsProviderSettings } from '../../types';

### Declarations

- Exports: AzureKeyVaultContext

### Recreate

Place this file at `src2/modules/external-secrets.ee/providers/azure-key-vault/types.ts` and use the following source:

```ts
import type { SecretsProviderSettings } from '../../types';

export type AzureKeyVaultContext = SecretsProviderSettings<{
	vaultName: string;
	tenantId: string;
	clientId: string;
	clientSecret: string;
}>;

```
