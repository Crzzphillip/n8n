## src2/controllers/annotation-tags.controller.ee.ts

Overview: src2/controllers/annotation-tags.controller.ee.ts defines an HTTP controller (AnnotationTagsController) that exposes Express routes for a focused domain. Base route: `/annotation-tags`.

How it works: Registered via the ControllerRegistry during server bootstrap. Each handler delegates to services and applies DTO validation, returning sanitized responses.

Why: Separation of transport and domain logic improves testability and consistency of route registration.

### Imports

- import { Delete, Get, Patch, Post, RestController, GlobalScope } from '@n8n/decorators';
- import { AnnotationTagsRequest } from '@/requests';
- import { AnnotationTagService } from '@/services/annotation-tag.service.ee';

### Declarations

- Classes: AnnotationTagsController
- Exports: AnnotationTagsController

### Recreate

Place this file at `src2/controllers/annotation-tags.controller.ee.ts` and use the following source:

```ts
import { Delete, Get, Patch, Post, RestController, GlobalScope } from '@n8n/decorators';

import { AnnotationTagsRequest } from '@/requests';
import { AnnotationTagService } from '@/services/annotation-tag.service.ee';

@RestController('/annotation-tags')
export class AnnotationTagsController {
	constructor(private readonly annotationTagService: AnnotationTagService) {}

	@Get('/')
	@GlobalScope('annotationTag:list')
	async getAll(req: AnnotationTagsRequest.GetAll) {
		return await this.annotationTagService.getAll({
			withUsageCount: req.query.withUsageCount === 'true',
		});
	}

	@Post('/')
	@GlobalScope('annotationTag:create')
	async createTag(req: AnnotationTagsRequest.Create) {
		const tag = this.annotationTagService.toEntity({ name: req.body.name });

		return await this.annotationTagService.save(tag);
	}

	@Patch('/:id')
	@GlobalScope('annotationTag:update')
	async updateTag(req: AnnotationTagsRequest.Update) {
		const newTag = this.annotationTagService.toEntity({
			id: req.params.id,
			name: req.body.name.trim(),
		});

		return await this.annotationTagService.save(newTag);
	}

	@Delete('/:id')
	@GlobalScope('annotationTag:delete')
	async deleteTag(req: AnnotationTagsRequest.Delete) {
		const { id } = req.params;

		await this.annotationTagService.delete(id);

		return true;
	}
}

```
