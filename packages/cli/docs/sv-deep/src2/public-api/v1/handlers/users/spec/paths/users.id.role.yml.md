## src2/public-api/v1/handlers/users/spec/paths/users.id.role.yml

Overview: src2/public-api/v1/handlers/users/spec/paths/users.id.role.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/users/spec/paths/users.id.role.yml` and use the following source:

```yaml
patch:
  x-eov-operation-id: changeRole
  x-eov-operation-handler: v1/handlers/users/users.handler.ee
  tags:
    - User
  summary: Change a user's global role
  description: Change a user's global role
  parameters:
    - $ref: '../schemas/parameters/userIdentifier.yml'
  requestBody:
    description: New role for the user
    required: true
    content:
      application/json:
        schema:
          type: object
          properties:
            newRoleName:
              type: string
              enum: [global:admin, global:member]
          required:
            - newRoleName
  responses:
    '200':
      description: Operation successful.
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '403':
      $ref: '../../../../shared/spec/responses/forbidden.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'

```
