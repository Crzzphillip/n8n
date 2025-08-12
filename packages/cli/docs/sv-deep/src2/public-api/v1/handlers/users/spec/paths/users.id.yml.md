## src2/public-api/v1/handlers/users/spec/paths/users.id.yml

Overview: src2/public-api/v1/handlers/users/spec/paths/users.id.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/users/spec/paths/users.id.yml` and use the following source:

```yaml
get:
  x-eov-operation-id: getUser
  x-eov-operation-handler: v1/handlers/users/users.handler.ee
  tags:
    - User
  summary: Get user by ID/Email
  description: Retrieve a user from your instance. Only available for the instance owner.
  parameters:
    - $ref: '../schemas/parameters/userIdentifier.yml'
    - $ref: '../schemas/parameters/includeRole.yml'
  responses:
    '200':
      description: Operation successful.
      content:
        application/json:
          schema:
            $ref: '../schemas/user.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
delete:
  x-eov-operation-id: deleteUser
  x-eov-operation-handler: v1/handlers/users/users.handler.ee
  tags:
    - User
  summary: Delete a user
  description: Delete a user from your instance.
  parameters:
    - $ref: '../schemas/parameters/userIdentifier.yml'
  responses:
    '204':
      description: Operation successful.
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '403':
      $ref: '../../../../shared/spec/responses/forbidden.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'

```
