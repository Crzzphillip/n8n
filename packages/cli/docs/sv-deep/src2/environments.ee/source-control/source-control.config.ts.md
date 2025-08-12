## src2/environments.ee/source-control/source-control.config.ts

Overview: src2/environments.ee/source-control/source-control.config.ts is a core component (SourceControlConfig) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Config, Env } from '@n8n/config';

### Declarations

- Classes: SourceControlConfig
- Exports: SourceControlConfig

### Recreate

Place this file at `src2/environments.ee/source-control/source-control.config.ts` and use the following source:

```ts
import { Config, Env } from '@n8n/config';

@Config
export class SourceControlConfig {
	/** Default SSH key type to use when generating SSH keys. */
	@Env('N8N_SOURCECONTROL_DEFAULT_SSH_KEY_TYPE')
	defaultKeyPairType: 'ed25519' | 'rsa' = 'ed25519';
}

```
