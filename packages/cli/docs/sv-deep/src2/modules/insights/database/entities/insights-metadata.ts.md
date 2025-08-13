## src2/modules/insights/database/entities/insights-metadata.ts

Overview: src2/modules/insights/database/entities/insights-metadata.ts is a core component (InsightsMetadata) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from '@n8n/typeorm';

### Declarations

- Classes: InsightsMetadata
- Exports: InsightsMetadata

### Recreate

Place this file at `src2/modules/insights/database/entities/insights-metadata.ts` and use the following source:

```ts
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from '@n8n/typeorm';

@Entity()
export class InsightsMetadata extends BaseEntity {
	@PrimaryGeneratedColumn()
	metaId: number;

	@Column({ unique: true, type: 'varchar', length: 16 })
	workflowId: string;

	@Column({ type: 'varchar', length: 36 })
	projectId: string;

	@Column({ type: 'varchar', length: 128 })
	workflowName: string;

	@Column({ type: 'varchar', length: 255 })
	projectName: string;
}

```
