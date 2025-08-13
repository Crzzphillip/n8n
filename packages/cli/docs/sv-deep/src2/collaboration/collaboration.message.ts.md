## src2/collaboration/collaboration.message.ts

Overview: src2/collaboration/collaboration.message.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import { z } from 'zod';

### Declarations

- Exports: CollaborationMessage, workflowOpenedMessageSchema, workflowClosedMessageSchema, workflowMessageSchema, WorkflowOpenedMessage, WorkflowClosedMessage, WorkflowMessage, parseWorkflowMessage

### Recreate

Place this file at `src2/collaboration/collaboration.message.ts` and use the following source:

```ts
import { z } from 'zod';

export type CollaborationMessage = WorkflowOpenedMessage | WorkflowClosedMessage;

export const workflowOpenedMessageSchema = z
	.object({
		type: z.literal('workflowOpened'),
		workflowId: z.string().min(1),
	})
	.strict();

export const workflowClosedMessageSchema = z
	.object({
		type: z.literal('workflowClosed'),
		workflowId: z.string().min(1),
	})
	.strict();

export const workflowMessageSchema = z.discriminatedUnion('type', [
	workflowOpenedMessageSchema,
	workflowClosedMessageSchema,
]);

export type WorkflowOpenedMessage = z.infer<typeof workflowOpenedMessageSchema>;

export type WorkflowClosedMessage = z.infer<typeof workflowClosedMessageSchema>;

export type WorkflowMessage = z.infer<typeof workflowMessageSchema>;

/**
 * Parses the given message and ensure it's of type WorkflowMessage
 */
export const parseWorkflowMessage = async (msg: unknown) => {
	return await workflowMessageSchema.parseAsync(msg);
};

```
