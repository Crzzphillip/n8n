// Node Types
export const CHAT_TRIGGER_NODE_TYPE = '@n8n/n8n-nodes-langchain.chatTrigger';
export const MANUAL_CHAT_TRIGGER_NODE_TYPE = '@n8n/n8n-nodes-langchain.manualChatTrigger';
export const START_NODE_TYPE = 'n8n-nodes-base.start';
export const STICKY_NODE_TYPE = 'n8n-nodes-base.stickyNote';
export const EVALUATION_TRIGGER_NODE_TYPE = 'n8n-nodes-base.evaluationTrigger';
export const EVALUATION_NODE_TYPE = 'n8n-nodes-base.evaluation';

// Drag Events
export const DRAG_EVENT_DATA_KEY = 'nodesAndConnections';

// Enterprise Features (subset used in NodeView)
export const EnterpriseEditionFeature = {
	Variables: 'variables',
	ExternalSecrets: 'externalSecrets',
} as const;

// Feature Flags (align names/variants with Vue)
export const FOCUS_PANEL_EXPERIMENT = {
	name: 'focus_panel',
	variant: 'variant',
} as const;

export const NDV_UI_OVERHAUL_EXPERIMENT = {
	name: '029_ndv_ui_overhaul',
	variant: 'variant',
} as const;

// Modal Keys
export const FROM_AI_PARAMETERS_MODAL_KEY = 'fromAiParameters';
export const WORKFLOW_SETTINGS_MODAL_KEY = 'settings';
export const MODAL_CONFIRM = 'confirm';
export const NPS_SURVEY_MODAL_KEY = 'npsSurvey';

// Header Tabs (use enum-like keys to mirror Vue)
export const MAIN_HEADER_TABS = {
	WORKFLOW: 'workflow',
	EXECUTIONS: 'executions',
	SETTINGS: 'settings',
	EVALUATION: 'evaluation',
} as const;

// Workflow IDs
export const NEW_WORKFLOW_ID = 'new';
export const PLACEHOLDER_EMPTY_WORKFLOW_ID = '__EMPTY__';

// Node Creator Sources
export const NODE_CREATOR_OPEN_SOURCES = {
	ADD_EVALUATION_TRIGGER_BUTTON: 'add-evaluation-trigger-button',
	ADD_EVALUATION_NODE_BUTTON: 'add-evaluation-node-button',
	NOTICE_ERROR_MESSAGE: 'notice-error-message',
	PLUS_ENDPOINT: 'plus_endpoint',
	TAB: 'tab',
	NODE_CONNECTION_ACTION: 'node_connection_action',
	NODE_CONNECTION_DROP: 'node_connection_drop',
} as const;

export const AI_UNCATEGORIZED_CATEGORY = 'ai-uncategorized';

// URL Validation
export const VALID_WORKFLOW_IMPORT_URL_REGEX = /^http[s]?:\/\/.*\.json$/i;

// Views (route names)
export const VIEWS = {
	NEW_WORKFLOW: 'new-workflow',
	WORKFLOW: 'workflow',
	DEMO: 'demo',
	TEMPLATE_IMPORT: 'template-import',
	EXECUTION_DEBUG: 'execution',
} as const;
