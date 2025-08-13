## src2/public-api/v1/handlers/projects/spec/paths/projects.projectId.users.userId.yml

Overview: src2/public-api/v1/handlers/projects/spec/paths/projects.projectId.users.userId.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/projects/spec/paths/projects.projectId.users.userId.yml` and use the following source:

```yaml
delete:
  x-eov-operation-id: deleteUserFromProject
  x-eov-operation-handler: v1/handlers/projects/projects.handler
  tags:
    - Projects
  summary: Delete a user from a project
  description: Delete a user from a project on your instance.
  parameters:
    - name: projectId
      in: path
      description: The ID of the project.
      required: true
      schema:
        type: string
    - name: userId
      in: path
      description: The ID of the user.
      required: true
      schema:
        type: string
  responses:
    '204':
      description: Operation successful.
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '403':
      $ref: '../../../../shared/spec/responses/forbidden.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'
patch:
  x-eov-operation-id: changeUserRoleInProject
  x-eov-operation-handler: v1/handlers/projects/projects.handler
  tags:
    - Projects
  summary: Change a user's role in a project
  description: Change a user's role in a project.
  parameters:
    - name: projectId
      in: path
      description: The ID of the project.
      required: true
      schema:
        type: string
    - name: userId
      in: path
      description: The ID of the user.
      required: true
      schema:
        type: string
  requestBody:
    description: Payload containing the new role to assign to the project user.
    content:
      application/json:
        schema:
          type: object
          properties:
            role:
              type: string
              description: The role assigned to the user in the project.
              example: 'project:viewer'
          required:
            - role
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
