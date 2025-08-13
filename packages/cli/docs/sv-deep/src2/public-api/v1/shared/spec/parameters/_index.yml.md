## src2/public-api/v1/shared/spec/parameters/_index.yml

Overview: src2/public-api/v1/shared/spec/parameters/_index.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/shared/spec/parameters/_index.yml` and use the following source:

```yaml
Cursor:
  $ref: './cursor.yml'
Limit:
  $ref: './limit.yml'
ExecutionId:
  $ref: '../../../handlers/executions/spec/schemas/parameters/executionId.yml'
WorkflowId:
  $ref: '../../../handlers/workflows/spec/schemas/parameters/workflowId.yml'
TagId:
  $ref: '../../../handlers/tags/spec/schemas/parameters/tagId.yml'
IncludeData:
  $ref: '../../../handlers/executions/spec/schemas/parameters/includeData.yml'
UserIdentifier:
  $ref: '../../../handlers/users/spec/schemas/parameters/userIdentifier.yml'
IncludeRole:
  $ref: '../../../handlers/users/spec/schemas/parameters/includeRole.yml'

```
