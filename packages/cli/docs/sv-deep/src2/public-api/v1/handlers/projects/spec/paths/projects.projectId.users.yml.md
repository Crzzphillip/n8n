## src2/public-api/v1/handlers/projects/spec/paths/projects.projectId.users.yml

Overview: src2/public-api/v1/handlers/projects/spec/paths/projects.projectId.users.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/projects/spec/paths/projects.projectId.users.yml` and use the following source:

```yaml
post:
  x-eov-operation-id: addUsersToProject
  x-eov-operation-handler: v1/handlers/projects/projects.handler
  tags:
    - Projects
  summary: Add one or more users to a project
  description: Add one or more users to a project on your instance.
  parameters:
    - name: projectId
      in: path
      description: The ID of the project.
      required: true
      schema:
        type: string
  requestBody:
    description: Payload containing an array of one or more users to add to the project.
    content:
      application/json:
        schema:
          type: object
          properties:
            relations:
              type: array
              description: A list of userIds and roles to add to the project.
              items:
                type: object
                properties:
                  userId:
                    type: string
                    description: The unique identifier of the user.
                    example: '91765f0d-3b29-45df-adb9-35b23937eb92'
                  role:
                    type: string
                    description: The role assigned to the user in the project.
                    example: 'project:viewer'
                required:
                  - userId
                  - role
          required:
            - relations
  responses:
    '201':
      description: Operation successful.
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '403':
      $ref: '../../../../shared/spec/responses/forbidden.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'

```
