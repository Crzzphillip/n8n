## src2/modules/external-secrets.ee/external-secrets.config.ts

Overview: src2/modules/external-secrets.ee/external-secrets.config.ts is a core component (ExternalSecretsConfig) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Config, Env } from '@n8n/config';

### Declarations

- Classes: ExternalSecretsConfig
- Exports: ExternalSecretsConfig

### Recreate

Place this file at `src2/modules/external-secrets.ee/external-secrets.config.ts` and use the following source:

```ts
import { Config, Env } from '@n8n/config';

@Config
export class ExternalSecretsConfig {
	/** How often (in seconds) to check for secret updates */
	@Env('N8N_EXTERNAL_SECRETS_UPDATE_INTERVAL')
	updateInterval: number = 300;

	/** Whether to prefer GET over LIST when fetching secrets from Hashicorp Vault */
	@Env('N8N_EXTERNAL_SECRETS_PREFER_GET')
	preferGet: boolean = false;
}

```
