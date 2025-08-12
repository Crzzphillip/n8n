## src2/webhooks/webhook-response.ts

Overview: src2/webhooks/webhook-response.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { Readable } from 'stream';
- import type { WebhookResponseHeaders } from './webhook.types';

### Declarations

- Exports: WebhookResponseTag, WebhookNoResponse, WebhookStaticResponse, WebhookResponseStream, WebhookResponse, isWebhookResponse, isWebhookNoResponse, isWebhookStaticResponse, isWebhookStreamResponse, createNoResponse, createStaticResponse, createStreamResponse

### Recreate

Place this file at `src2/webhooks/webhook-response.ts` and use the following source:

```ts
import type { Readable } from 'stream';

import type { WebhookResponseHeaders } from './webhook.types';

export const WebhookResponseTag = Symbol('WebhookResponse');

/**
 * Result that indicates that no response needs to be sent. This is used
 * when the node or something else has already sent a response.
 */
export type WebhookNoResponse = {
	[WebhookResponseTag]: 'noResponse';
};

/**
 * Result that indicates that a non-stream response needs to be sent.
 */
export type WebhookStaticResponse = {
	[WebhookResponseTag]: 'static';
	body: unknown;
	headers: WebhookResponseHeaders | undefined;
	code: number | undefined;
};

/**
 * Result that indicates that a stream response needs to be sent.
 */
export type WebhookResponseStream = {
	[WebhookResponseTag]: 'stream';
	stream: Readable;
	code: number | undefined;
	headers: WebhookResponseHeaders | undefined;
};

export type WebhookResponse = WebhookNoResponse | WebhookStaticResponse | WebhookResponseStream;

export const isWebhookResponse = (response: unknown): response is WebhookResponse => {
	return typeof response === 'object' && response !== null && WebhookResponseTag in response;
};

export const isWebhookNoResponse = (response: unknown): response is WebhookNoResponse => {
	return isWebhookResponse(response) && response[WebhookResponseTag] === 'noResponse';
};

export const isWebhookStaticResponse = (response: unknown): response is WebhookStaticResponse => {
	return isWebhookResponse(response) && response[WebhookResponseTag] === 'static';
};

export const isWebhookStreamResponse = (response: unknown): response is WebhookResponseStream => {
	return isWebhookResponse(response) && response[WebhookResponseTag] === 'stream';
};

export const createNoResponse = (): WebhookNoResponse => {
	return {
		[WebhookResponseTag]: 'noResponse',
	};
};

export const createStaticResponse = (
	body: unknown,
	code: number | undefined,
	headers: WebhookResponseHeaders | undefined,
): WebhookStaticResponse => {
	return {
		[WebhookResponseTag]: 'static',
		body,
		code,
		headers,
	};
};

export const createStreamResponse = (
	stream: Readable,
	code: number | undefined,
	headers: WebhookResponseHeaders | undefined,
): WebhookResponseStream => {
	return {
		[WebhookResponseTag]: 'stream',
		stream,
		code,
		headers,
	};
};

```
