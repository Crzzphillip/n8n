## src2/public-api/v1/handlers/workflows/spec/paths/workflows.id.tags.yml

Overview: src2/public-api/v1/handlers/workflows/spec/paths/workflows.id.tags.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/workflows/spec/paths/workflows.id.tags.yml` and use the following source:

```yaml
get:
  x-eov-operation-id: getWorkflowTags
  x-eov-operation-handler: v1/handlers/workflows/workflows.handler
  tags:
    - Workflow
  summary: Get workflow tags
  description: Get workflow tags.
  parameters:
    - $ref: '../schemas/parameters/workflowId.yml'
  responses:
    '200':
      description: List of tags
      content:
        application/json:
          schema:
            $ref: '../schemas/workflowTags.yml'
    '400':
      $ref: '../../../../shared/spec/responses/badRequest.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'
put:
  x-eov-operation-id: updateWorkflowTags
  x-eov-operation-handler: v1/handlers/workflows/workflows.handler
  tags:
    - Workflow
  summary: Update tags of a workflow
  description: Update tags of a workflow.
  parameters:
    - $ref: '../schemas/parameters/workflowId.yml'
  requestBody:
    description: List of tags
    content:
      application/json:
        schema:
            $ref: '../schemas/tagIds.yml'
    required: true
  responses:
    '200':
      description: List of tags after add the tag
      content:
        application/json:
          schema:
            $ref: '../schemas/workflowTags.yml'
    '400':
      $ref: '../../../../shared/spec/responses/badRequest.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'
```
