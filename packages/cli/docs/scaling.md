## Scaling (Queue, Workers, Pub/Sub)

Directory: `src/scaling`

### Queue mode
- `scaling.service.ts` configures Bull queue, Redis connections, and job lifecycle.
- Jobs contain `workflowId`, `executionId`, and flags like `loadStaticData` and `streamingEnabled`.
- `worker-server.ts` runs a worker HTTP server; `job-processor.ts` processes jobs.

### Multi-main and pub/sub
- `multi-main-setup.ee.ts` coordinates multiple main instances.
- Pub/Sub under `src/scaling/pubsub` provides `Publisher`/`Subscriber` to broadcast instance events.

### Worker status
- `worker-status.service.ee.ts` exposes worker health in enterprise setups.

### Why this design works
- Queue isolation increases resiliency, allowing mains to scale API throughput independently from execution throughput.
- Pub/Sub enables coordination and broadcasted state changes across instances.