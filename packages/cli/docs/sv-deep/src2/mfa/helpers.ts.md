## src2/mfa/helpers.ts

Overview: src2/mfa/helpers.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { GlobalConfig } from '@n8n/config';
- import { UserRepository } from '@n8n/db';
- import { Container } from '@n8n/di';

### Declarations

- Exports: isMfaFeatureEnabled, handleMfaDisable

### Recreate

Place this file at `src2/mfa/helpers.ts` and use the following source:

```ts
import { GlobalConfig } from '@n8n/config';
import { UserRepository } from '@n8n/db';
import { Container } from '@n8n/di';

export const isMfaFeatureEnabled = () => Container.get(GlobalConfig).mfa.enabled;

const isMfaFeatureDisabled = () => !isMfaFeatureEnabled();

const getUsersWithMfaEnabled = async () =>
	await Container.get(UserRepository).count({ where: { mfaEnabled: true } });

export const handleMfaDisable = async () => {
	if (isMfaFeatureDisabled()) {
		// check for users with MFA enabled, and if there are
		// users, then keep the feature enabled
		const users = await getUsersWithMfaEnabled();
		if (users) {
			Container.get(GlobalConfig).mfa.enabled = true;
		}
	}
};

```
