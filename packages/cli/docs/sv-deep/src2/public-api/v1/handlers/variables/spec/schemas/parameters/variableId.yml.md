## src2/public-api/v1/handlers/variables/spec/schemas/parameters/variableId.yml

Overview: src2/public-api/v1/handlers/variables/spec/schemas/parameters/variableId.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/variables/spec/schemas/parameters/variableId.yml` and use the following source:

```yaml
name: id
in: path
description: The ID of the variable.
required: true
schema:
  type: string

```
