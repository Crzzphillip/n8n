## src2/services/community-node-types.service.ts

Overview: src2/services/community-node-types.service.ts provides a service (CommunityNodeTypesService) encapsulating domain logic and integrations.

How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.

Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.

### Imports

- import type { CommunityNodeType } from '@n8n/api-types';
- import { Logger, inProduction } from '@n8n/backend-common';
- import { GlobalConfig } from '@n8n/config';
- import { Service } from '@n8n/di';
- import { ensureError } from 'n8n-workflow';
- import { CommunityPackagesService } from './community-packages.service';
- import {

### Declarations

- Classes: CommunityNodeTypesService
- Exports: CommunityNodeTypesService

### Recreate

Place this file at `src2/services/community-node-types.service.ts` and use the following source:

```ts
import type { CommunityNodeType } from '@n8n/api-types';
import { Logger, inProduction } from '@n8n/backend-common';
import { GlobalConfig } from '@n8n/config';
import { Service } from '@n8n/di';
import { ensureError } from 'n8n-workflow';

import { CommunityPackagesService } from './community-packages.service';
import {
	getCommunityNodeTypes,
	StrapiCommunityNodeType,
} from '../utils/community-node-types-utils';

const UPDATE_INTERVAL = 8 * 60 * 60 * 1000;

@Service()
export class CommunityNodeTypesService {
	private communityNodeTypes: Map<string, StrapiCommunityNodeType> = new Map();

	private lastUpdateTimestamp = 0;

	constructor(
		private readonly logger: Logger,
		private globalConfig: GlobalConfig,
		private communityPackagesService: CommunityPackagesService,
	) {}

	private async fetchNodeTypes() {
		try {
			let data: StrapiCommunityNodeType[] = [];
			if (
				this.globalConfig.nodes.communityPackages.enabled &&
				this.globalConfig.nodes.communityPackages.verifiedEnabled
			) {
				// Cloud sets ENVIRONMENT to 'production' or 'staging' depending on the environment
				const environment = this.detectEnvironment();
				data = await getCommunityNodeTypes(environment);
			}

			this.updateCommunityNodeTypes(data);
		} catch (error) {
			this.logger.error('Failed to fetch community node types', { error: ensureError(error) });
		}
	}

	private detectEnvironment() {
		const environment = process.env.ENVIRONMENT;
		if (environment === 'staging') return 'staging';
		if (inProduction) return 'production';
		if (environment === 'production') return 'production';
		return 'staging';
	}

	private updateCommunityNodeTypes(nodeTypes: StrapiCommunityNodeType[]) {
		if (!nodeTypes?.length) return;

		this.resetCommunityNodeTypes();

		this.communityNodeTypes = new Map(nodeTypes.map((nodeType) => [nodeType.name, nodeType]));

		this.lastUpdateTimestamp = Date.now();
	}

	private resetCommunityNodeTypes() {
		this.communityNodeTypes = new Map();
	}

	private updateRequired() {
		if (!this.lastUpdateTimestamp) return true;
		return Date.now() - this.lastUpdateTimestamp > UPDATE_INTERVAL;
	}

	private async createIsInstalled() {
		const installedPackages = (await this.communityPackagesService.getAllInstalledPackages()) ?? [];
		const installedPackageNames = new Set(installedPackages.map((p) => p.packageName));

		return (nodeTypeName: string) => installedPackageNames.has(nodeTypeName.split('.')[0]);
	}

	async getCommunityNodeTypes(): Promise<CommunityNodeType[]> {
		if (this.updateRequired() || !this.communityNodeTypes.size) {
			await this.fetchNodeTypes();
		}

		const isInstalled = await this.createIsInstalled();

		return Array.from(this.communityNodeTypes.values()).map((nodeType) => ({
			...nodeType,
			isInstalled: isInstalled(nodeType.name),
		}));
	}

	async getCommunityNodeType(type: string): Promise<CommunityNodeType | null> {
		const nodeType = this.communityNodeTypes.get(type);
		const isInstalled = await this.createIsInstalled();
		if (!nodeType) return null;
		return { ...nodeType, isInstalled: isInstalled(nodeType.name) };
	}

	findVetted(packageName: string) {
		const vettedTypes = Array.from(this.communityNodeTypes.keys());
		const nodeName = vettedTypes.find((t) => t.includes(packageName));
		if (!nodeName) return;
		return this.communityNodeTypes.get(nodeName);
	}
}

```
