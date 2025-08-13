## src2/sso.ee/saml/middleware/saml-enabled-middleware.ts

Overview: src2/sso.ee/saml/middleware/saml-enabled-middleware.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { RequestHandler } from 'express';
- import { isSamlLicensed, isSamlLicensedAndEnabled } from '../saml-helpers';

### Declarations

- Exports: samlLicensedAndEnabledMiddleware, samlLicensedMiddleware

### Recreate

Place this file at `src2/sso.ee/saml/middleware/saml-enabled-middleware.ts` and use the following source:

```ts
import type { RequestHandler } from 'express';

import { isSamlLicensed, isSamlLicensedAndEnabled } from '../saml-helpers';

export const samlLicensedAndEnabledMiddleware: RequestHandler = (_, res, next) => {
	if (isSamlLicensedAndEnabled()) {
		next();
	} else {
		res.status(403).json({ status: 'error', message: 'Unauthorized' });
	}
};

export const samlLicensedMiddleware: RequestHandler = (_, res, next) => {
	if (isSamlLicensed()) {
		next();
	} else {
		res.status(403).json({ status: 'error', message: 'Unauthorized' });
	}
};

```
