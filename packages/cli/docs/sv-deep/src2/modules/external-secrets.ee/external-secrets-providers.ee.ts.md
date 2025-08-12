## src2/modules/external-secrets.ee/external-secrets-providers.ee.ts

Overview: src2/modules/external-secrets.ee/external-secrets-providers.ee.ts is a core component (ExternalSecretsProviders) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Service } from '@n8n/di';
- import { AwsSecretsManager } from './providers/aws-secrets-manager';
- import { AzureKeyVault } from './providers/azure-key-vault/azure-key-vault';
- import { GcpSecretsManager } from './providers/gcp-secrets-manager/gcp-secrets-manager';
- import { InfisicalProvider } from './providers/infisical';
- import { VaultProvider } from './providers/vault';
- import type { SecretsProvider } from './types';

### Declarations

- Classes: ExternalSecretsProviders
- Exports: ExternalSecretsProviders

### Recreate

Place this file at `src2/modules/external-secrets.ee/external-secrets-providers.ee.ts` and use the following source:

```ts
import { Service } from '@n8n/di';

import { AwsSecretsManager } from './providers/aws-secrets-manager';
import { AzureKeyVault } from './providers/azure-key-vault/azure-key-vault';
import { GcpSecretsManager } from './providers/gcp-secrets-manager/gcp-secrets-manager';
import { InfisicalProvider } from './providers/infisical';
import { VaultProvider } from './providers/vault';
import type { SecretsProvider } from './types';

@Service()
export class ExternalSecretsProviders {
	providers: Record<string, { new (): SecretsProvider }> = {
		awsSecretsManager: AwsSecretsManager,
		infisical: InfisicalProvider,
		vault: VaultProvider,
		azureKeyVault: AzureKeyVault,
		gcpSecretsManager: GcpSecretsManager,
	};

	getProvider(name: string): { new (): SecretsProvider } {
		return this.providers[name];
	}

	hasProvider(name: string) {
		return name in this.providers;
	}

	getAllProviders() {
		return this.providers;
	}
}

```
