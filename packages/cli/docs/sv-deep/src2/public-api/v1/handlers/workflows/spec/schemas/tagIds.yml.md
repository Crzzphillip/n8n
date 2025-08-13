## src2/public-api/v1/handlers/workflows/spec/schemas/tagIds.yml

Overview: src2/public-api/v1/handlers/workflows/spec/schemas/tagIds.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/workflows/spec/schemas/tagIds.yml` and use the following source:

```yaml
type: array
items:
  type: object
  additionalProperties: false
  required:
    - id
  properties:
    id:
      type: string
      example: 2tUt1wbLX592XDdX
```
