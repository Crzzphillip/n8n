## src2/errors/feature-not-licensed.error.ts

Overview: src2/errors/feature-not-licensed.error.ts is a core component (FeatureNotLicensedError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { LICENSE_FEATURES } from '@n8n/constants';
- import { UserError } from 'n8n-workflow';

### Declarations

- Classes: FeatureNotLicensedError
- Exports: FeatureNotLicensedError

### Recreate

Place this file at `src2/errors/feature-not-licensed.error.ts` and use the following source:

```ts
import type { LICENSE_FEATURES } from '@n8n/constants';
import { UserError } from 'n8n-workflow';

export class FeatureNotLicensedError extends UserError {
	constructor(feature: (typeof LICENSE_FEATURES)[keyof typeof LICENSE_FEATURES]) {
		super(
			`Your license does not allow for ${feature}. To enable ${feature}, please upgrade to a license that supports this feature.`,
			{ level: 'warning' },
		);
	}
}

```
