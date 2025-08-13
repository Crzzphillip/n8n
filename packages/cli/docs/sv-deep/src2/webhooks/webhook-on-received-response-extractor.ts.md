## src2/webhooks/webhook-on-received-response-extractor.ts

Overview: src2/webhooks/webhook-on-received-response-extractor.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { IWebhookResponseData, WebhookResponseData } from 'n8n-workflow';

### Declarations

- Functions: extractWebhookOnReceivedResponse
- Exports: extractWebhookOnReceivedResponse

### Recreate

Place this file at `src2/webhooks/webhook-on-received-response-extractor.ts` and use the following source:

```ts
import type { IWebhookResponseData, WebhookResponseData } from 'n8n-workflow';

/**
+ * Creates the response for a webhook when the response mode is set to
 * `onReceived`.
 *
 * @param context - The webhook execution context
 * @param responseData - The evaluated `responseData` option of the webhook node
 * @param webhookResultData - The webhook result data that the webhook might have returned when it was ran
 *
 * @returns The response body
 */
export function extractWebhookOnReceivedResponse(
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	responseData: Extract<WebhookResponseData, 'noData'> | string | undefined,
	webhookResultData: IWebhookResponseData,
): unknown {
	// Return response directly and do not wait for the workflow to finish
	if (responseData === 'noData') {
		return undefined;
	}

	if (responseData) {
		return responseData;
	}

	if (webhookResultData.webhookResponse !== undefined) {
		// Data to respond with is given
		return webhookResultData.webhookResponse as unknown;
	}

	return { message: 'Workflow was started' };
}

```
