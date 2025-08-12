## src2/evaluation.ee/test-runner/errors.ee.ts

Overview: src2/evaluation.ee/test-runner/errors.ee.ts is a core component (TestCaseExecutionError) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { TestCaseExecutionErrorCode, TestRunErrorCode } from '@n8n/db';
- import { UnexpectedError } from 'n8n-workflow';

### Declarations

- Classes: TestCaseExecutionError, TestRunError
- Exports: TestCaseExecutionError, TestRunError

### Recreate

Place this file at `src2/evaluation.ee/test-runner/errors.ee.ts` and use the following source:

```ts
import type { TestCaseExecutionErrorCode, TestRunErrorCode } from '@n8n/db';
import { UnexpectedError } from 'n8n-workflow';

export class TestCaseExecutionError extends UnexpectedError {
	readonly code: TestCaseExecutionErrorCode;

	constructor(code: TestCaseExecutionErrorCode, extra: Record<string, unknown> = {}) {
		super('Test Case execution failed with code ' + code, { extra });

		this.code = code;
	}
}

export class TestRunError extends UnexpectedError {
	readonly code: TestRunErrorCode;

	constructor(code: TestRunErrorCode, extra: Record<string, unknown> = {}) {
		super('Test Run failed with code ' + code, { extra });

		this.code = code;
	}
}

```
