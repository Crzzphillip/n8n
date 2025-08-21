import { EnterpriseEditionFeature } from '@/constants';
import { useSettingsStore } from '@/stores/settings.store';

function computed<T>(getter: () => T): { readonly value: T } {
	return {
		get value() {
			return getter();
		},
	} as const;
}

type AuditLogsStore = ReturnType<typeof createAuditLogsStore>;
let singleton: AuditLogsStore | undefined;

function createAuditLogsStore() {
	const settingsStore = useSettingsStore();

	const isEnterpriseAuditLogsFeatureEnabled = computed(
		() => settingsStore.isEnterpriseFeatureEnabled[EnterpriseEditionFeature.AuditLogs],
	);

	return {
		isEnterpriseAuditLogsFeatureEnabled,
	};
}

export const useAuditLogsStore = () => {
	if (!singleton) singleton = createAuditLogsStore();
	return singleton;
};
