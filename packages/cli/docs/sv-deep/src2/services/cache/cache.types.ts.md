## src2/services/cache/cache.types.ts

Overview: src2/services/cache/cache.types.ts provides a service encapsulating domain logic and integrations.

How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.

Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.

### Imports

- import type { MemoryCache } from 'cache-manager';
- import type { RedisCache } from '@/services/cache/redis.cache-manager';

### Declarations

- Exports: TaggedRedisCache, TaggedMemoryCache, Hash, MaybeHash

### Recreate

Place this file at `src2/services/cache/cache.types.ts` and use the following source:

```ts
import type { MemoryCache } from 'cache-manager';

import type { RedisCache } from '@/services/cache/redis.cache-manager';

export type TaggedRedisCache = RedisCache & { kind: 'redis' };

export type TaggedMemoryCache = MemoryCache & { kind: 'memory' };

export type Hash<T = unknown> = Record<string, T>;

export type MaybeHash<T> = Hash<T> | undefined;

```
