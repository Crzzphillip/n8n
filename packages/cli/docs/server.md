## Server lifecycle and HTTP surface

File: `src/server.ts`

### Responsibilities
- Initialize and configure the Express app (via `AbstractServer`).
- Register built-in and conditional controllers using `ControllerRegistry`.
- Serve the frontend UI and static assets, including dynamic icon and schema endpoints.
- Apply security headers with `helmet` and CSP settings from `SecurityConfig`.
- Initialize metrics (`PrometheusMetricsService`) and expose `/metrics` when enabled.
- Integrate Public API routers and advertise latest version to the frontend.
- Initialize Push (SSE/WebSocket) and collaboration features when available.
- Initialize Event Bus (`MessageEventBus`) and log streaming relay.
- Provide endpoints for options (`/options/timezones`) and settings (`/settings`, `/module-settings`).
- One-time preset credentials endpoint for bootstrapping.

### Controller registration
- Static imports at the top bring in core controllers (e.g., `executions`, `workflows`, `webhooks`).
- `registerAdditionalControllers()` conditionally loads controllers and initializes enterprise modules: LDAP, MFA, SAML, OIDC, Source Control, Variables, E2E, Community Packages.
- After dynamic imports, `ControllerRegistry.activate(app)` mounts all registered routes.

### Static UI and caching
- Prebuilt UI is served from `InstanceSettings.staticCacheDir` and `EDITOR_UI_DIST_DIR`.
- Icons and OpenAPI-like schemas are resolved per loaded node/credential via `LoadNodesAndCredentials` (`/icons/...`, `/schemas/...`).
- History API fallback serves `index.html` for non-API routes while respecting CSP.

### Security
- CSP directives are read from `SecurityConfig` and can be enforced or report-only.
- HSTS is enabled only when TLS is fully handled by n8n.
- UI routes apply caching selectively (e.g., `types/nodes.json` is no-cache).

### Metrics and telemetry
- `PrometheusMetricsService` attaches middleware to expose metrics.
- `PostHogClient` and `LogStreamingEventRelay` are initialized for telemetry and log streaming.

### Public API
- When enabled, `loadPublicApiVersions()` mounts versioned routers under the configured base path and updates frontend settings with `apiLatestVersion`.

### Push and collaboration
- `Push.setupPushHandler()` and `setupPushServer()` wire SSE/WebSocket backends.
- If bidirectional push is configured, collaboration service is initialized.