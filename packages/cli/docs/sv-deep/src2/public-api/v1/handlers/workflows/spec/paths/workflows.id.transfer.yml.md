## src2/public-api/v1/handlers/workflows/spec/paths/workflows.id.transfer.yml

Overview: src2/public-api/v1/handlers/workflows/spec/paths/workflows.id.transfer.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/workflows/spec/paths/workflows.id.transfer.yml` and use the following source:

```yaml
put:
  x-eov-operation-id: transferWorkflow
  x-eov-operation-handler: v1/handlers/workflows/workflows.handler
  tags:
    - Workflow
  summary: Transfer a workflow to another project.
  description: Transfer a workflow to another project.
  parameters:
    - $ref: '../schemas/parameters/workflowId.yml'
  requestBody:
    description: Destination project information for the workflow transfer.
    content:
      application/json:
        schema:
          type: object
          properties:
            destinationProjectId:
              type: string
              description: The ID of the project to transfer the workflow to.
          required:
            - destinationProjectId
    required: true
  responses:
    '200':
      description: Operation successful.
    '400':
      $ref: '../../../../shared/spec/responses/badRequest.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'

```
