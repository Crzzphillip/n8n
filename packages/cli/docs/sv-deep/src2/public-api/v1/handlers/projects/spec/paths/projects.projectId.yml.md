## src2/public-api/v1/handlers/projects/spec/paths/projects.projectId.yml

Overview: src2/public-api/v1/handlers/projects/spec/paths/projects.projectId.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/projects/spec/paths/projects.projectId.yml` and use the following source:

```yaml
delete:
  x-eov-operation-id: deleteProject
  x-eov-operation-handler: v1/handlers/projects/projects.handler
  tags:
    - Projects
  summary: Delete a project
  description: Delete a project from your instance.
  parameters:
    - in: path
      name: projectId
      description: The ID of the project.
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
put:
  x-eov-operation-id: updateProject
  x-eov-operation-handler: v1/handlers/projects/projects.handler
  tags:
    - Projects
  summary: Update a project
  description: Update a project on your instance.
  parameters:
    - in: path
      name: projectId
      description: The ID of the project.
      required: true
      schema:
        type: string
  requestBody:
    description: Updated project object.
    content:
      application/json:
        schema:
          $ref: '../schemas/project.yml'
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
