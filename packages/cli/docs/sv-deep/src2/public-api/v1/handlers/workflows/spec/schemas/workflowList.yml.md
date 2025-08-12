## src2/public-api/v1/handlers/workflows/spec/schemas/workflowList.yml

Overview: src2/public-api/v1/handlers/workflows/spec/schemas/workflowList.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/workflows/spec/schemas/workflowList.yml` and use the following source:

```yaml
type: object
properties:
  data:
    type: array
    items:
      $ref: './workflow.yml'
  nextCursor:
    type: string
    description: Paginate through workflows by setting the cursor parameter to a nextCursor attribute returned by a previous request. Default value fetches the first "page" of the collection.
    nullable: true
    example: MTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDA

```
