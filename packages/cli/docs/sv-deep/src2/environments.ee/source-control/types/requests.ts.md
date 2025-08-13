## src2/environments.ee/source-control/types/requests.ts

Overview: src2/environments.ee/source-control/types/requests.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { AuthenticatedRequest } from '@n8n/db';
- import type { SourceControlCommit } from './source-control-commit';
- import type { SourceControlDisconnect } from './source-control-disconnect';
- import type { SourceControlGenerateKeyPair } from './source-control-generate-key-pair';
- import type { SourceControlGetStatus } from './source-control-get-status';
- import type { SourceControlPreferences } from './source-control-preferences';
- import type { SourceControlPush } from './source-control-push';
- import type { SourceControlSetBranch } from './source-control-set-branch';
- import type { SourceControlSetReadOnly } from './source-control-set-read-only';
- import type { SourceControlStage } from './source-control-stage';

### Recreate

Place this file at `src2/environments.ee/source-control/types/requests.ts` and use the following source:

```ts
import type { AuthenticatedRequest } from '@n8n/db';

import type { SourceControlCommit } from './source-control-commit';
import type { SourceControlDisconnect } from './source-control-disconnect';
import type { SourceControlGenerateKeyPair } from './source-control-generate-key-pair';
import type { SourceControlGetStatus } from './source-control-get-status';
import type { SourceControlPreferences } from './source-control-preferences';
import type { SourceControlPush } from './source-control-push';
import type { SourceControlSetBranch } from './source-control-set-branch';
import type { SourceControlSetReadOnly } from './source-control-set-read-only';
import type { SourceControlStage } from './source-control-stage';

export declare namespace SourceControlRequest {
	type UpdatePreferences = AuthenticatedRequest<{}, {}, Partial<SourceControlPreferences>, {}>;
	type SetReadOnly = AuthenticatedRequest<{}, {}, SourceControlSetReadOnly, {}>;
	type SetBranch = AuthenticatedRequest<{}, {}, SourceControlSetBranch, {}>;
	type Commit = AuthenticatedRequest<{}, {}, SourceControlCommit, {}>;
	type Stage = AuthenticatedRequest<{}, {}, SourceControlStage, {}>;
	type Push = AuthenticatedRequest<{}, {}, SourceControlPush, {}>;
	type Disconnect = AuthenticatedRequest<{}, {}, SourceControlDisconnect, {}>;
	type GetStatus = AuthenticatedRequest<{}, {}, {}, SourceControlGetStatus>;
	type GenerateKeyPair = AuthenticatedRequest<{}, {}, SourceControlGenerateKeyPair, {}>;
}

```
