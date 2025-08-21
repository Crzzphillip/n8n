import type {
	ActionResultRequestDto,
	CommunityNodeType,
	OptionsRequestDto,
	ResourceLocatorRequestDto,
	ResourceMapperFieldsRequestDto,
} from '@n8n/api-types';
import * as nodeTypesApi from '@n8n/rest-api-client/api/nodeTypes';
import { HTTP_REQUEST_NODE_TYPE, CREDENTIAL_ONLY_HTTP_NODE_VERSION } from '@/constants';
import type { NodeTypesByTypeNameAndVersion } from '@/Interface';
import { addHeaders, addNodeTranslation } from '@n8n/i18n';
import { omit } from '@/utils/typesUtils';
import type {
	INode,
	INodeInputConfiguration,
	INodeOutputConfiguration,
	INodeTypeDescription,
	INodeTypeNameVersion,
	Workflow,
	NodeConnectionType,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeHelpers } from 'n8n-workflow';
import { useCredentialsStore } from './credentials.store';
import { useRootStore } from '@n8n/stores/useRootStore';
import * as utils from '@/utils/credentialOnlyNodes';
import { groupNodeTypesByNameAndType } from '@/utils/nodeTypes/nodeTypeTransforms';
import { useActionsGenerator } from '../components/Node/NodeCreator/composables/useActionsGeneration';
import { removePreviewToken } from '../components/Node/NodeCreator/utils';
import { useSettingsStore } from '@/stores/settings.store';
import { create } from 'zustand';

type ZNodeTypesState = {
	nodeTypes: NodeTypesByTypeNameAndVersion;
	vettedCommunityNodeTypes: Map<string, CommunityNodeType>;
	setNodeTypes: (newNodeTypes: INodeTypeDescription[]) => void;
	removeNodeTypes: (nodeTypesToRemove: INodeTypeDescription[]) => void;
	getNodesInformation: (nodeInfos: INodeTypeNameVersion[], replace?: boolean) => Promise<INodeTypeDescription[]>;
	getFullNodesProperties: (nodesToBeFetched: INodeTypeNameVersion[], replaceNodeTypes?: boolean) => Promise<void>;
	getNodeTypes: () => Promise<void>;
	loadNodeTypesIfNotLoaded: () => Promise<void>;
	getNodeTranslationHeaders: () => Promise<void>;
	fetchCommunityNodePreviews: () => Promise<void>;
	getCommunityNodeAttributes: (nodeName: string) => Promise<any>;
};

export const useNodeTypesStoreZ = create<ZNodeTypesState>((set, get) => {
	const rootStore = useRootStore();
	const actionsGenerator = useActionsGenerator();
	const settingsStore = useSettingsStore();

	const setNodeTypes = (newNodeTypes: INodeTypeDescription[] = []) => {
		const groupedNodeTypes = groupNodeTypesByNameAndType(newNodeTypes);
		set((s) => ({ nodeTypes: { ...s.nodeTypes, ...groupedNodeTypes } }));
	};

	const removeNodeTypes = (nodeTypesToRemove: INodeTypeDescription[]) => {
		set((s) => ({ nodeTypes: nodeTypesToRemove.reduce((oldNodes, newNodeType) => omit(newNodeType.name, oldNodes), s.nodeTypes) }));
	};

	const getNodesInformation = async (nodeInfos: INodeTypeNameVersion[], replace = true) => {
		const nodesInformation = await nodeTypesApi.getNodesInformation(rootStore.restApiContext, nodeInfos);
		nodesInformation.forEach((nodeInformation) => {
			if (nodeInformation.translation) {
				const nodeType = nodeInformation.name.replace('n8n-nodes-base.', '');
				addNodeTranslation({ [nodeType]: nodeInformation.translation }, rootStore.defaultLocale);
			}
		});
		if (replace) setNodeTypes(nodesInformation);
		return nodesInformation;
	};

	const getFullNodesProperties = async (nodesToBeFetched: INodeTypeNameVersion[], replaceNodeTypes = true) => {
		const credentialsStore = useCredentialsStore();
		await credentialsStore.fetchCredentialTypes(true);
		if (replaceNodeTypes) {
			await getNodesInformation(nodesToBeFetched);
		}
	};

	const getNodeTypes = async () => {
		const nodeTypes = await nodeTypesApi.getNodeTypes(rootStore.baseUrl);
		await fetchCommunityNodePreviews();
		if (nodeTypes.length) setNodeTypes(nodeTypes);
	};

	const loadNodeTypesIfNotLoaded = async () => {
		if (Object.keys(get().nodeTypes).length === 0) await getNodeTypes();
	};

	const getNodeTranslationHeaders = async () => {
		const headers = await nodeTypesApi.getNodeTranslationHeaders(rootStore.restApiContext);
		if (headers) addHeaders(headers, rootStore.defaultLocale);
	};

	const fetchCommunityNodePreviews = async () => {
		if (!settingsStore.isCommunityNodesFeatureEnabled || settingsStore.isPreviewMode) return;
		try {
			const communityNodeTypes = await nodeTypesApi.fetchCommunityNodeTypes(rootStore.restApiContext);
			set({ vettedCommunityNodeTypes: new Map(communityNodeTypes.map((nodeType) => [nodeType.name, nodeType])) });
		} catch (error) {
			set({ vettedCommunityNodeTypes: new Map() });
		}
	};

	const getCommunityNodeAttributes = async (nodeName: string) => {
		if (!settingsStore.isCommunityNodesFeatureEnabled) return null;
		try {
			return await nodeTypesApi.fetchCommunityNodeAttributes(rootStore.restApiContext, removePreviewToken(nodeName));
		} catch (error) {
			return null;
		}
	};

	return {
		nodeTypes: {},
		vettedCommunityNodeTypes: new Map<string, CommunityNodeType>(),
		setNodeTypes,
		removeNodeTypes,
		getNodesInformation,
		getFullNodesProperties,
		getNodeTypes,
		loadNodeTypesIfNotLoaded,
		getNodeTranslationHeaders,
		fetchCommunityNodePreviews,
		getCommunityNodeAttributes,
	};
});

