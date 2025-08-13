## src2/sso.ee/sso-helpers.ts

Overview: src2/sso.ee/sso-helpers.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { GlobalConfig } from '@n8n/config';
- import { SettingsRepository, type AuthProviderType } from '@n8n/db';
- import { Container } from '@n8n/di';
- import config from '@/config';

### Declarations

- Functions: sets, setCurrentAuthenticationMethod, getCurrentAuthenticationMethod, isSamlCurrentAuthenticationMethod, isLdapCurrentAuthenticationMethod, isOidcCurrentAuthenticationMethod, isEmailCurrentAuthenticationMethod, isSsoJustInTimeProvisioningEnabled, doRedirectUsersFromLoginToSsoFlow
- Exports: getCurrentAuthenticationMethod, isSamlCurrentAuthenticationMethod, isLdapCurrentAuthenticationMethod, isOidcCurrentAuthenticationMethod, isEmailCurrentAuthenticationMethod, isSsoJustInTimeProvisioningEnabled, doRedirectUsersFromLoginToSsoFlow

### Recreate

Place this file at `src2/sso.ee/sso-helpers.ts` and use the following source:

```ts
import { GlobalConfig } from '@n8n/config';
import { SettingsRepository, type AuthProviderType } from '@n8n/db';
import { Container } from '@n8n/di';

import config from '@/config';

/**
 * Only one authentication method can be active at a time. This function sets
 * the current authentication method and saves it to the database.
 * SSO methods should only switch to email and then to another method. Email
 * can switch to any method.
 */
export async function setCurrentAuthenticationMethod(
	authenticationMethod: AuthProviderType,
): Promise<void> {
	config.set('userManagement.authenticationMethod', authenticationMethod);
	await Container.get(SettingsRepository).save(
		{
			key: 'userManagement.authenticationMethod',
			value: authenticationMethod,
			loadOnStartup: true,
		},
		{ transaction: false },
	);
}

export function getCurrentAuthenticationMethod(): AuthProviderType {
	return config.getEnv('userManagement.authenticationMethod');
}

export function isSamlCurrentAuthenticationMethod(): boolean {
	return getCurrentAuthenticationMethod() === 'saml';
}

export function isLdapCurrentAuthenticationMethod(): boolean {
	return getCurrentAuthenticationMethod() === 'ldap';
}

export function isOidcCurrentAuthenticationMethod(): boolean {
	return getCurrentAuthenticationMethod() === 'oidc';
}

export function isEmailCurrentAuthenticationMethod(): boolean {
	return getCurrentAuthenticationMethod() === 'email';
}

export function isSsoJustInTimeProvisioningEnabled(): boolean {
	return Container.get(GlobalConfig).sso.justInTimeProvisioning;
}

export function doRedirectUsersFromLoginToSsoFlow(): boolean {
	return Container.get(GlobalConfig).sso.redirectLoginToSso;
}

```
