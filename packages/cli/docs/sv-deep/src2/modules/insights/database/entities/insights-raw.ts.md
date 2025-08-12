## src2/modules/insights/database/entities/insights-raw.ts

Overview: src2/modules/insights/database/entities/insights-raw.ts is a core component (InsightsRaw) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { GlobalConfig } from '@n8n/config';
- import { DateTimeColumn } from '@n8n/db';
- import { Container } from '@n8n/di';
- import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from '@n8n/typeorm';
- import { UnexpectedError } from 'n8n-workflow';
- import { isValidTypeNumber, NumberToType, TypeToNumber } from './insights-shared';

### Declarations

- Classes: InsightsRaw
- Exports: InsightsRaw

### Recreate

Place this file at `src2/modules/insights/database/entities/insights-raw.ts` and use the following source:

```ts
import { GlobalConfig } from '@n8n/config';
import { DateTimeColumn } from '@n8n/db';
import { Container } from '@n8n/di';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from '@n8n/typeorm';
import { UnexpectedError } from 'n8n-workflow';

import { isValidTypeNumber, NumberToType, TypeToNumber } from './insights-shared';

export const { type: dbType } = Container.get(GlobalConfig).database;

@Entity()
export class InsightsRaw extends BaseEntity {
	constructor() {
		super();
		this.timestamp = new Date();
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	metaId: number;

	@Column({ name: 'type', type: 'int' })
	private type_: number;

	get type() {
		if (!isValidTypeNumber(this.type_)) {
			throw new UnexpectedError(
				`Type '${this.type_}' is not a valid type for 'InsightsByPeriod.type'`,
			);
		}

		return NumberToType[this.type_];
	}

	set type(value: keyof typeof TypeToNumber) {
		this.type_ = TypeToNumber[value];
	}

	@Column()
	value: number;

	@DateTimeColumn({ name: 'timestamp' })
	timestamp: Date;
}

```
