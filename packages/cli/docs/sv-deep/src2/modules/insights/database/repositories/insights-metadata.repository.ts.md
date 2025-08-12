## src2/modules/insights/database/repositories/insights-metadata.repository.ts

Overview: src2/modules/insights/database/repositories/insights-metadata.repository.ts is a core component (InsightsMetadataRepository) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { Service } from '@n8n/di';
- import { DataSource, Repository } from '@n8n/typeorm';
- import { InsightsMetadata } from '../entities/insights-metadata';

### Declarations

- Classes: InsightsMetadataRepository
- Exports: InsightsMetadataRepository

### Recreate

Place this file at `src2/modules/insights/database/repositories/insights-metadata.repository.ts` and use the following source:

```ts
import { Service } from '@n8n/di';
import { DataSource, Repository } from '@n8n/typeorm';

import { InsightsMetadata } from '../entities/insights-metadata';

@Service()
export class InsightsMetadataRepository extends Repository<InsightsMetadata> {
	constructor(dataSource: DataSource) {
		super(InsightsMetadata, dataSource.manager);
	}
}

```
