## src2/public-api/v1/handlers/audit/spec/paths/audit.yml

Overview: src2/public-api/v1/handlers/audit/spec/paths/audit.yml is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Recreate

Place this file at `src2/public-api/v1/handlers/audit/spec/paths/audit.yml` and use the following source:

```yaml
post:
  x-eov-operation-id: generateAudit
  x-eov-operation-handler: v1/handlers/audit/audit.handler
  tags:
    - Audit
  summary: Generate an audit
  description: Generate a security audit for your sv instance.
  requestBody:
    required: false
    content:
      application/json:
        schema:
          type: object
          properties:
            additionalOptions:
              type: object
              properties:
                daysAbandonedWorkflow:
                  type: integer
                  description: Days for a workflow to be considered abandoned if not executed
                categories:
                  type: array
                  items:
                    type: string
                    enum: ['credentials', 'database', 'nodes', 'filesystem', 'instance']
  responses:
    '200':
      description: Operation successful.
      content:
        application/json:
          schema:
            $ref: '../schemas/audit.yml'
    '401':
      $ref: '../../../../shared/spec/responses/unauthorized.yml'
    '500':
      description: Internal server error.

```
