## src2/posthog/index.ts

Overview: src2/posthog/index.ts is a core component (PostHogClient) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { GlobalConfig } from '@n8n/config';
- import type { PublicUser } from '@n8n/db';
- import { Service } from '@n8n/di';
- import { InstanceSettings } from 'n8n-core';
- import type { FeatureFlags, ITelemetryTrackProperties } from 'n8n-workflow';
- import type { PostHog } from 'posthog-node';

### Declarations

- Classes: PostHogClient
- Exports: PostHogClient

### Recreate

Place this file at `src2/posthog/index.ts` and use the following source:

```ts
import { GlobalConfig } from '@n8n/config';
import type { PublicUser } from '@n8n/db';
import { Service } from '@n8n/di';
import { InstanceSettings } from 'n8n-core';
import type { FeatureFlags, ITelemetryTrackProperties } from 'n8n-workflow';
import type { PostHog } from 'posthog-node';

@Service()
export class PostHogClient {
	private postHog?: PostHog;

	constructor(
		private readonly instanceSettings: InstanceSettings,
		private readonly globalConfig: GlobalConfig,
	) {}

	async init() {
		const { enabled, posthogConfig } = this.globalConfig.diagnostics;
		if (!enabled) {
			return;
		}

		const { PostHog } = await import('posthog-node');
		this.postHog = new PostHog(posthogConfig.apiKey, {
			host: posthogConfig.apiHost,
		});

		const logLevel = this.globalConfig.logging.level;
		if (logLevel === 'debug') {
			this.postHog.debug(true);
		}
	}

	async stop(): Promise<void> {
		if (this.postHog) {
			return this.postHog.shutdown();
		}
	}

	track(payload: { userId: string; event: string; properties: ITelemetryTrackProperties }): void {
		this.postHog?.capture({
			distinctId: payload.userId,
			sendFeatureFlags: true,
			...payload,
		});
	}

	async getFeatureFlags(user: Pick<PublicUser, 'id' | 'createdAt'>): Promise<FeatureFlags> {
		if (!this.postHog) return {};

		const fullId = [this.instanceSettings.instanceId, user.id].join('#');

		// cannot use local evaluation because that requires PostHog personal api key with org-wide
		// https://github.com/PostHog/posthog/issues/4849
		return await this.postHog.getAllFlags(fullId, {
			personProperties: {
				created_at_timestamp: user.createdAt.getTime().toString(),
			},
		});
	}
}

```
