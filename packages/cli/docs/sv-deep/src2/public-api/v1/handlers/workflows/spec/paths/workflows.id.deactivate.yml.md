## src2/public-api/v1/handlers/workflows/spec/paths/workflows.id.deactivate.yml

Overview: src2/public-api/v1/handlers/workflows/spec/paths/workflows.id.deactivate.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/workflows/spec/paths/workflows.id.deactivate.yml` and use the following source:

```yaml
post:
  x-eov-operation-id: deactivateWorkflow
  x-eov-operation-handler: v1/handlers/workflows/workflows.handler
  tags:
    - Workflow
  summary: Deactivate a workflow
  description: Deactivate a workflow.
  parameters:
    - $ref: '../schemas/parameters/workflowId.yml'
  responses:
    '200':
      description: Workflow object
      content:
        application/json:
          schema:
            $ref: '../schemas/workflow.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'

```
