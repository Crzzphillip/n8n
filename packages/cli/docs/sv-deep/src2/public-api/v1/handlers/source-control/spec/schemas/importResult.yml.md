## src2/public-api/v1/handlers/source-control/spec/schemas/importResult.yml

Overview: src2/public-api/v1/handlers/source-control/spec/schemas/importResult.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/source-control/spec/schemas/importResult.yml` and use the following source:

```yaml
type: object
additionalProperties: true
properties:
  variables:
    type: object
    properties:
      added:
        type: array
        items:
          type: string
      changed:
        type: array
        items:
          type: string
  credentials:
    type: array
    items:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        type:
          type: string
  workflows:
    type: array
    items:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
  tags:
    type: object
    properties:
      tags:
        type: array
        items:
          type: object
          properties:
            id:
              type: string
            name:
              type: string
      mappings:
        type: array
        items:
          type: object
          properties:
            workflowId:
              type: string
            tagId:
              type: string

```
