## src2/task-runners/forward-to-logger.ts

Overview: src2/task-runners/forward-to-logger.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { Logger } from 'n8n-workflow';
- import type { Readable } from 'stream';

### Declarations

- Functions: forwardToLogger
- Exports: forwardToLogger

### Recreate

Place this file at `src2/task-runners/forward-to-logger.ts` and use the following source:

```ts
import type { Logger } from 'n8n-workflow';
import type { Readable } from 'stream';

/**
 * Forwards stdout and stderr of a given producer to the given
 * logger's info and error methods respectively.
 */
export function forwardToLogger(
	logger: Logger,
	producer: {
		stdout?: Readable | null;
		stderr?: Readable | null;
	},
	prefix?: string,
) {
	if (prefix) {
		prefix = prefix.trimEnd();
	}

	const stringify = (data: Buffer) => {
		let str = data.toString();

		// Remove possible trailing newline (otherwise it's duplicated)
		if (str.endsWith('\n')) {
			str = str.slice(0, -1);
		}

		return prefix ? `${prefix} ${str}` : str;
	};

	if (producer.stdout) {
		producer.stdout.on('data', (data: Buffer) => {
			logger.info(stringify(data));
		});
	}

	if (producer.stderr) {
		producer.stderr.on('data', (data: Buffer) => {
			logger.error(stringify(data));
		});
	}
}

```
