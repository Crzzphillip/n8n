## src2/push/types.ts

Overview: src2/push/types.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Imports

- import type { AuthenticatedRequest, User } from '@n8n/db';
- import type { Request, Response } from 'express';
- import type { WebSocket } from 'ws';

### Declarations

- Exports: PushRequest, SSEPushRequest, WebSocketPushRequest, PushResponse, OnPushMessage

### Recreate

Place this file at `src2/push/types.ts` and use the following source:

```ts
import type { AuthenticatedRequest, User } from '@n8n/db';
import type { Request, Response } from 'express';
import type { WebSocket } from 'ws';

// TODO: move all push related types here

export type PushRequest = AuthenticatedRequest<{}, {}, {}, { pushRef: string }>;

export type SSEPushRequest = PushRequest & { ws: undefined };
export type WebSocketPushRequest = PushRequest & {
	ws: WebSocket;
	headers: Request['headers'];
};

export type PushResponse = Response & {
	req: PushRequest;
	/**
	 * `flush()` is defined in the compression middleware.
	 * This is necessary because the compression middleware sometimes waits
	 * for a certain amount of data before sending the data to the client
	 */
	flush: () => void;
};

export interface OnPushMessage {
	pushRef: string;
	userId: User['id'];
	msg: unknown;
}

```
