## src2/services/password.utility.ts

Overview: src2/services/password.utility.ts provides a service (PasswordUtility) encapsulating domain logic and integrations.

How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.

Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.

### Imports

- import { Service as Utility } from '@n8n/di';
- import { compare, hash } from 'bcryptjs';

### Declarations

- Classes: PasswordUtility
- Exports: PasswordUtility

### Recreate

Place this file at `src2/services/password.utility.ts` and use the following source:

```ts
import { Service as Utility } from '@n8n/di';
import { compare, hash } from 'bcryptjs';

const SALT_ROUNDS = 10;

@Utility()
export class PasswordUtility {
	async hash(plaintext: string) {
		return await hash(plaintext, SALT_ROUNDS);
	}

	async compare(plaintext: string, hashed: string | null) {
		if (hashed === null) {
			return false;
		}
		return await compare(plaintext, hashed);
	}
}

```
