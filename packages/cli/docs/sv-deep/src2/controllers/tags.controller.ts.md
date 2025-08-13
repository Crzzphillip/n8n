## src2/controllers/tags.controller.ts

Overview: src2/controllers/tags.controller.ts defines an HTTP controller (TagsController) that exposes Express routes for a focused domain. Base route: `/tags`.

How it works: Registered via the ControllerRegistry during server bootstrap. Each handler delegates to services and applies DTO validation, returning sanitized responses.

Why: Separation of transport and domain logic improves testability and consistency of route registration.

### Imports

- import { CreateOrUpdateTagRequestDto, RetrieveTagQueryDto } from '@n8n/api-types';
- import { AuthenticatedRequest } from '@n8n/db';
- import {
- import { Response } from 'express';
- import { TagService } from '@/services/tag.service';

### Declarations

- Classes: TagsController
- Exports: TagsController

### Recreate

Place this file at `src2/controllers/tags.controller.ts` and use the following source:

```ts
import { CreateOrUpdateTagRequestDto, RetrieveTagQueryDto } from '@n8n/api-types';
import { AuthenticatedRequest } from '@n8n/db';
import {
	Delete,
	Get,
	Patch,
	Post,
	RestController,
	GlobalScope,
	Body,
	Param,
	Query,
} from '@n8n/decorators';
import { Response } from 'express';

import { TagService } from '@/services/tag.service';

@RestController('/tags')
export class TagsController {
	constructor(private readonly tagService: TagService) {}

	@Get('/')
	@GlobalScope('tag:list')
	async getAll(_req: AuthenticatedRequest, _res: Response, @Query query: RetrieveTagQueryDto) {
		return await this.tagService.getAll({ withUsageCount: query.withUsageCount });
	}

	@Post('/')
	@GlobalScope('tag:create')
	async createTag(
		_req: AuthenticatedRequest,
		_res: Response,
		@Body payload: CreateOrUpdateTagRequestDto,
	) {
		const { name } = payload;
		const tag = this.tagService.toEntity({ name });

		return await this.tagService.save(tag, 'create');
	}

	@Patch('/:id')
	@GlobalScope('tag:update')
	async updateTag(
		_req: AuthenticatedRequest,
		_res: Response,
		@Param('id') tagId: string,
		@Body payload: CreateOrUpdateTagRequestDto,
	) {
		const newTag = this.tagService.toEntity({ id: tagId, name: payload.name });

		return await this.tagService.save(newTag, 'update');
	}

	@Delete('/:id')
	@GlobalScope('tag:delete')
	async deleteTag(_req: AuthenticatedRequest, _res: Response, @Param('id') tagId: string) {
		await this.tagService.delete(tagId);
		return true;
	}
}

```
