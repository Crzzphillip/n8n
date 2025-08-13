## src2/public-api/v1/handlers/credentials/spec/schemas/create-credential-response.yml

Overview: src2/public-api/v1/handlers/credentials/spec/schemas/create-credential-response.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/credentials/spec/schemas/create-credential-response.yml` and use the following source:

```yaml
required:
  - id
  - name
  - type
  - createdAt
  - updatedAt
type: object
properties:
  id:
    type: string
    readOnly: true
    example: vHxaz5UaCghVYl9C
  name:
    type: string
    example: John's Github account
  type:
    type: string
    example: github
  createdAt:
    type: string
    format: date-time
    readOnly: true
    example: '2022-04-29T11:02:29.842Z'
  updatedAt:
    type: string
    format: date-time
    readOnly: true
    example: '2022-04-29T11:02:29.842Z'

```
