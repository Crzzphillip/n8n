# n8n CLI Package Documentation

This folder provides an in-depth, page-by-page explanation of the `packages/cli` codebase: how it works, its internal architecture, and why design choices were made.

## Table of contents
- [Architecture](./architecture.md)
- [Startup and Shutdown Lifecycle](./startup-shutdown.md)
- [Server Lifecycle and HTTP Surface](./server.md)
- [Commands](./commands.md)
- [Workflow Runner](./workflow-runner.md)
- [Active Workflow Manager](./active-workflow-manager.md)
- [Node and Credential Loading](./load-nodes-and-credentials.md)
- [Executions](./executions.md)
- [Scaling (Queue, Workers, Pub/Sub)](./scaling.md)
- [Webhooks](./webhooks.md)
- [Public API](./public-api.md)
- [Task Runners](./task-runners.md)
- [Services](./services.md)
- [Events and Event Bus](./events.md)
- [Configuration](./configuration.md)

Each page references concrete files in `packages/cli/src` and explains their responsibilities and interactions.