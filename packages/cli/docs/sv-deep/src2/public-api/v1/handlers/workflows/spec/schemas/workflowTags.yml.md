## src2/public-api/v1/handlers/workflows/spec/schemas/workflowTags.yml

Overview: src2/public-api/v1/handlers/workflows/spec/schemas/workflowTags.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/workflows/spec/schemas/workflowTags.yml` and use the following source:

```yaml
type: array
items:
  $ref: '../../../tags/spec/schemas/tag.yml'

```
