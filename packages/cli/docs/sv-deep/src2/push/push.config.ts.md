## src2/push/push.config.ts

Overview: src2/push/push.config.ts is a core component (PushConfig) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Config, Env } from '@n8n/config';

### Declarations

- Classes: PushConfig
- Exports: PushConfig

### Recreate

Place this file at `src2/push/push.config.ts` and use the following source:

```ts
import { Config, Env } from '@n8n/config';

@Config
export class PushConfig {
	/** Backend to use for push notifications */
	@Env('N8N_PUSH_BACKEND')
	backend: 'sse' | 'websocket' = 'websocket';
}

```
