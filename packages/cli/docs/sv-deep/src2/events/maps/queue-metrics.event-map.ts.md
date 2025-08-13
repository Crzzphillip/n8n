## src2/events/maps/queue-metrics.event-map.ts

Overview: src2/events/maps/queue-metrics.event-map.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: QueueMetricsEventMap

### Recreate

Place this file at `src2/events/maps/queue-metrics.event-map.ts` and use the following source:

```ts
export type QueueMetricsEventMap = {
	'job-counts-updated': {
		active: number;
		completed: number;
		failed: number;
		waiting: number;
	};
};

```
