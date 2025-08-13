### src2/scaling/pubsub/pubsub.eventbus.ts

Overview: src2/scaling/pubsub/pubsub.eventbus.ts contributes to queue-based scaling (jobs, workers, pub/sub).

How it works: It configures Redis-backed queues, job processing, and instance coordination, enabling offloaded executions and horizontal scale.

Why it’s designed this way: Separating API and execution capacity increases resilience and throughput at scale.

This component follows sv’s dependency-injection and modular architecture to keep responsibilities focused and testable. Decorators (e.g., @Service, @RestController, @Command) make wiring explicit while deferring lifecycle and registration to the container.
