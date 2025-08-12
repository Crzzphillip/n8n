## src2/public-api/v1/shared/spec/responses/_index.yml

Overview: src2/public-api/v1/shared/spec/responses/_index.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/shared/spec/responses/_index.yml` and use the following source:

```yaml
NotFound:
  $ref: './notFound.yml'
Unauthorized:
  $ref: './unauthorized.yml'
BadRequest:
  $ref: './badRequest.yml'
Conflict:
  $ref: './conflict.yml'
Forbidden:
  $ref: './forbidden.yml'

```
