## src2/public-api/v1/handlers/credentials/spec/paths/credentials.yml

Overview: src2/public-api/v1/handlers/credentials/spec/paths/credentials.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/credentials/spec/paths/credentials.yml` and use the following source:

```yaml
post:
  x-eov-operation-id: createCredential
  x-eov-operation-handler: v1/handlers/credentials/credentials.handler
  tags:
    - Credential
  summary: Create a credential
  description: Creates a credential that can be used by nodes of the specified type.
  requestBody:
    description: Credential to be created.
    required: true
    content:
      application/json:
        schema:
          $ref: '../schemas/credential.yml'
  responses:
    '200':
      description: Operation successful.
      content:
        application/json:
          schema:
            $ref: '../schemas/create-credential-response.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '415':
      description: Unsupported media type.

```
