## Startup and Shutdown Lifecycle

### Startup (via `BaseCommand` and `Start`)
- Initialize crash journal and error reporter with release metadata.
- Load nodes and credentials; connect to DB; run migrations.
- Validate shutdown service (dev/test); initialize server and modules (community packages, task runners, telemetry).
- `Start` command:
  - Generate static UI assets with base path rewrites.
  - Initialize server (`Server.start()`), active workflows, wait trackers, pub/sub or multi-main.
  - Optionally open the browser.

### Shutdown
- `Start.stopProcess()` gracefully removes queued activations and active workflows, stops wait tracker, runs external hooks, shuts down multi-main, pub/sub, and active executions, and finally closes `MessageEventBus`.
- Ensures `exitSuccessFully()` cleans up crash journal and DB connection.

### Why this design works
- Predictable, ordered initialization across commands; careful teardown avoids dangling webhooks or stuck queue jobs.