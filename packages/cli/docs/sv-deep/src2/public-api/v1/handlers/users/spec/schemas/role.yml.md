## src2/public-api/v1/handlers/users/spec/schemas/role.yml

Overview: src2/public-api/v1/handlers/users/spec/schemas/role.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/users/spec/schemas/role.yml` and use the following source:

```yaml
readOnly: true
type: object
properties:
  id:
    type: number
    readOnly: true
    example: 1
  name:
    type: string
    example: owner
    readOnly: true
  scope:
    type: string
    readOnly: true
    example: global
  createdAt:
    type: string
    description: Time the role was created.
    format: date-time
    readOnly: true
  updatedAt:
    type: string
    description: Last time the role was updated.
    format: date-time
    readOnly: true

```
