## Webhooks

Directories: `src/webhooks`, `src/controllers`

### Components
- `webhook.service.ts`: core service to register, store, find, and execute webhooks.
- `webhook-helpers.ts`: parse, sanitize, and extract webhook inputs/outputs; manage test/live modes; waiting webhooks and forms.
- `webhooks.controller.ts`: minimal controller exposing `POST /webhooks/find` to locate a webhook by path and method.

### Lifecycle
- During activation, `ActiveWorkflowManager.addWebhooks()` extracts webhook definitions from a `Workflow` and registers them through `WebhookService`, persisting metadata.
- At runtime, incoming HTTP requests are matched to stored webhook definitions and dispatched to the correct workflow and node.
- Test webhooks and waiting webhooks are supported for development and manual runs.

### Why this design works
- Central registration prevents drift and ensures idempotent provisioning across restarts.
- Clear separation between storage (DB), resolution (service), and transport (controllers/middlewares).