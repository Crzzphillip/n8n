## src2/public-api/v1/handlers/workflows/spec/schemas/workflowSettings.yml

Overview: src2/public-api/v1/handlers/workflows/spec/schemas/workflowSettings.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/workflows/spec/schemas/workflowSettings.yml` and use the following source:

```yaml
type: object
additionalProperties: false
properties:
  saveExecutionProgress:
    type: boolean
  saveManualExecutions:
    type: boolean
  saveDataErrorExecution:
    type: string
    enum: ['all', 'none']
  saveDataSuccessExecution:
    type: string
    enum: ['all', 'none']
  executionTimeout:
    type: number
    example: 3600
    maxLength: 3600
  errorWorkflow:
    type: string
    example: 'VzqKEW0ShTXA5vPj'
    description: The ID of the workflow that contains the error trigger node.
  timezone:
    type: string
    example: America/New_York
  executionOrder:
    type: string
    example: v1

```
