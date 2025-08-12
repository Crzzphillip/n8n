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
