## src2/services/jwt.service.ts

Overview: src2/services/jwt.service.ts provides a service (JwtService) encapsulating domain logic and integrations.

How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.

Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.

### Imports

- import { Service } from '@n8n/di';
- import { createHash } from 'crypto';
- import jwt from 'jsonwebtoken';
- import { InstanceSettings } from 'n8n-core';
- import config from '@/config';

### Declarations

- Classes: JwtService
- Exports: JwtService, JwtPayload

### Recreate

Place this file at `src2/services/jwt.service.ts` and use the following source:

```ts
import { Service } from '@n8n/di';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import { InstanceSettings } from 'n8n-core';

import config from '@/config';

@Service()
export class JwtService {
	readonly jwtSecret = config.getEnv('userManagement.jwtSecret');

	constructor({ encryptionKey }: InstanceSettings) {
		this.jwtSecret = config.getEnv('userManagement.jwtSecret');
		if (!this.jwtSecret) {
			// If we don't have a JWT secret set, generate one based on encryption key.
			// For a key off every other letter from encryption key
			// CAREFUL: do not change this or it breaks all existing tokens.
			let baseKey = '';
			for (let i = 0; i < encryptionKey.length; i += 2) {
				baseKey += encryptionKey[i];
			}
			this.jwtSecret = createHash('sha256').update(baseKey).digest('hex');
			config.set('userManagement.jwtSecret', this.jwtSecret);
		}
	}

	sign(payload: object, options: jwt.SignOptions = {}): string {
		return jwt.sign(payload, this.jwtSecret, options);
	}

	decode(token: string) {
		return jwt.decode(token) as JwtPayload;
	}

	verify<T = JwtPayload>(token: string, options: jwt.VerifyOptions = {}) {
		return jwt.verify(token, this.jwtSecret, options) as T;
	}
}

export type JwtPayload = jwt.JwtPayload;

```
