## Events and Event Bus

Directories: `src/eventbus`, `src/events`

### Components
- `MessageEventBus`: central event bus for internal and external events. Initialized by the server and closed during shutdown.
- `events.controller.ts` and maps/relays: expose and relay events; `LogStreamingEventRelay` streams logs to connected clients.
- `EventService`: a small facade for emitting app-level events (`server-started`, `instance-stopped`, `job-stalled`, etc.).

### Why this design works
- Decouples producers and consumers of events, enabling logging, telemetry, and live collaboration features without tight coupling.