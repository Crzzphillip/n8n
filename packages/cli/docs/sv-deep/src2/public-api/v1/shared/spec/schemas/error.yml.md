## src2/public-api/v1/shared/spec/schemas/error.yml

Overview: src2/public-api/v1/shared/spec/schemas/error.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/shared/spec/schemas/error.yml` and use the following source:

```yaml
required:
  - message
type: object
properties:
  code:
    type: string
  message:
    type: string
  description:
    type: string

```
