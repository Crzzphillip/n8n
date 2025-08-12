## src2/workflows/workflow-sharing.service.ts

Overview: src2/workflows/workflow-sharing.service.ts is a core component (WorkflowSharingService) within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { User } from '@n8n/db';
- import { ProjectRelationRepository, SharedWorkflowRepository } from '@n8n/db';
- import { Service } from '@n8n/di';
- import {
- import { In } from '@n8n/typeorm';
- import { RoleService } from '@/services/role.service';

### Declarations

- Classes: WorkflowSharingService
- Exports: ShareWorkflowOptions, WorkflowSharingService

### Recreate

Place this file at `src2/workflows/workflow-sharing.service.ts` and use the following source:

```ts
import type { User } from '@n8n/db';
import { ProjectRelationRepository, SharedWorkflowRepository } from '@n8n/db';
import { Service } from '@n8n/di';
import {
	hasGlobalScope,
	rolesWithScope,
	type ProjectRole,
	type WorkflowSharingRole,
	type Scope,
} from '@n8n/permissions';
// eslint-disable-next-line n8n-local-rules/misplaced-n8n-typeorm-import
import { In } from '@n8n/typeorm';

import { RoleService } from '@/services/role.service';

export type ShareWorkflowOptions =
	| { scopes: Scope[]; projectId?: string }
	| { projectRoles: ProjectRole[]; workflowRoles: WorkflowSharingRole[]; projectId?: string };

@Service()
export class WorkflowSharingService {
	constructor(
		private readonly sharedWorkflowRepository: SharedWorkflowRepository,
		private readonly roleService: RoleService,
		private readonly projectRelationRepository: ProjectRelationRepository,
	) {}

	/**
	 * Get the IDs of the workflows that have been shared with the user based on
	 * scope or roles.
	 * If `scopes` is passed the roles are inferred. Alternatively `projectRoles`
	 * and `workflowRoles` can be passed specifically.
	 *
	 * Returns all IDs if user has the 'workflow:read' global scope.
	 */

	async getSharedWorkflowIds(user: User, options: ShareWorkflowOptions): Promise<string[]> {
		const { projectId } = options;

		if (hasGlobalScope(user, 'workflow:read')) {
			const sharedWorkflows = await this.sharedWorkflowRepository.find({
				select: ['workflowId'],
				...(projectId && { where: { projectId } }),
			});
			return sharedWorkflows.map(({ workflowId }) => workflowId);
		}

		const projectRoles =
			'scopes' in options ? rolesWithScope('project', options.scopes) : options.projectRoles;
		const workflowRoles =
			'scopes' in options ? rolesWithScope('workflow', options.scopes) : options.workflowRoles;

		const sharedWorkflows = await this.sharedWorkflowRepository.find({
			where: {
				role: In(workflowRoles),
				project: {
					projectRelations: {
						userId: user.id,
						role: In(projectRoles),
					},
				},
			},
			select: ['workflowId'],
		});

		return sharedWorkflows.map(({ workflowId }) => workflowId);
	}

	async getSharedWithMeIds(user: User) {
		const sharedWithMeWorkflows = await this.sharedWorkflowRepository.find({
			select: ['workflowId'],
			where: {
				role: 'workflow:editor',
				project: {
					projectRelations: {
						userId: user.id,
						role: 'project:personalOwner',
					},
				},
			},
		});

		return sharedWithMeWorkflows.map(({ workflowId }) => workflowId);
	}

	async getSharedWorkflowScopes(
		workflowIds: string[],
		user: User,
	): Promise<Array<[string, Scope[]]>> {
		const projectRelations = await this.projectRelationRepository.findAllByUser(user.id);
		const sharedWorkflows =
			await this.sharedWorkflowRepository.getRelationsByWorkflowIdsAndProjectIds(
				workflowIds,
				projectRelations.map((p) => p.projectId),
			);

		return workflowIds.map((workflowId) => {
			return [
				workflowId,
				this.roleService.combineResourceScopes(
					'workflow',
					user,
					sharedWorkflows.filter((s) => s.workflowId === workflowId),
					projectRelations,
				),
			];
		});
	}

	async getOwnedWorkflowsInPersonalProject(user: User): Promise<string[]> {
		const sharedWorkflows = await this.sharedWorkflowRepository.find({
			select: ['workflowId'],
			where: {
				role: 'workflow:owner',
				project: {
					projectRelations: {
						userId: user.id,
						role: 'project:personalOwner',
					},
				},
			},
		});
		return sharedWorkflows.map(({ workflowId }) => workflowId);
	}
}

```
