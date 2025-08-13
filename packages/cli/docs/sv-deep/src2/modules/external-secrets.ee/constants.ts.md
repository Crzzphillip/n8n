## src2/modules/external-secrets.ee/constants.ts

Overview: src2/modules/external-secrets.ee/constants.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { INodeProperties } from 'n8n-workflow';

### Declarations

- Exports: EXTERNAL_SECRETS_DB_KEY, EXTERNAL_SECRETS_INITIAL_BACKOFF, EXTERNAL_SECRETS_MAX_BACKOFF, EXTERNAL_SECRETS_NAME_REGEX, DOCS_HELP_NOTICE

### Recreate

Place this file at `src2/modules/external-secrets.ee/constants.ts` and use the following source:

```ts
import type { INodeProperties } from 'n8n-workflow';

export const EXTERNAL_SECRETS_DB_KEY = 'feature.externalSecrets';
export const EXTERNAL_SECRETS_INITIAL_BACKOFF = 10 * 1000;
export const EXTERNAL_SECRETS_MAX_BACKOFF = 5 * 60 * 1000;

export const EXTERNAL_SECRETS_NAME_REGEX = /^[a-zA-Z0-9\-\_\/]+$/;

export const DOCS_HELP_NOTICE: INodeProperties = {
	displayName:
		'Need help filling out these fields? <a href="https://docs.n8n.io/external-secrets/#connect-n8n-to-your-secrets-store" target="_blank">Open docs</a>',
	name: 'notice',
	type: 'notice',
	default: '',
	noDataExpression: true,
};

```
