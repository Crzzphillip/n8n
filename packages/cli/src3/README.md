# sv Next.js backend (src3)

This directory hosts a Next.js App Router backend that adapts the sv (formerly n8n) CLI `src2` runtime into server routes.

- All sv controllers from `src2` are registered via side-effect imports.
- An adapter translates Next.js requests into controller invocations using decorator metadata.
- Bootstrap initializes DI, DB, node/credential loaders, event bus, and telemetry.

Endpoints:
- `GET /api/health` — health check
- `ALL /api/[...sv]` — general dispatch to sv controllers under the configured REST base path
- `ALL /api/webhooks/[...path]` — prioritized webhook handling

Notes:
- Focus is backend; no frontend changes are included.
- AI builder enhancements can be layered as additional services/controllers in `src2` or `src3`.
