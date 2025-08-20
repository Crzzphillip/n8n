import { AxiosError } from 'axios';
import { ResponseError } from '@n8n/rest-api-client';
import * as Sentry from '@sentry/react';

const ignoredErrors = [
	{ instanceof: AxiosError },
	{ instanceof: ResponseError, message: /ECONNREFUSED/ },
	{ instanceof: ResponseError, message: "Can't connect to n8n." },
	{ instanceof: ResponseError, message: 'Unauthorized' },
	{ instanceof: RangeError, message: /Position \d+ is out of range for changeset of length \d+/ },
	{ instanceof: RangeError, message: /Invalid change range \d+ to \d+/ },
	{ instanceof: RangeError, message: /Selection points outside of document$/ },
	{ instanceof: Error, message: /ResizeObserver/ },
] as const;

export function beforeSend(event: Sentry.Event, hint: Sentry.EventHint) {
	const { originalException } = hint ?? {};
	if (
		!originalException ||
		ignoredErrors.some((entry) => {
			const typeMatch = originalException instanceof entry.instanceof;
			if (!typeMatch) return false;
			if ('message' in entry) {
				if (entry.message instanceof RegExp) return entry.message.test((originalException as any).message ?? '');
				return (originalException as any).message === entry.message;
			}
			return true;
		})
	) {
		return null;
	}

	return event;
}

export function initSentry(): void {
	if (typeof window === 'undefined') return;
	if (!window.sentry?.dsn) return;

	const { dsn, release, environment, serverName } = window.sentry;

	Sentry.init({
		dsn,
		release,
		environment,
		integrations: [
			Sentry.captureConsoleIntegration({ levels: ['error'] }),
			Sentry.rewriteFramesIntegration({ prefix: '', root: window.location.origin + '/' }),
		],
		beforeSend,
	});

	if (serverName) {
		Sentry.setTag('server_name', serverName);
	}
}

export { Sentry };
