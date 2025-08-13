## src2/commands/license/info.ts

Overview: src2/commands/license/info.ts declares a CLI command (LicenseInfoCommand). Command: `license:info`.

How it works: Bootstraps configuration, DB, and modules via the base command, then performs its task using shared services.

Why: Centralized boot logic with per-command behavior simplifies maintenance.

### Imports

- import { Command } from '@n8n/decorators';
- import { Container } from '@n8n/di';
- import { License } from '@/license';
- import { BaseCommand } from '../base-command';

### Declarations

- Classes: LicenseInfoCommand
- Exports: LicenseInfoCommand

### Recreate

Place this file at `src2/commands/license/info.ts` and use the following source:

```ts
import { Command } from '@n8n/decorators';
import { Container } from '@n8n/di';

import { License } from '@/license';

import { BaseCommand } from '../base-command';

@Command({
	name: 'license:info',
	description: 'Print license information',
})
export class LicenseInfoCommand extends BaseCommand {
	async run() {
		const license = Container.get(License);
		await license.init({ isCli: true });

		this.logger.info('Printing license information:\n' + license.getInfo());
	}

	async catch(error: Error) {
		this.logger.error('\nGOT ERROR');
		this.logger.info('====================================');
		this.logger.error(error.message);
	}
}

```
