## src2/public-api/v1/handlers/users/spec/paths/users.yml

Overview: src2/public-api/v1/handlers/users/spec/paths/users.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/users/spec/paths/users.yml` and use the following source:

```yaml
get:
  x-eov-operation-id: getUsers
  x-eov-operation-handler: v1/handlers/users/users.handler.ee
  tags:
    - User
  summary: Retrieve all users
  description: Retrieve all users from your instance. Only available for the instance owner.
  parameters:
    - $ref: '../../../../shared/spec/parameters/limit.yml'
    - $ref: '../../../../shared/spec/parameters/cursor.yml'
    - $ref: '../schemas/parameters/includeRole.yml'
    - name: projectId
      in: query
      required: false
      explode: false
      allowReserved: true
      schema:
        type: string
        example: VmwOO9HeTEj20kxM
  responses:
    '200':
      description: Operation successful.
      content:
        application/json:
          schema:
            $ref: '../schemas/userList.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
post:
  x-eov-operation-id: createUser
  x-eov-operation-handler: v1/handlers/users/users.handler.ee
  tags:
    - User
  summary: Create multiple users
  description: Create one or more users.
  requestBody:
    description: Array of users to be created.
    required: true
    content:
      application/json:
        schema:
          type: array
          items:
            type: object
            properties:
              email:
                type: string
                format: email
              role:
                type: string
                enum: [global:admin, global:member]
            required:
              - email
  responses:
    '200':
      description: Operation successful.
      content:
        application/json:
          schema:
            type: object
            properties:
              user:
                type: object
                properties:
                  id:
                    type: string
                  email:
                    type: string
                  inviteAcceptUrl:
                    type: string
                  emailSent:
                    type: boolean
              error:
                type: string
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '403':
      $ref: '../../../../shared/spec/responses/forbidden.yml'

```