export function useNodeTypesStore() {
	const state = useNodeTypesStoreZ.getState();
	const actionsGenerator = useActionsGenerator();
	const settingsStore = useSettingsStore();
	const rootStore = useRootStore();

	const communityNodeType = (nodeTypeName: string) => state.vettedCommunityNodeTypes.get(nodeTypeName);
	const officialCommunityNodeTypes = Array.from(state.vettedCommunityNodeTypes.values())
		.filter(({ isOfficialNode, isInstalled }) => isOfficialNode && !isInstalled)
		.map(({ nodeDescription }) => nodeDescription);
	const unofficialCommunityNodeTypes = Array.from(state.vettedCommunityNodeTypes.values())
		.filter(({ isOfficialNode, isInstalled }) => !isOfficialNode && !isInstalled)
		.map(({ nodeDescription }) => nodeDescription);
	const communityNodesAndActions = actionsGenerator.generateMergedNodesAndActions(unofficialCommunityNodeTypes, []);
	const allNodeTypes = Object.values(state.nodeTypes).flatMap((nodeType) => Object.keys(nodeType).map((version) => nodeType[Number(version)]));
	const allLatestNodeTypes = Object.values(state.nodeTypes)
		.map((nodeVersions) => {
			const versionNumbers = Object.keys(nodeVersions).map(Number);
			return nodeVersions[Math.max(...versionNumbers)];
		})
		.filter(Boolean) as INodeTypeDescription[];

	const getNodeType = (nodeTypeName: string, version?: number): INodeTypeDescription | null => {
		if (utils.isCredentialOnlyNodeType(nodeTypeName)) return getCredentialOnlyNodeType(nodeTypeName, version);
		const nodeVersions = state.nodeTypes[nodeTypeName];
		if (!nodeVersions) return null;
		const versionNumbers = Object.keys(nodeVersions).map(Number);
		const nodeType = nodeVersions[version ?? Math.max(...versionNumbers)];
		return nodeType ?? null;
	};

	const getNodeVersions = (nodeTypeName: string): number[] => Object.keys(state.nodeTypes[nodeTypeName] ?? {}).map(Number);

	const getCredentialOnlyNodeType = (nodeTypeName: string, version?: number): INodeTypeDescription | null => {
		const credentialName = utils.getCredentialTypeName(nodeTypeName);
		const httpNode = getNodeType(HTTP_REQUEST_NODE_TYPE, version ?? CREDENTIAL_ONLY_HTTP_NODE_VERSION);
		const credential = useCredentialsStore().getCredentialTypeByName(credentialName);
		return utils.getCredentialOnlyNodeType(httpNode, credential) ?? null;
	};

	const isConfigNode = (workflow: Workflow, node: INode, nodeTypeName: string): boolean => {
		if (!workflow.nodes[node.name]) return false;
		const nodeType = getNodeType(nodeTypeName);
		if (!nodeType) return false;
		const outputs = NodeHelpers.getNodeOutputs(workflow, node, nodeType);
		const outputTypes = NodeHelpers.getConnectionTypes(outputs);
		return outputTypes ? outputTypes.filter((output) => output !== NodeConnectionTypes.Main).length > 0 : false;
	};

	const isTriggerNode = (nodeTypeName: string) => {
		const nodeType = getNodeType(nodeTypeName);
		return !!(nodeType && nodeType.group.includes('trigger'));
	};

	const isToolNode = (nodeTypeName: string) => {
		const nodeType = getNodeType(nodeTypeName);
		if (nodeType?.outputs && Array.isArray(nodeType.outputs)) {
			const outputTypes = nodeType.outputs.map((output: NodeConnectionType | INodeOutputConfiguration) => (typeof output === 'string' ? output : output.type));
			return outputTypes.includes(NodeConnectionTypes.AiTool);
		} else {
			return (nodeType?.outputs as string[]).includes(NodeConnectionTypes.AiTool) ?? false;
		}
	};

	const isCoreNodeType = (nodeType: INodeTypeDescription) => nodeType.codex?.categories?.includes('Core Nodes') ?? false;
	const visibleNodeTypes = allLatestNodeTypes.concat(officialCommunityNodeTypes).filter((nodeType) => !nodeType.hidden);
	const nativelyNumberSuffixedDefaults = allNodeTypes.reduce<string[]>((acc, cur) => { if (/\d$/.test(cur.defaults.name as string)) acc.push(cur.defaults.name as string); return acc; }, []);
	const visibleNodeTypesByOutputConnectionTypeNames = visibleNodeTypes.reduce((acc: { [key: string]: string[] }, node) => {
		const outputTypes = node.outputs;
		if (Array.isArray(outputTypes)) {
			outputTypes.forEach((value: NodeConnectionType | INodeOutputConfiguration) => {
				const outputType = typeof value === 'string' ? value : value.type;
				if (!acc[outputType]) acc[outputType] = [];
				acc[outputType].push(node.name);
			});
		} else {
			const connectorTypes: NodeConnectionType[] = [
				NodeConnectionTypes.AiVectorStore,
				NodeConnectionTypes.AiChain,
				NodeConnectionTypes.AiDocument,
				NodeConnectionTypes.AiEmbedding,
				NodeConnectionTypes.AiLanguageModel,
				NodeConnectionTypes.AiMemory,
				NodeConnectionTypes.AiOutputParser,
				NodeConnectionTypes.AiTextSplitter,
				NodeConnectionTypes.AiTool,
			];
			connectorTypes.forEach((outputType: NodeConnectionType) => {
				if ((outputTypes as string).includes(outputType)) {
					acc[outputType] = acc[outputType] || [];
					acc[outputType].push(node.name);
				}
			});
		}
		return acc;
	}, {} as { [key: string]: string[] });

	const visibleNodeTypesByInputConnectionTypeNames = visibleNodeTypes.reduce((acc: { [key: string]: string[] }, node) => {
		const inputTypes = node.inputs;
		if (Array.isArray(inputTypes)) {
			inputTypes.forEach((value: NodeConnectionType | INodeOutputConfiguration | INodeInputConfiguration) => {
				const outputType = typeof value === 'string' ? value : (value as any).type;
				if (!acc[outputType]) acc[outputType] = [];
				acc[outputType].push(node.name);
			});
		}
		return acc;
	}, {} as { [key: string]: string[] });

	const isConfigurableNode = (workflow: Workflow, node: INode, nodeTypeName: string): boolean => {
		const nodeType = getNodeType(nodeTypeName);
		if (nodeType === null) return false;
		const inputs = NodeHelpers.getNodeInputs(workflow, node, nodeType);
		const inputTypes = NodeHelpers.getConnectionTypes(inputs);
		return inputTypes ? inputTypes.filter((input) => input !== NodeConnectionTypes.Main).length > 0 : false;
	};

	return {
		nodeTypes: state.nodeTypes,
		allNodeTypes,
		allLatestNodeTypes,
		getNodeType,
		getNodeVersions,
		getCredentialOnlyNodeType,
		isConfigNode,
		isTriggerNode,
		isToolNode,
		isCoreNodeType,
		visibleNodeTypes,
		nativelyNumberSuffixedDefaults,
		visibleNodeTypesByOutputConnectionTypeNames,
		visibleNodeTypesByInputConnectionTypeNames,
		isConfigurableNode,
		communityNodesAndActions,
		communityNodeType,
		getResourceMapperFields: (sendData: ResourceMapperFieldsRequestDto) => nodeTypesApi.getResourceMapperFields(rootStore.restApiContext, sendData).catch(() => null),
		getLocalResourceMapperFields: (sendData: ResourceMapperFieldsRequestDto) => nodeTypesApi.getLocalResourceMapperFields(rootStore.restApiContext, sendData).catch(() => null),
		getNodeParameterActionResult: (sendData: ActionResultRequestDto) => nodeTypesApi.getNodeParameterActionResult(rootStore.restApiContext, sendData),
		getResourceLocatorResults: (sendData: ResourceLocatorRequestDto) => nodeTypesApi.getResourceLocatorResults(rootStore.restApiContext, sendData),
		getNodeParameterOptions: (sendData: OptionsRequestDto) => nodeTypesApi.getNodeParameterOptions(rootStore.restApiContext, sendData),
		getNodesInformation: state.getNodesInformation,
		getFullNodesProperties: state.getFullNodesProperties,
		getNodeTypes: state.getNodeTypes,
		loadNodeTypesIfNotLoaded: state.loadNodeTypesIfNotLoaded,
		getNodeTranslationHeaders: state.getNodeTranslationHeaders,
		setNodeTypes: state.setNodeTypes,
		removeNodeTypes: state.removeNodeTypes,
		getCommunityNodeAttributes: state.getCommunityNodeAttributes,
	};
}
