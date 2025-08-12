## src2/public-api/v1/handlers/source-control/spec/schemas/pull.yml

Overview: src2/public-api/v1/handlers/source-control/spec/schemas/pull.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/source-control/spec/schemas/pull.yml` and use the following source:

```yaml
type: object
properties:
  force:
    type: boolean
    example: true
  variables:
    type: object
    example: { 'foo': 'bar' }

```
