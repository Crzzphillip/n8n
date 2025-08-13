## Executions

Directories: `src/executions`, `src/execution-lifecycle`, `src/workflows`

### Components
- `WorkflowRunner`: orchestration for inline vs. queued runs; registration and finalization.
- `ActiveExecutions`: track running executions, attach response promises, handle cancellations, and provide post-execution hooks.
- `ExecutionRepository` (from `@n8n/db`): persist and query execution state and data.
- `ExecutionDataService`: shape run data and generate failed executions on pre-execution errors.
- `workflow-execution.service.ts`: service facade for starting and resuming workflow runs.
- Lifecycle hooks from `execution-lifecycle` integrate with UI push and status updates.

### Modes
- **regular**: executes in the main process; suitable for local/dev and manual runs.
- **queue**: offloads to workers via `ScalingService` and Bull queue; resilient to process failures and scalable horizontally.

### Streaming
- When `streamingEnabled`, the runner streams chunks to the HTTP response or UI push channel via lifecycle hooks.

### Errors and timeouts
- Soft timeouts stop execution after the current node, respecting persisted `startedAt` for resumed runs.
- Errors are reported to `ErrorReporter`; cancellations resolve gracefully; stalled jobs are normalized.

### Why this design works
- Persistence ensures transparent resume and robust error reporting.
- Unified hooks yield consistent UX across modes and transports.