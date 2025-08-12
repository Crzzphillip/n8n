## src2/generic-helpers.ts

Overview: src2/generic-helpers.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type {
- import { validate } from 'class-validator';
- import type { PersonalizationSurveyAnswersV4 } from './controllers/survey-answers.dto';
- import { BadRequestError } from './errors/response-errors/bad-request.error';

### Declarations

- Functions: validateEntity
- Exports: DEFAULT_EXECUTIONS_GET_ALL_LIMIT

### Recreate

Place this file at `src2/generic-helpers.ts` and use the following source:

```ts
import type {
	CredentialsEntity,
	User,
	WorkflowEntity,
	TagEntity,
	AnnotationTagEntity,
} from '@n8n/db';
import { validate } from 'class-validator';

import type { PersonalizationSurveyAnswersV4 } from './controllers/survey-answers.dto';
import { BadRequestError } from './errors/response-errors/bad-request.error';

export async function validateEntity(
	entity:
		| WorkflowEntity
		| CredentialsEntity
		| TagEntity
		| AnnotationTagEntity
		| User
		| PersonalizationSurveyAnswersV4,
): Promise<void> {
	const errors = await validate(entity);

	const errorMessages = errors
		.reduce<string[]>((acc, cur) => {
			if (!cur.constraints) return acc;
			acc.push(...Object.values(cur.constraints));
			return acc;
		}, [])
		.join(' | ');

	if (errorMessages) {
		throw new BadRequestError(errorMessages);
	}
}

export const DEFAULT_EXECUTIONS_GET_ALL_LIMIT = 20;

```
