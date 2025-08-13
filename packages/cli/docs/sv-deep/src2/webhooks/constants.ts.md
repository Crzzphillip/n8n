## src2/webhooks/constants.ts

Overview: src2/webhooks/constants.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { CHAT_TRIGGER_NODE_TYPE } from 'n8n-workflow';

### Declarations

- Exports: authAllowlistedNodes

### Recreate

Place this file at `src2/webhooks/constants.ts` and use the following source:

```ts
import { CHAT_TRIGGER_NODE_TYPE } from 'n8n-workflow';

export const authAllowlistedNodes = new Set([CHAT_TRIGGER_NODE_TYPE]);

```
