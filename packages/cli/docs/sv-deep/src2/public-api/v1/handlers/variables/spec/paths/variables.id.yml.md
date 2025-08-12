## src2/public-api/v1/handlers/variables/spec/paths/variables.id.yml

Overview: src2/public-api/v1/handlers/variables/spec/paths/variables.id.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/variables/spec/paths/variables.id.yml` and use the following source:

```yaml
delete:
  x-eov-operation-id: deleteVariable
  x-eov-operation-handler: v1/handlers/variables/variables.handler
  tags:
    - Variables
  summary: Delete a variable
  description: Delete a variable from your instance.
  parameters:
    - $ref: '../schemas/parameters/variableId.yml'
  responses:
    '204':
      description: Operation successful.
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'

put:
  x-eov-operation-id: updateVariable
  x-eov-operation-handler: v1/handlers/variables/variables.handler
  tags:
    - Variables
  summary: Update a variable
  description: Update a variable from your instance.
  requestBody:
    description: Payload for variable to update.
    content:
      application/json:
        schema:
          $ref: '../schemas/variable.yml'
    required: true
  responses:
    '204':
      description: Operation successful.
    '400':
      $ref: '../../../../shared/spec/responses/badRequest.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '403':
      $ref: '../../../../shared/spec/responses/forbidden.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'

```
