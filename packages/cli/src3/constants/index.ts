// Node Types
export const CHAT_TRIGGER_NODE_TYPE = 'n8n-chat-trigger';
export const MANUAL_CHAT_TRIGGER_NODE_TYPE = 'n8n-manual-chat-trigger';
export const START_NODE_TYPE = 'n8n-start';
export const STICKY_NODE_TYPE = 'n8n-nodes-base.stickyNote';
export const EVALUATION_TRIGGER_NODE_TYPE = 'n8n-evaluation-trigger';
export const EVALUATION_NODE_TYPE = 'n8n-evaluation';

// Drag Events
export const DRAG_EVENT_DATA_KEY = 'application/x-sv-node';

// Enterprise Features
export const EnterpriseEditionFeature = {
	Variables: 'variables',
	ExternalSecrets: 'externalSecrets',
} as const;

// Feature Flags
export const FOCUS_PANEL_EXPERIMENT = {
	name: 'focus-panel',
	variant: 'enabled',
} as const;

export const NDV_UI_OVERHAUL_EXPERIMENT = {
	name: 'ndv-ui-overhaul',
	variant: 'enabled',
} as const;

// Modal Keys
export const FROM_AI_PARAMETERS_MODAL_KEY = 'from-ai-parameters';
export const WORKFLOW_SETTINGS_MODAL_KEY = 'workflow-settings';
export const MODAL_CONFIRM = 'confirm';
export const NPS_SURVEY_MODAL_KEY = 'npsSurvey';

// Header Tabs
export const MAIN_HEADER_TABS = {
	WORKFLOWS: 'workflows',
	EXECUTIONS: 'executions',
	SETTINGS: 'settings',
} as const;

// Workflow IDs
export const NEW_WORKFLOW_ID = 'new';
export const PLACEHOLDER_EMPTY_WORKFLOW_ID = 'placeholder-empty';

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
export const VALID_WORKFLOW_IMPORT_URL_REGEX = /^https?:\/\/.+/;

// Views
export const VIEWS = {
	NEW_WORKFLOW: 'new-workflow',
	WORKFLOW: 'workflow',
	DEMO: 'demo',
	TEMPLATE_IMPORT: 'template-import',
} as const;
