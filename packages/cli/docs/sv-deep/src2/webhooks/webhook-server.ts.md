## src2/webhooks/webhook-server.ts

Overview: src2/webhooks/webhook-server.ts is a core component (WebhookServer) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Service } from '@n8n/di';
- import { AbstractServer } from '@/abstract-server';

### Declarations

- Classes: WebhookServer
- Exports: WebhookServer

### Recreate

Place this file at `src2/webhooks/webhook-server.ts` and use the following source:

```ts
import { Service } from '@n8n/di';

import { AbstractServer } from '@/abstract-server';

@Service()
export class WebhookServer extends AbstractServer {}

```
