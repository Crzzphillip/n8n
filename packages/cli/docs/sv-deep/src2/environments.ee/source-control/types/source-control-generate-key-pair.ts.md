## src2/environments.ee/source-control/types/source-control-generate-key-pair.ts

Overview: src2/environments.ee/source-control/types/source-control-generate-key-pair.ts is a core component (SourceControlGenerateKeyPair) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { IsOptional, IsString } from 'class-validator';
- import { KeyPairType } from './key-pair-type';

### Declarations

- Classes: SourceControlGenerateKeyPair
- Exports: SourceControlGenerateKeyPair

### Recreate

Place this file at `src2/environments.ee/source-control/types/source-control-generate-key-pair.ts` and use the following source:

```ts
import { IsOptional, IsString } from 'class-validator';

import { KeyPairType } from './key-pair-type';

export class SourceControlGenerateKeyPair {
	@IsOptional()
	@IsString()
	readonly keyGeneratorType?: KeyPairType;
}

```
