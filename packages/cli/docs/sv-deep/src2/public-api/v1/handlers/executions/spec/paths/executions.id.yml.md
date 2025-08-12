## src2/public-api/v1/handlers/executions/spec/paths/executions.id.yml

Overview: src2/public-api/v1/handlers/executions/spec/paths/executions.id.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/executions/spec/paths/executions.id.yml` and use the following source:

```yaml
get:
  x-eov-operation-id: getExecution
  x-eov-operation-handler: v1/handlers/executions/executions.handler
  tags:
    - Execution
  summary: Retrieve an execution
  description: Retrieve an execution from your instance.
  parameters:
    - $ref: '../schemas/parameters/executionId.yml'
    - $ref: '../schemas/parameters/includeData.yml'
  responses:
    '200':
      description: Operation successful.
      content:
        application/json:
          schema:
            $ref: '../schemas/execution.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'
delete:
  x-eov-operation-id: deleteExecution
  x-eov-operation-handler: v1/handlers/executions/executions.handler
  tags:
    - Execution
  summary: Delete an execution
  description: Deletes an execution from your instance.
  parameters:
    - $ref: '../schemas/parameters/executionId.yml'
  responses:
    '200':
      description: Operation successful.
      content:
        application/json:
          schema:
            $ref: '../schemas/execution.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'

```
