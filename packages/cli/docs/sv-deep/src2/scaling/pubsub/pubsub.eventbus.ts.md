## src2/scaling/pubsub/pubsub.eventbus.ts

Overview: src2/scaling/pubsub/pubsub.eventbus.ts is a core component (PubSubEventBus) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Service } from '@n8n/di';
- import { TypedEmitter } from '@/typed-emitter';
- import type { PubSubEventMap } from './pubsub.event-map';

### Declarations

- Classes: PubSubEventBus
- Exports: PubSubEventBus

### Recreate

Place this file at `src2/scaling/pubsub/pubsub.eventbus.ts` and use the following source:

```ts
import { Service } from '@n8n/di';

import { TypedEmitter } from '@/typed-emitter';

import type { PubSubEventMap } from './pubsub.event-map';

@Service()
export class PubSubEventBus extends TypedEmitter<PubSubEventMap> {}

```
