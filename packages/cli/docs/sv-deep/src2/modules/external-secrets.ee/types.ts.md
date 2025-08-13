## src2/modules/external-secrets.ee/types.ts

Overview: src2/modules/external-secrets.ee/types.ts is a core component (SecretsProvider) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { AuthenticatedRequest } from '@n8n/db';
- import type { IDataObject, INodeProperties } from 'n8n-workflow';

### Declarations

- Classes: SecretsProvider
- Exports: SecretsProviderSettings, ExternalSecretsSettings, SecretsProviderState

### Recreate

Place this file at `src2/modules/external-secrets.ee/types.ts` and use the following source:

```ts
import type { AuthenticatedRequest } from '@n8n/db';
import type { IDataObject, INodeProperties } from 'n8n-workflow';

export interface SecretsProviderSettings<T = IDataObject> {
	connected: boolean;
	connectedAt: Date | null;
	settings: T;
}

export interface ExternalSecretsSettings {
	[key: string]: SecretsProviderSettings;
}

export type SecretsProviderState = 'initializing' | 'connected' | 'error';

export abstract class SecretsProvider {
	displayName: string;

	name: string;

	properties: INodeProperties[];

	state: SecretsProviderState;

	abstract init(settings: SecretsProviderSettings): Promise<void>;
	abstract connect(): Promise<void>;
	abstract disconnect(): Promise<void>;
	abstract update(): Promise<void>;
	abstract test(): Promise<[boolean] | [boolean, string]>;
	abstract getSecret(name: string): unknown;
	abstract hasSecret(name: string): boolean;
	abstract getSecretNames(): string[];
}

export declare namespace ExternalSecretsRequest {
	type GetProviderResponse = Pick<SecretsProvider, 'displayName' | 'name' | 'properties'> & {
		icon: string;
		connected: boolean;
		connectedAt: Date | null;
		state: SecretsProviderState;
		data: IDataObject;
	};

	type GetProviders = AuthenticatedRequest;
	type GetProvider = AuthenticatedRequest<{ provider: string }, GetProviderResponse>;
	type SetProviderSettings = AuthenticatedRequest<{ provider: string }, {}, IDataObject>;
	type TestProviderSettings = SetProviderSettings;
	type SetProviderConnected = AuthenticatedRequest<
		{ provider: string },
		{},
		{ connected: boolean }
	>;

	type UpdateProvider = AuthenticatedRequest<{ provider: string }>;
}

```
