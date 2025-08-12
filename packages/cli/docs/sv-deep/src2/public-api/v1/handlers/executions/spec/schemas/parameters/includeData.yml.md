## src2/public-api/v1/handlers/executions/spec/schemas/parameters/includeData.yml

Overview: src2/public-api/v1/handlers/executions/spec/schemas/parameters/includeData.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/executions/spec/schemas/parameters/includeData.yml` and use the following source:

```yaml
name: includeData
in: query
description: Whether or not to include the execution's detailed data.
required: false
schema:
  type: boolean

```
