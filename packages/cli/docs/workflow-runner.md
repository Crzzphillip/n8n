## Workflow Runner

File: `src/workflow-runner.ts`

### Responsibilities
- Create and register executions in `ActiveExecutions` and the DB, attach response promises, and run workflows either inline (regular mode) or offload to queue workers (queue mode).
- Bridge lifecycle hooks between request/response, UI streaming, and execution engine (`n8n-core` `WorkflowExecute`).
- Handle timeouts, cancellations, and error reporting; finalize executions and run post-execution hooks.

### Inline (regular) execution
- Builds a `Workflow` object from the incoming data and loads static data if requested.
- Prepares `additionalData` via `WorkflowExecuteAdditionalData.getBase()` (timeout, hooks, UI push, status setter) and optional `pinData` for manual/evaluation modes.
- Runs with `WorkflowExecute.processRunExecutionData()` when resuming with stored execution data, otherwise `ManualExecutionService.runManually()`.
- Applies soft timeouts to stop at the next node boundary; ensures finalize, status, and hook invocation on resolution or error.

### Queue (scaling) execution
- Adds a job to the `ScalingService` queue with priority for realtime runs.
- Uses `getLifecycleHooksForScalingMain`/`Worker` to emit before/after hooks and bridge UI responses.
- Waits for `job.finished()`, handles stalled jobs (emitting events and mapping to `MaxStalledCountError`), then fetches persisted run data to finalize and fire hooks.

### Error handling
- `processError()` centralizes failure finalization, handling cancellation and false positives where a job succeeded but stalled flags were mis-set.

### Why this design works
- Decouples request handling from execution engine; supports both synchronous and offloaded runs.
- Unified lifecycle hooks keep the UI and API consistent across modes.