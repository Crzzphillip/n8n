## src2/modules/external-secrets.ee/external-secrets.module.ts

Overview: src2/modules/external-secrets.ee/external-secrets.module.ts is a core component (ExternalSecretsModule) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { ModuleInterface } from '@n8n/decorators';
- import { BackendModule, OnShutdown } from '@n8n/decorators';
- import { Container } from '@n8n/di';

### Declarations

- Classes: ExternalSecretsModule
- Exports: ExternalSecretsModule

### Recreate

Place this file at `src2/modules/external-secrets.ee/external-secrets.module.ts` and use the following source:

```ts
import type { ModuleInterface } from '@n8n/decorators';
import { BackendModule, OnShutdown } from '@n8n/decorators';
import { Container } from '@n8n/di';

@BackendModule({ name: 'external-secrets', licenseFlag: 'feat:externalSecrets' })
export class ExternalSecretsModule implements ModuleInterface {
	async init() {
		await import('./external-secrets.controller.ee');

		const { ExternalSecretsManager } = await import('./external-secrets-manager.ee');
		const { ExternalSecretsProxy } = await import('n8n-core');

		const externalSecretsManager = Container.get(ExternalSecretsManager);
		const externalSecretsProxy = Container.get(ExternalSecretsProxy);

		await externalSecretsManager.init();
		externalSecretsProxy.setManager(externalSecretsManager);
	}

	@OnShutdown()
	async shutdown() {
		const { ExternalSecretsManager } = await import('./external-secrets-manager.ee');

		Container.get(ExternalSecretsManager).shutdown();
	}
}

```
