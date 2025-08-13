## src2/scaling/redis/redis.types.ts

Overview: src2/scaling/redis/redis.types.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: RedisClientType

### Recreate

Place this file at `src2/scaling/redis/redis.types.ts` and use the following source:

```ts
export type RedisClientType = N8nRedisClientType | BullRedisClientType;

/**
 * Redis client used by n8n.
 *
 * - `subscriber(sv)` to listen for messages from scaling mode pubsub channels
 * - `publisher(sv)` to send messages into scaling mode pubsub channels
 * - `cache(sv)` for caching operations (variables, resource ownership, etc.)
 */
type N8nRedisClientType = 'subscriber(sv)' | 'publisher(sv)' | 'cache(sv)';

/**
 * Redis client used internally by Bull. Suffixed with `(bull)` at `ScalingService.setupQueue`.
 *
 * - `subscriber(bull)` for event listening
 * - `client(bull)` for general queue operations
 * - `bclient(bull)` for blocking operations when processing jobs
 */
type BullRedisClientType = 'subscriber(bull)' | 'client(bull)' | 'bclient(bull)';

```
