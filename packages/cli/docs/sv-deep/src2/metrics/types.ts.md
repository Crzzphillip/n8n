## src2/metrics/types.ts

Overview: src2/metrics/types.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: MetricCategory, MetricLabel, Includes

### Recreate

Place this file at `src2/metrics/types.ts` and use the following source:

```ts
export type MetricCategory = 'default' | 'routes' | 'cache' | 'logs' | 'queue';

export type MetricLabel =
	| 'credentialsType'
	| 'nodeType'
	| 'workflowId'
	| 'workflowName'
	| 'apiPath'
	| 'apiMethod'
	| 'apiStatusCode';

export type Includes = {
	metrics: Record<MetricCategory, boolean>;
	labels: Record<MetricLabel, boolean>;
};

```
