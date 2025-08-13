## src2/public-api/v1/handlers/executions/spec/paths/executions.yml

Overview: src2/public-api/v1/handlers/executions/spec/paths/executions.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/executions/spec/paths/executions.yml` and use the following source:

```yaml
get:
  x-eov-operation-id: getExecutions
  x-eov-operation-handler: v1/handlers/executions/executions.handler
  tags:
    - Execution
  summary: Retrieve all executions
  description: Retrieve all executions from your instance.
  parameters:
    - $ref: '../schemas/parameters/includeData.yml'
    - name: status
      in: query
      description: Status to filter the executions by.
      required: false
      schema:
        type: string
        enum: ['error', 'success', 'waiting']
    - name: workflowId
      in: query
      description: Workflow to filter the executions by.
      required: false
      schema:
        type: string
        example: '1000'
    - name: projectId
      in: query
      required: false
      explode: false
      allowReserved: true
      schema:
        type: string
        example: VmwOO9HeTEj20kxM
    - $ref: '../../../../shared/spec/parameters/limit.yml'
    - $ref: '../../../../shared/spec/parameters/cursor.yml'
  responses:
    '200':
      description: Operation successful.
      content:
        application/json:
          schema:
            $ref: '../schemas/executionList.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'

```
