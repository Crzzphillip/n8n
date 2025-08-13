## src2/public-api/v1/handlers/variables/spec/paths/variables.yml

Overview: src2/public-api/v1/handlers/variables/spec/paths/variables.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/variables/spec/paths/variables.yml` and use the following source:

```yaml
post:
  x-eov-operation-id: createVariable
  x-eov-operation-handler: v1/handlers/variables/variables.handler
  tags:
    - Variables
  summary: Create a variable
  description: Create a variable in your instance.
  requestBody:
    description: Payload for variable to create.
    content:
      application/json:
        schema:
          $ref: '../schemas/variable.yml'
    required: true
  responses:
    '201':
      description: Operation successful.
    '400':
      $ref: '../../../../shared/spec/responses/badRequest.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
get:
  x-eov-operation-id: getVariables
  x-eov-operation-handler: v1/handlers/variables/variables.handler
  tags:
    - Variables
  summary: Retrieve variables
  description: Retrieve variables from your instance.
  parameters:
    - $ref: '../../../../shared/spec/parameters/limit.yml'
    - $ref: '../../../../shared/spec/parameters/cursor.yml'
  responses:
    '200':
      description: Operation successful.
      content:
        application/json:
          schema:
            $ref: '../schemas/variableList.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'

```
