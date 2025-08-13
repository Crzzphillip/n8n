## src2/public-api/v1/handlers/tags/spec/schemas/tag.yml

Overview: src2/public-api/v1/handlers/tags/spec/schemas/tag.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/tags/spec/schemas/tag.yml` and use the following source:

```yaml
type: object
additionalProperties: false
required:
  - name
properties:
  id:
    type: string
    readOnly: true
    example: 2tUt1wbLX592XDdX
  name:
    type: string
    example: Production
  createdAt:
    type: string
    format: date-time
    readOnly: true
  updatedAt:
    type: string
    format: date-time
    readOnly: true

```
