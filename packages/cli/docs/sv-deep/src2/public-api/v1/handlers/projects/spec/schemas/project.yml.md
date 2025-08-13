## src2/public-api/v1/handlers/projects/spec/schemas/project.yml

Overview: src2/public-api/v1/handlers/projects/spec/schemas/project.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/projects/spec/schemas/project.yml` and use the following source:

```yaml
type: object
additionalProperties: false
required:
  - name
properties:
  id:
    type: string
    readOnly: true
  name:
    type: string
  type:
    type: string
    readOnly: true

```
