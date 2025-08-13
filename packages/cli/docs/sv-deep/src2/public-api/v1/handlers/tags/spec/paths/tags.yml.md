## src2/public-api/v1/handlers/tags/spec/paths/tags.yml

Overview: src2/public-api/v1/handlers/tags/spec/paths/tags.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/tags/spec/paths/tags.yml` and use the following source:

```yaml
post:
  x-eov-operation-id: createTag
  x-eov-operation-handler: v1/handlers/tags/tags.handler
  tags:
    - Tags
  summary: Create a tag
  description: Create a tag in your instance.
  requestBody:
    description: Created tag object.
    content:
      application/json:
        schema:
          $ref: '../schemas/tag.yml'
    required: true
  responses:
    '201':
      description: A tag object
      content:
        application/json:
          schema:
            $ref: '../schemas/tag.yml'
    '400':
      $ref: '../../../../shared/spec/responses/badRequest.yml'
    '409':
      $ref: '../../../../shared/spec/responses/conflict.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
get:
  x-eov-operation-id: getTags
  x-eov-operation-handler: v1/handlers/tags/tags.handler
  tags:
    - Tags
  summary: Retrieve all tags
  description: Retrieve all tags from your instance.
  parameters:
    - $ref: '../../../../shared/spec/parameters/limit.yml'
    - $ref: '../../../../shared/spec/parameters/cursor.yml'
  responses:
    '200':
      description: Operation successful.
      content:
        application/json:
          schema:
            $ref: '../schemas/tagList.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'

```
