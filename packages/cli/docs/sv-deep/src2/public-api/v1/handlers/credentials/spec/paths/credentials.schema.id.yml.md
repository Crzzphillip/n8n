## src2/public-api/v1/handlers/credentials/spec/paths/credentials.schema.id.yml

Overview: src2/public-api/v1/handlers/credentials/spec/paths/credentials.schema.id.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/credentials/spec/paths/credentials.schema.id.yml` and use the following source:

```yaml
get:
  x-eov-operation-id: getCredentialType
  x-eov-operation-handler: v1/handlers/credentials/credentials.handler
  tags:
    - Credential
  summary: Show credential data schema
  parameters:
    - name: credentialTypeName
      in: path
      description: The credential type name that you want to get the schema for
      required: true
      schema:
        type: string
  responses:
    '200':
      description: Operation successful.
      content:
        application/json:
          schema:
            type: object
          examples:
            freshdeskApi:
              value:
                additionalProperties: false
                type: 'object'
                properties: { apiKey: { type: 'string' }, domain: { type: 'string' } }
                required: ['apiKey', 'domain']
            slackOAuth2Api:
              value:
                additionalProperties: false
                type: 'object'
                properties: { clientId: { type: 'string' }, clientSecret: { type: 'string' } }
                required: ['clientId', 'clientSecret']
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '404':
      $ref: '../../../../shared/spec/responses/notFound.yml'

```
