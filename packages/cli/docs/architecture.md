## Architecture

- **Monorepo context**: The CLI depends on shared packages (e.g., `@n8n/config`, `@n8n/db`, `n8n-core`, `n8n-workflow`), exposing runtime services and types.
- **Dependency Injection**: Uses `@n8n/di` and `@n8n/decorators` to register classes (`@Service`) and controllers (`@RestController`). The DI `Container` resolves components at runtime.
- **Server**: `src/server.ts` extends `AbstractServer` to build the Express app, register controllers, serve UI, set security headers, initialize metrics, public API, push connections, and event bus.
- **Controllers**: Files in `src/controllers` (and other feature folders) are side-effect imported in `src/server.ts` to register endpoints with the `ControllerRegistry`.
- **Commands**: `src/commands` defines CLI entrypoints (e.g., `start`, `execute`, `execute-batch`, `worker`). `base-command.ts` initializes core services (DB, error reporting, node loading, modules, task runners).
- **Workflows**: Runtime execution is orchestrated by `WorkflowRunner`, `ActiveWorkflowManager`, and services in `src/workflows` and `src/executions`.
- **Node and credential loading**: `load-nodes-and-credentials.ts` discovers, validates, and lazy-loads node/credential implementations from base packages, community packages, and custom directories.
- **Event bus**: `eventbus` and `events` provide event publication and relays (e.g., log streaming), initialized by the server.
- **Scaling**: `src/scaling` configures queue mode, workers, Redis, pub/sub, and multi-main.
- **Task Runners**: `src/task-runners` isolates long-running or isolated tasks, optionally started at boot.
- **Security and Auth**: Controllers and services in `src/auth`, `src/mfa`, `src/ldap.ee`, and SSO modules under `src/sso.ee` (loaded conditionally) manage auth flows.

### Data flow
- HTTP requests hit controllers -> services -> repositories/db, with telemetry and event relays.
- Workflow executions go through `WorkflowRunner` and `ActiveExecutions`, either inline (regular) or via queue (scaling), persisting state in the DB through `ExecutionRepository`.
- Webhooks are registered via `ActiveWorkflowManager` and resolved by `WebhookService`.

### Why this design works
- DI enables modular feature loading and conditional enterprise modules.
- Side-effect controller imports keep registration centralized while preserving code splitting.
- Queue mode isolates execution from request lifecycle and improves resilience and scalability.
- Lazy node loading keeps startup fast while supporting community/custom packages.