## src2/public-api/v1/handlers/credentials/spec/schemas/credentialType.yml

Overview: src2/public-api/v1/handlers/credentials/spec/schemas/credentialType.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/credentials/spec/schemas/credentialType.yml` and use the following source:

```yaml
type: object
properties:
  displayName:
    type: string
    readOnly: true
    example: Email
  name:
    type: string
    readOnly: true
    example: email
  type:
    type: string
    readOnly: true
    example: string
  default:
    type: string
    readOnly: true
    example: string

```
