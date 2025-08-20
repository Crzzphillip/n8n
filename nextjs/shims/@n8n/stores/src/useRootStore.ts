import { randomString, setGlobalState } from 'n8n-workflow';
import { create } from 'zustand';

export type RootStoreState = {
	baseUrl: string;
	restEndpoint: string;
	defaultLocale: string;
	endpointForm: string;
	endpointFormTest: string;
	endpointFormWaiting: string;
	endpointMcp: string;
	endpointMcpTest: string;
	endpointWebhook: string;
	endpointWebhookTest: string;
	endpointWebhookWaiting: string;
	timezone: string;
	executionTimeout: number;
	maxExecutionTimeout: number;
	versionCli: string;
	oauthCallbackUrls: object;
	n8nMetadata: {
		[key: string]: string | number | undefined;
	};
	pushRef: string;
	urlBaseWebhook: string;
	urlBaseEditor: string;
	instanceId: string;
	binaryDataMode: 'default' | 'filesystem' | 's3';
};

type RootStoreDerived = {
	formUrl: string;
	formTestUrl: string;
	formWaitingUrl: string;
	mcpUrl: string;
	mcpTestUrl: string;
	webhookUrl: string;
	webhookTestUrl: string;
	webhookWaitingUrl: string;
	restUrl: string;
	restApiContext: {
		baseUrl: string;
		pushRef: string;
	};
	OAuthCallbackUrls: object;
};

type RootStoreActions = {
	setUrlBaseWebhook: (value: string) => void;
	setUrlBaseEditor: (value: string) => void;
	setEndpointForm: (value: string) => void;
	setEndpointFormTest: (value: string) => void;
	setEndpointFormWaiting: (value: string) => void;
	setEndpointWebhook: (value: string) => void;
	setEndpointWebhookTest: (value: string) => void;
	setEndpointWebhookWaiting: (value: string) => void;
	setEndpointMcp: (value: string) => void;
	setEndpointMcpTest: (value: string) => void;
	setTimezone: (value: string) => void;
	setExecutionTimeout: (value: number) => void;
	setMaxExecutionTimeout: (value: number) => void;
	setVersionCli: (value: string) => void;
	setInstanceId: (value: string) => void;
	setOauthCallbackUrls: (value: RootStoreState['oauthCallbackUrls']) => void;
	setN8nMetadata: (value: RootStoreState['n8nMetadata']) => void;
	setDefaultLocale: (value: string) => void;
	setBinaryDataMode: (value: RootStoreState['binaryDataMode']) => void;
};

type RootStore = RootStoreState & RootStoreDerived & RootStoreActions;

const getEnvBaseApi = (): string | undefined => {
	const v = process.env.NEXT_PUBLIC_VUE_APP_URL_BASE_API || process.env.NEXT_PUBLIC_URL_BASE_API;
	return typeof v === 'string' && v.length > 0 ? v : undefined;
};

const initialBaseUrl = getEnvBaseApi() ?? (typeof window !== 'undefined' ? (window as any).BASE_PATH : '/') ?? '/';

const initialRestEndpoint = (() => {
	const winRest = typeof window !== 'undefined' ? (window as any).REST_ENDPOINT : undefined;
	if (!winRest || winRest === '{{REST_ENDPOINT}}') return 'rest';
	return winRest as string;
})();

const computeDerivedFields = (s: RootStoreState): RootStoreDerived => {
	const formUrl = `${s.urlBaseWebhook}${s.endpointForm}`;
	const formTestUrl = `${s.urlBaseEditor}${s.endpointFormTest}`;
	const formWaitingUrl = `${s.urlBaseEditor}${s.endpointFormWaiting}`;
	const webhookUrl = `${s.urlBaseWebhook}${s.endpointWebhook}`;
	const webhookTestUrl = `${s.urlBaseEditor}${s.endpointWebhookTest}`;
	const webhookWaitingUrl = `${s.urlBaseEditor}${s.endpointWebhookWaiting}`;
	const mcpUrl = `${s.urlBaseWebhook}${s.endpointMcp}`;
	const mcpTestUrl = `${s.urlBaseEditor}${s.endpointMcpTest}`;
	const restUrl = `${s.baseUrl}${s.restEndpoint}`;
	return {
		formUrl,
		formTestUrl,
		formWaitingUrl,
		mcpUrl,
		mcpTestUrl,
		webhookUrl,
		webhookTestUrl,
		webhookWaitingUrl,
		restUrl,
		restApiContext: { baseUrl: restUrl, pushRef: s.pushRef },
		OAuthCallbackUrls: s.oauthCallbackUrls,
	};
};

