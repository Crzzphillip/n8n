### src2/webhooks/live-webhooks.ts

Overview: src2/webhooks/live-webhooks.ts implements webhook registration, lookup, and request handling for workflow-triggered HTTP endpoints.

How it works: Webhooks are registered at activation time, normalized, stored, and matched at runtime. Helpers handle body parsing, sanitation, and response shaping, supporting test/live modes and waiting states.

Why it’s designed this way: Centralized management ensures idempotent provisioning and secure handling while keeping workflow logic clean.

This component follows sv’s dependency-injection and modular architecture to keep responsibilities focused and testable. Decorators (e.g., @Service, @RestController, @Command) make wiring explicit while deferring lifecycle and registration to the container.
