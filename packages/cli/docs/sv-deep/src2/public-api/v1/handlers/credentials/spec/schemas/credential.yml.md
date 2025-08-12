## src2/public-api/v1/handlers/credentials/spec/schemas/credential.yml

Overview: src2/public-api/v1/handlers/credentials/spec/schemas/credential.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/credentials/spec/schemas/credential.yml` and use the following source:

```yaml
required:
  - name
  - type
  - data
type: object
properties:
  id:
    type: string
    readOnly: true
    example: R2DjclaysHbqn778
  name:
    type: string
    example: Joe's Github Credentials
  type:
    type: string
    example: github
  data:
    type: object
    writeOnly: true
    example: { token: 'ada612vad6fa5df4adf5a5dsf4389adsf76da7s' }
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
