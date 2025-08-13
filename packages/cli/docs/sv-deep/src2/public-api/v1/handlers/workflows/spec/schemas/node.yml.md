## src2/public-api/v1/handlers/workflows/spec/schemas/node.yml

Overview: src2/public-api/v1/handlers/workflows/spec/schemas/node.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/workflows/spec/schemas/node.yml` and use the following source:

```yaml
type: object
additionalProperties: false
properties:
  id:
    type: string
    example: 0f5532f9-36ba-4bef-86c7-30d607400b15
  name:
    type: string
    example: Jira
  webhookId:
    type: string
  disabled:
    type: boolean
  notesInFlow:
    type: boolean
  notes:
    type: string
  type:
    type: string
    example: n8n-nodes-base.Jira
  typeVersion:
    type: number
    example: 1
  executeOnce:
    type: boolean
    example: false
  alwaysOutputData:
    type: boolean
    example: false
  retryOnFail:
    type: boolean
    example: false
  maxTries:
    type: number
  waitBetweenTries:
    type: number
  continueOnFail:
    type: boolean
    example: false
    description: 'use onError instead'
    deprecated: true
  onError:
    type: string
    example: 'stopWorkflow'
  position:
    type: array
    items:
      type: number
    example: [-100, 80]
  parameters:
    type: object
    example: { additionalProperties: {} }
  credentials:
    type: object
    example: { jiraSoftwareCloudApi: { id: '35', name: 'jiraApi' } }
  createdAt:
    type: string
    format: date-time
    readOnly: true
  updatedAt:
    type: string
    format: date-time
    readOnly: true

```
