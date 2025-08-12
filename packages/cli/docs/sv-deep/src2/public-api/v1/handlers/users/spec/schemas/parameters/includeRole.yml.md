## src2/public-api/v1/handlers/users/spec/schemas/parameters/includeRole.yml

Overview: src2/public-api/v1/handlers/users/spec/schemas/parameters/includeRole.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/users/spec/schemas/parameters/includeRole.yml` and use the following source:

```yaml
name: includeRole
in: query
description: Whether to include the user's role or not.
required: false
schema:
  type: boolean
  example: true
  default: false

```
