### src2/workflows/workflow-history.ee/workflow-history-manager.ee.ts

Overview: src2/workflows/workflow-history.ee/workflow-history-manager.ee.ts provides workflow orchestration support, from lookup and loading to execution services.

How it works: These components interact with node types, static data, sharing, and history, preparing validated workflow representations for execution or editing.

Why it’s designed this way: Keeping orchestration separate from execution makes the system easier to reason about and evolve without coupling UI/editor concerns to runtime.

This component follows sv’s dependency-injection and modular architecture to keep responsibilities focused and testable. Decorators (e.g., @Service, @RestController, @Command) make wiring explicit while deferring lifecycle and registration to the container.