export const useRootStore = create<RootStore>(((set: any, get: () => RootStore) => {
	const initialBase: RootStoreState = {
		baseUrl: initialBaseUrl,
		restEndpoint: initialRestEndpoint,
		defaultLocale: 'en',
		endpointForm: 'form',
		endpointFormTest: 'form-test',
		endpointFormWaiting: 'form-waiting',
		endpointMcp: 'mcp',
		endpointMcpTest: 'mcp-test',
		endpointWebhook: 'webhook',
		endpointWebhookTest: 'webhook-test',
		endpointWebhookWaiting: 'webhook-waiting',
		timezone: 'America/New_York',
		executionTimeout: -1,
		maxExecutionTimeout: Number.MAX_SAFE_INTEGER,
		versionCli: '0.0.0',
		oauthCallbackUrls: {},
		n8nMetadata: {},
		pushRef: randomString(10).toLowerCase(),
		urlBaseWebhook: 'http://localhost:5678/',
		urlBaseEditor: 'http://localhost:5678',
		instanceId: '',
		binaryDataMode: 'default',
	};

	return {
		...initialBase,
		...computeDerivedFields(initialBase),
		setUrlBaseWebhook: (value: string) => {
			const url = value.endsWith('/') ? value : `${value}/`;
			set(() => {
				const base: RootStoreState = { ...(get() as RootStoreState) } as RootStoreState;
				base.urlBaseWebhook = url;
				return { urlBaseWebhook: url, ...computeDerivedFields(base) } as Partial<RootStore>;
			});
		},
		setUrlBaseEditor: (value: string) => {
			const url = value.endsWith('/') ? value : `${value}/`;
			set(() => {
				const base: RootStoreState = { ...(get() as RootStoreState) } as RootStoreState;
				base.urlBaseEditor = url;
				return { urlBaseEditor: url, ...computeDerivedFields(base) } as Partial<RootStore>;
			});
		},
		setEndpointForm: (value: string) => {
			set(() => {
				const base: RootStoreState = { ...(get() as RootStoreState) } as RootStoreState;
				base.endpointForm = value;
				return { endpointForm: value, ...computeDerivedFields(base) } as Partial<RootStore>;
			});
		},
		setEndpointFormTest: (value: string) => {
			set(() => {
				const base: RootStoreState = { ...(get() as RootStoreState) } as RootStoreState;
				base.endpointFormTest = value;
				return { endpointFormTest: value, ...computeDerivedFields(base) } as Partial<RootStore>;
			});
		},
		setEndpointFormWaiting: (value: string) => {
			set(() => {
				const base: RootStoreState = { ...(get() as RootStoreState) } as RootStoreState;
				base.endpointFormWaiting = value;
				return { endpointFormWaiting: value, ...computeDerivedFields(base) } as Partial<RootStore>;
			});
		},
		setEndpointWebhook: (value: string) => {
			set(() => {
				const base: RootStoreState = { ...(get() as RootStoreState) } as RootStoreState;
				base.endpointWebhook = value;
				return { endpointWebhook: value, ...computeDerivedFields(base) } as Partial<RootStore>;
			});
		},
		setEndpointWebhookTest: (value: string) => {
			set(() => {
				const base: RootStoreState = { ...(get() as RootStoreState) } as RootStoreState;
				base.endpointWebhookTest = value;
				return { endpointWebhookTest: value, ...computeDerivedFields(base) } as Partial<RootStore>;
			});
		},
		setEndpointWebhookWaiting: (value: string) => {
			set(() => {
				const base: RootStoreState = { ...(get() as RootStoreState) } as RootStoreState;
				base.endpointWebhookWaiting = value;
				return { endpointWebhookWaiting: value, ...computeDerivedFields(base) } as Partial<RootStore>;
			});
		},
		setEndpointMcp: (value: string) => {
			set(() => {
				const base: RootStoreState = { ...(get() as RootStoreState) } as RootStoreState;
				base.endpointMcp = value;
				return { endpointMcp: value, ...computeDerivedFields(base) } as Partial<RootStore>;
			});
		},
		setEndpointMcpTest: (value: string) => {
			set(() => {
				const base: RootStoreState = { ...(get() as RootStoreState) } as RootStoreState;
				base.endpointMcpTest = value;
				return { endpointMcpTest: value, ...computeDerivedFields(base) } as Partial<RootStore>;
			});
		},
		setTimezone: (value: string) => {
			set(() => {
				const base: RootStoreState = { ...(get() as RootStoreState) } as RootStoreState;
				base.timezone = value;
				setGlobalState({ defaultTimezone: value });
				return { timezone: value, ...computeDerivedFields(base) } as Partial<RootStore>;
			});
		},
		setExecutionTimeout: (value: number) => {
			set(() => ({ executionTimeout: value } as Partial<RootStore>));
		},
		setMaxExecutionTimeout: (value: number) => {
			set(() => ({ maxExecutionTimeout: value } as Partial<RootStore>));
		},
		setVersionCli: (value: string) => {
			set(() => ({ versionCli: value } as Partial<RootStore>));
		},
		setInstanceId: (value: string) => {
			set(() => ({ instanceId: value } as Partial<RootStore>));
		},
		setOauthCallbackUrls: (value: RootStoreState['oauthCallbackUrls']) => {
			set(() => {
				const base: RootStoreState = { ...(get() as RootStoreState) } as RootStoreState;
				base.oauthCallbackUrls = value;
				return { oauthCallbackUrls: value, ...computeDerivedFields(base) } as Partial<RootStore>;
			});
		},
		setN8nMetadata: (value: RootStoreState['n8nMetadata']) => {
			set(() => ({ n8nMetadata: value } as Partial<RootStore>));
		},
		setDefaultLocale: (value: string) => {
			set(() => ({ defaultLocale: value } as Partial<RootStore>));
		},
		setBinaryDataMode: (value: RootStoreState['binaryDataMode']) => {
			set(() => ({ binaryDataMode: value } as Partial<RootStore>));
		},
	};
}) as any);


