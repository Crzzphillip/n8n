## src2/public-api/v1/handlers/credentials/spec/paths/credentials.id.yml

Overview: src2/public-api/v1/handlers/credentials/spec/paths/credentials.id.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/credentials/spec/paths/credentials.id.yml` and use the following source:

```yaml
delete:
  x-eov-operation-id: deleteCredential
  x-eov-operation-handler: v1/handlers/credentials/credentials.handler
  tags:
    - Credential
  summary: Delete credential by ID
  description: Deletes a credential from your instance. You must be the owner of the credentials
  operationId: deleteCredential
  parameters:
    - name: id
      in: path
      description: The credential ID that needs to be deleted
      required: true
      schema:
        type: string
  responses:
    '200':
      description: Operation successful.
      content:
        application/json:
          schema:
            $ref: '../schemas/credential.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'

```
