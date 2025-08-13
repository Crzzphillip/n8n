## src2/evaluation.ee/test-runner/evaluation-metrics.ee.ts

Overview: src2/evaluation.ee/test-runner/evaluation-metrics.ee.ts is a core component (EvaluationMetrics) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { IDataObject } from 'n8n-workflow';
- import { TestCaseExecutionError } from '@/evaluation.ee/test-runner/errors.ee';

### Declarations

- Classes: EvaluationMetrics
- Exports: EvaluationMetricsAddResultsInfo, EvaluationMetrics

### Recreate

Place this file at `src2/evaluation.ee/test-runner/evaluation-metrics.ee.ts` and use the following source:

```ts
import type { IDataObject } from 'n8n-workflow';

import { TestCaseExecutionError } from '@/evaluation.ee/test-runner/errors.ee';

export interface EvaluationMetricsAddResultsInfo {
	addedMetrics: Record<string, number>;
	incorrectTypeMetrics: Set<string>;
}

export class EvaluationMetrics {
	private readonly rawMetricsByName = new Map<string, number[]>();

	addResults(result: IDataObject): EvaluationMetricsAddResultsInfo {
		const addResultsInfo: EvaluationMetricsAddResultsInfo = {
			addedMetrics: {},
			incorrectTypeMetrics: new Set<string>(),
		};

		for (const [metricName, metricValue] of Object.entries(result)) {
			if (typeof metricValue === 'number') {
				addResultsInfo.addedMetrics[metricName] = metricValue;

				// Initialize the array if this is the first time we see this metric
				if (!this.rawMetricsByName.has(metricName)) {
					this.rawMetricsByName.set(metricName, []);
				}

				this.rawMetricsByName.get(metricName)!.push(metricValue);
			} else {
				addResultsInfo.incorrectTypeMetrics.add(metricName);
				throw new TestCaseExecutionError('INVALID_METRICS', {
					metricName,
					metricValue,
				});
			}
		}

		return addResultsInfo;
	}

	getAggregatedMetrics() {
		const aggregatedMetrics: Record<string, number> = {};

		for (const [metricName, metricValues] of this.rawMetricsByName.entries()) {
			if (metricValues.length > 0) {
				const metricSum = metricValues.reduce((acc, val) => acc + val, 0);
				aggregatedMetrics[metricName] = metricSum / metricValues.length;
			}
		}

		return aggregatedMetrics;
	}
}

```
