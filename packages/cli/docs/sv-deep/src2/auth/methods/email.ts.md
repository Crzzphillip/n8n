## src2/auth/methods/email.ts

Overview: src2/auth/methods/email.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { User } from '@n8n/db';
- import { UserRepository } from '@n8n/db';
- import { Container } from '@n8n/di';
- import { AuthError } from '@/errors/response-errors/auth.error';
- import { EventService } from '@/events/event.service';
- import { isLdapLoginEnabled } from '@/ldap.ee/helpers.ee';
- import { PasswordUtility } from '@/services/password.utility';

### Declarations

- Exports: handleEmailLogin

### Recreate

Place this file at `src2/auth/methods/email.ts` and use the following source:

```ts
import type { User } from '@n8n/db';
import { UserRepository } from '@n8n/db';
import { Container } from '@n8n/di';

import { AuthError } from '@/errors/response-errors/auth.error';
import { EventService } from '@/events/event.service';
import { isLdapLoginEnabled } from '@/ldap.ee/helpers.ee';
import { PasswordUtility } from '@/services/password.utility';

export const handleEmailLogin = async (
	email: string,
	password: string,
): Promise<User | undefined> => {
	const user = await Container.get(UserRepository).findOne({
		where: { email },
		relations: ['authIdentities'],
	});

	if (user?.password && (await Container.get(PasswordUtility).compare(password, user.password))) {
		return user;
	}

	// At this point if the user has a LDAP ID, means it was previously an LDAP user,
	// so suggest to reset the password to gain access to the instance.
	const ldapIdentity = user?.authIdentities?.find((i) => i.providerType === 'ldap');
	if (user && ldapIdentity && !isLdapLoginEnabled()) {
		Container.get(EventService).emit('login-failed-due-to-ldap-disabled', { userId: user.id });

		throw new AuthError('Reset your password to gain access to the instance.');
	}

	return undefined;
};

```
