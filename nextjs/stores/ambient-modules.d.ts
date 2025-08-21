declare module '@n8n/stores/useRootStore' {
	export const useRootStore: any;
}

declare module '@n8n/rest-api-client/api/api-keys' {
	export const getApiKeys: any;
	export const createApiKey: any;
	export const deleteApiKey: any;
	export const updateApiKey: any;
	export const getApiKeyScopes: any;
}

declare module '@n8n/rest-api-client/api/cloudPlans' {
	export type Cloud = any;
	export const getAdminPanelLoginCode: any;
	export const getCurrentPlan: any;
	export const getCurrentUsage: any;
	export const getCloudUserInfo: any;
}

declare module '@n8n/rest-api-client/api/communityNodes' {
	export const getAvailableCommunityPackageCount: any;
	export const getInstalledCommunityNodes: any;
	export const installNewPackage: any;
	export const uninstallPackage: any;
	export const updatePackage: any;
}


