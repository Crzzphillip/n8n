## src2/modules/insights/database/entities/__tests__/insights-by-period.test.ts

Overview: src2/modules/insights/database/entities/__tests__/insights-by-period.test.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { testDb } from '@n8n/backend-test-utils';
- import { InsightsByPeriod } from '../insights-by-period';
- import type { PeriodUnit, TypeUnit } from '../insights-shared';

### Recreate

Place this file at `src2/modules/insights/database/entities/__tests__/insights-by-period.test.ts` and use the following source:

```ts
import { testDb } from '@n8n/backend-test-utils';

import { InsightsByPeriod } from '../insights-by-period';
import type { PeriodUnit, TypeUnit } from '../insights-shared';

beforeAll(async () => {
	await testDb.init();
});

afterAll(async () => {
	await testDb.terminate();
});

describe('Insights By Period', () => {
	test.each(['time_saved_min', 'runtime_ms', 'failure', 'success'] satisfies TypeUnit[])(
		'`%s` can be serialized and deserialized correctly',
		(typeUnit) => {
			// ARRANGE
			const insightByPeriod = new InsightsByPeriod();

			// ACT
			insightByPeriod.type = typeUnit;

			// ASSERT
			expect(insightByPeriod.type).toBe(typeUnit);
		},
	);
	test.each(['hour', 'day', 'week'] satisfies PeriodUnit[])(
		'`%s` can be serialized and deserialized correctly',
		(periodUnit) => {
			// ARRANGE
			const insightByPeriod = new InsightsByPeriod();

			// ACT
			insightByPeriod.periodUnit = periodUnit;

			// ASSERT
			expect(insightByPeriod.periodUnit).toBe(periodUnit);
		},
	);
});

```
