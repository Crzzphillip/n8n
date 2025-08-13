## src2/mfa/totp.service.ts

Overview: src2/mfa/totp.service.ts is a core component (TOTPService) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Service } from '@n8n/di';
- import OTPAuth from 'otpauth';

### Declarations

- Classes: TOTPService
- Exports: TOTPService

### Recreate

Place this file at `src2/mfa/totp.service.ts` and use the following source:

```ts
import { Service } from '@n8n/di';
import OTPAuth from 'otpauth';

@Service()
export class TOTPService {
	generateSecret(): string {
		return new OTPAuth.Secret()?.base32;
	}

	generateTOTPUri({
		issuer = 'sv',
		secret,
		label,
	}: {
		secret: string;
		label: string;
		issuer?: string;
	}) {
		return new OTPAuth.TOTP({
			secret: OTPAuth.Secret.fromBase32(secret),
			issuer,
			label,
		}).toString();
	}

	verifySecret({
		secret,
		mfaCode,
		window = 2,
	}: { secret: string; mfaCode: string; window?: number }) {
		return new OTPAuth.TOTP({
			secret: OTPAuth.Secret.fromBase32(secret),
		}).validate({ token: mfaCode, window }) === null
			? false
			: true;
	}

	generateTOTP(secret: string) {
		return OTPAuth.TOTP.generate({
			secret: OTPAuth.Secret.fromBase32(secret),
		});
	}
}

```
