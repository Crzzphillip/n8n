## src2/public-api/v1/shared/spec/schemas/_index.yml

Overview: src2/public-api/v1/shared/spec/schemas/_index.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/shared/spec/schemas/_index.yml` and use the following source:

```yaml
Error:
  $ref: './error.yml'
Role:
  $ref: './../../../handlers/users/spec/schemas/role.yml'
Execution:
  $ref: './../../../handlers/executions/spec/schemas/execution.yml'
Node:
  $ref: './../../../handlers/workflows/spec/schemas/node.yml'
Tag:
  $ref: './../../../handlers/tags/spec/schemas/tag.yml'
Workflow:
  $ref: './../../../handlers/workflows/spec/schemas/workflow.yml'
WorkflowSettings:
  $ref: './../../../handlers/workflows/spec/schemas/workflowSettings.yml'
ExecutionList:
  $ref: './../../../handlers/executions/spec/schemas/executionList.yml'
WorkflowList:
  $ref: './../../../handlers/workflows/spec/schemas/workflowList.yml'
Credential:
  $ref: './../../../handlers/credentials/spec/schemas/credential.yml'
CredentialType:
  $ref: './../../../handlers/credentials/spec/schemas/credentialType.yml'
Audit:
  $ref: './../../../handlers/audit/spec/schemas/audit.yml'
Pull:
  $ref: './../../../handlers/source-control/spec/schemas/pull.yml'
ImportResult:
  $ref: './../../../handlers/source-control/spec/schemas/importResult.yml'
UserList:
  $ref: './../../../handlers/users/spec/schemas/userList.yml'
User:
  $ref: './../../../handlers/users/spec/schemas/user.yml'

```
