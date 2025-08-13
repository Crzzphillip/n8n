## Configuration

- `@n8n/config` provides structured configuration loaded via env vars.
- `GlobalConfig` and `SecurityConfig` are resolved from DI and used across the server and commands.
- Important surfaces:
  - `endpoints` (REST base path, metrics, UI toggles, preset credentials endpoint)
  - `publicApi` (enabled, path)
  - `nodes` (community packages, include/exclude lists)
  - `executions` (mode: `regular` or `queue`, timeout, max timeout)
  - `taskRunners` (enabled, insecureMode)
  - `sentry` (dsn, environment, release, deployment name)
  - `binaryData` and object store (external S3 mode)

### Why this design works
- Central, typed config keeps behavior predictable across commands and environments while allowing conditional module loading.