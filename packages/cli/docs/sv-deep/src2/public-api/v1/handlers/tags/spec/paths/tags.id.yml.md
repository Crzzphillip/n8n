## src2/public-api/v1/handlers/tags/spec/paths/tags.id.yml

Overview: src2/public-api/v1/handlers/tags/spec/paths/tags.id.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/tags/spec/paths/tags.id.yml` and use the following source:

```yaml
get:
  x-eov-operation-id: getTag
  x-eov-operation-handler: v1/handlers/tags/tags.handler
  tags:
    - Tags
  summary: Retrieves a tag
  description: Retrieves a tag.
  parameters:
    - $ref: '../schemas/parameters/tagId.yml'
  responses:
    '200':
      description: Operation successful.
      content:
        application/json:
          schema:
            $ref: '../schemas/tag.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'
delete:
  x-eov-operation-id: deleteTag
  x-eov-operation-handler: v1/handlers/tags/tags.handler
  tags:
    - Tags
  summary: Delete a tag
  description: Deletes a tag.
  parameters:
    - $ref: '../schemas/parameters/tagId.yml'
  responses:
    '200':
      description: Operation successful.
      content:
        application/json:
          schema:
            $ref: '../schemas/tag.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '403':
      $ref: '../../../../shared/spec/responses/forbidden.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'
put:
  x-eov-operation-id: updateTag
  x-eov-operation-handler: v1/handlers/tags/tags.handler
  tags:
    - Tags
  summary: Update a tag
  description: Update a tag.
  parameters:
    - $ref: '../schemas/parameters/tagId.yml'
  requestBody:
    description: Updated tag object.
    content:
      application/json:
        schema:
          $ref: '../schemas/tag.yml'
    required: true
  responses:
    '200':
      description: Tag object
      content:
        application/json:
          schema:
            $ref: '../schemas/tag.yml'
    '400':
      $ref: '../../../../shared/spec/responses/badRequest.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'
    '409':
      $ref: '../../../../shared/spec/responses/conflict.yml'
```
