## Public API

Directory: `src/public-api`

### Mounting and versioning
- `server.ts` calls `loadPublicApiVersions(publicApiEndpoint)` when the Public API is enabled in config.
- Returns `apiRouters` and `apiLatestVersion`, mounted under the configured base path, and exposed to the frontend via settings.
- `v1/` contains handlers and `swagger-theme.css` for documentation theming.

### Why this design works
- Keeps Public API modular and versioned, allowing the UI to discover the latest version and the server to mount multiple versions side-by-side.