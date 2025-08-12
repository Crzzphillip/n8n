## Commands

Directory: `src/commands`

### Command system
- Commands are classes decorated with `@Command({ name, description, examples, flagsSchema })`.
- `base-command.ts` provides the bootstrapping lifecycle and common concerns: error reporting (Sentry), DB connect and migrate, node/credential loading, module init, task runner boot, telemetry, and graceful shutdown handlers.
- Flags use `zod` schemas and are parsed/injected into `this.flags`.

### Base boot sequence (simplified)
1. Initialize crash journal and error reporter.
2. Initialize node/credential loaders and DB connection; run migrations.
3. Warn on unsupported setups (e.g., sqlite + queue mode).
4. Optionally initialize community packages and task runners.
5. Initialize telemetry and event relays.

### Notable commands
- `start.ts`
  - Boots the HTTP server, active workflows, test/prod webhooks, queue scaling, and UI assets.
  - Options: `--open` (auto-open browser), `--tunnel` (dev/test tunnel for webhooks), `--reinstallMissingPackages` (deprecated in favor of env var).
  - Generates static assets with path rewriting, initializes pub/sub and multi-main where configured, and handles graceful shutdown.
- `execute.ts`
  - Execute a single workflow locally (non-interactive) via `WorkflowRunner`.
- `execute-batch.ts`
  - Execute multiple workflows with concurrency controls, snapshotting, comparison, retries, and structured output. Integrates with `ActiveExecutions` and `WorkflowRunner`.
- `worker.ts`
  - Start a queue worker for offloaded executions in scaling mode.
- `webhook.ts`
  - Start a lightweight server focused on webhook handling.

### Command groups
- Subdirectories provide additional command families: `db`, `export`, `import`, `ldap`, `license`, `list`, `mfa`, `ttwf`, `update`, `user-management`.

### Why this design works
- Shared boot logic prevents drift across commands and ensures consistent initialization.
- Decorators + DI make commands testable and composable.