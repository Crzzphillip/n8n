## Services overview

Directory: `src/services`

### Notable services
- `frontend.service.ts`: computes and serves UI settings and module settings; supports type generation after preset credentials are set.
- `community-packages.service.ts`: installs and manages community node packages when enabled.
- `redis-client.service.ts`: provides Redis connections for features like scaling and caching.
- `ownership.service.ts`, `role.service.ts`, `user.service.ts`: project and user access control helpers.
- `hooks.service.ts`: bridges external hooks.
- `execution-metadata.service.ts`, `workflow-statistics.service.ts`: enrich execution data and collect workflow stats.
- `url.service.ts`: constructs canonical instance URLs for the UI and APIs.

### Why this design works
- Cohesive, single-responsibility services keep controllers thin and testable.
- Shared services unify cross-cutting concerns (Redis, hooks, URL building).