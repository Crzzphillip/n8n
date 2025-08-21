import { useRootStore } from '@n8n/stores/useRootStore';
import * as publicApiApi from '@n8n/rest-api-client/api/api-keys';
import type { ApiKey, CreateApiKeyRequestDto, UpdateApiKeyRequestDto } from '@n8n/api-types';
import type { ApiKeyScope } from '@n8n/permissions';

type Ref<T> = { value: T };
const ref = <T>(initial: T): Ref<T> => ({ value: initial });

function computed<T>(getter: () => T): { readonly value: T } {
	return {
		get value() {
			return getter();
		},
	} as const;
}

type ApiKeysStore = ReturnType<typeof createApiKeysStore>;
let singleton: ApiKeysStore | undefined;

function createApiKeysStore() {
	const apiKeys = ref<ApiKey[]>([]);
	const availableScopes = ref<ApiKeyScope[]>([]);

	const rootStore = useRootStore();

	const apiKeysSortByCreationDate = computed(() =>
		[...apiKeys.value].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
	);

	const apiKeysById = computed(() => {
		return apiKeys.value.reduce(
			(acc, apiKey) => {
				acc[apiKey.id] = apiKey;
				return acc;
			},
			{} as Record<string, ApiKey>,
		);
	});

	const getApiKeyAvailableScopes = async () => {
		availableScopes.value = await publicApiApi.getApiKeyScopes(rootStore.restApiContext);
		return availableScopes.value;
	};

	const getAndCacheApiKeys = async () => {
		if (apiKeys.value.length) return apiKeys.value;
		apiKeys.value = await publicApiApi.getApiKeys(rootStore.restApiContext);
		return apiKeys.value;
	};

	const createApiKey = async (payload: CreateApiKeyRequestDto) => {
		const newApiKey = await publicApiApi.createApiKey(rootStore.restApiContext, payload);
		const { rawApiKey, ...rest } = newApiKey;
		apiKeys.value = [...apiKeys.value, rest];
		return newApiKey;
	};

	const deleteApiKey = async (id: string) => {
		await publicApiApi.deleteApiKey(rootStore.restApiContext, id);
		apiKeys.value = apiKeys.value.filter((apiKey) => apiKey.id !== id);
	};

	const updateApiKey = async (id: string, payload: UpdateApiKeyRequestDto) => {
		await publicApiApi.updateApiKey(rootStore.restApiContext, id, payload);
		const map = apiKeysById.value;
		if (map[id]) {
			map[id].label = payload.label;
			map[id].scopes = payload.scopes;
			apiKeys.value = apiKeys.value.map((k) => (k.id === id ? { ...k, ...map[id] } : k));
		}
	};

	return {
		getAndCacheApiKeys,
		createApiKey,
		deleteApiKey,
		updateApiKey,
		getApiKeyAvailableScopes,
		apiKeysSortByCreationDate,
		apiKeysById,
		apiKeys,
		availableScopes,
	};
}

export const useApiKeysStore = () => {
	if (!singleton) singleton = createApiKeysStore();
	return singleton;
};


