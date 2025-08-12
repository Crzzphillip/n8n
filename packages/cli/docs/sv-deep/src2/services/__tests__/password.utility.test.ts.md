## src2/services/__tests__/password.utility.test.ts

Overview: src2/services/__tests__/password.utility.test.ts provides a service encapsulating domain logic and integrations.

How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.

Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.

### Imports

- import { Container } from '@n8n/di';
- import { PasswordUtility } from '@/services/password.utility';

### Declarations

- Functions: toComponents

### Recreate

Place this file at `src2/services/__tests__/password.utility.test.ts` and use the following source:

```ts
import { Container } from '@n8n/di';

import { PasswordUtility } from '@/services/password.utility';

function toComponents(hash: string) {
	const BCRYPT_HASH_REGEX =
		/^\$(?<version>.{2})\$(?<costFactor>\d{2})\$(?<salt>.{22})(?<hashedPassword>.{31})$/;

	const match = hash.match(BCRYPT_HASH_REGEX);

	if (!match?.groups) throw new Error('Invalid bcrypt hash format');

	return match.groups;
}

describe('PasswordUtility', () => {
	const passwordUtility = Container.get(PasswordUtility);

	describe('hash()', () => {
		test('should hash a plaintext password', async () => {
			const plaintext = 'abcd1234X';
			const hashed = await passwordUtility.hash(plaintext);

			const { version, costFactor, salt, hashedPassword } = toComponents(hashed);

			expect(version).toBe('2a');
			expect(costFactor).toBe('10');
			expect(salt).toHaveLength(22);
			expect(hashedPassword).toHaveLength(31);
		});
	});

	describe('compare()', () => {
		test('should return true on match', async () => {
			const plaintext = 'abcd1234X';
			const hashed = await passwordUtility.hash(plaintext);

			const isMatch = await passwordUtility.compare(plaintext, hashed);

			expect(isMatch).toBe(true);
		});

		test('should return false on mismatch', async () => {
			const secondPlaintext = 'abcd1234Y';
			const hashed = await passwordUtility.hash('abcd1234X');

			const isMatch = await passwordUtility.compare(secondPlaintext, hashed);

			expect(isMatch).toBe(false);
		});
	});
});

```
