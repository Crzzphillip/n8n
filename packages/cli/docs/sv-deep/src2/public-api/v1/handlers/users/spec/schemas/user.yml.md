## src2/public-api/v1/handlers/users/spec/schemas/user.yml

Overview: src2/public-api/v1/handlers/users/spec/schemas/user.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/users/spec/schemas/user.yml` and use the following source:

```yaml
required:
  - email
type: object
properties:
  id:
    type: string
    readOnly: true
    example: 123e4567-e89b-12d3-a456-426614174000
  email:
    type: string
    format: email
    example: john.doe@company.com
  firstName:
    maxLength: 32
    type: string
    description: User's first name
    readOnly: true
    example: john
  lastName:
    maxLength: 32
    type: string
    description: User's last name
    readOnly: true
    example: Doe
  isPending:
    type: boolean
    description: Whether the user finished setting up their account in response to the invitation (true) or not (false).
    readOnly: true
  createdAt:
    type: string
    description: Time the user was created.
    format: date-time
    readOnly: true
  updatedAt:
    type: string
    description: Last time the user was updated.
    format: date-time
    readOnly: true
  role:
    type: string
    example: owner
    readOnly: true

```
