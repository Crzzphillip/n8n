## src2/public-api/v1/handlers/source-control/spec/paths/sourceControl.yml

Overview: src2/public-api/v1/handlers/source-control/spec/paths/sourceControl.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/source-control/spec/paths/sourceControl.yml` and use the following source:

```yaml
post:
  x-eov-operation-id: pull
  x-eov-operation-handler: v1/handlers/source-control/source-control.handler
  tags:
    - SourceControl
  summary: Pull changes from the remote repository
  description: Requires the Source Control feature to be licensed and connected to a repository.
  requestBody:
    description: Pull options
    required: true
    content:
      application/json:
        schema:
          $ref: '../schemas/pull.yml'
  responses:
    '200':
      description: Import result
      content:
        application/json:
          schema:
            $ref: '../schemas/importResult.yml'
    '400':
      $ref: '../../../../shared/spec/responses/badRequest.yml'
    '409':
      $ref: '../../../../shared/spec/responses/conflict.yml'

```
