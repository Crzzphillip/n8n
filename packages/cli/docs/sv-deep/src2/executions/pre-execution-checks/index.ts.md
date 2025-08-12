## src2/executions/pre-execution-checks/index.ts

Overview: src2/executions/pre-execution-checks/index.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/executions/pre-execution-checks/index.ts` and use the following source:

```ts
export { CredentialsPermissionChecker } from './credentials-permission-checker';
export { SubworkflowPolicyChecker } from './subworkflow-policy-checker';

```
