## src2/public-api/v1/handlers/executions/spec/schemas/execution.yml

Overview: src2/public-api/v1/handlers/executions/spec/schemas/execution.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/executions/spec/schemas/execution.yml` and use the following source:

```yaml
type: object
properties:
  id:
    type: number
    example: 1000
  data:
    type: object
  finished:
    type: boolean
    example: true
  mode:
    type: string
    enum: ['cli', 'error', 'integrated', 'internal', 'manual', 'retry', 'trigger', 'webhook']
  retryOf:
    type: number
    nullable: true
  retrySuccessId:
    type: number
    nullable: true
    example: '2'
  startedAt:
    type: string
    format: date-time
  stoppedAt:
    type: string
    format: date-time
  workflowId:
    type: number
    example: '1000'
  waitTill:
    type: string
    nullable: true
    format: date-time
  customData:
    type: object

```
