## src2/environments.ee/source-control/constants.ts

Overview: src2/environments.ee/source-control/constants.ts is a core component within the sv CLI runtime.

How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.

Why: Clear modular boundaries and typed contracts keep the code maintainable.

### Declarations

- Exports: SOURCE_CONTROL_PREFERENCES_DB_KEY, SOURCE_CONTROL_GIT_FOLDER, SOURCE_CONTROL_GIT_KEY_COMMENT, SOURCE_CONTROL_WORKFLOW_EXPORT_FOLDER, SOURCE_CONTROL_CREDENTIAL_EXPORT_FOLDER, SOURCE_CONTROL_VARIABLES_EXPORT_FILE, SOURCE_CONTROL_TAGS_EXPORT_FILE, SOURCE_CONTROL_FOLDERS_EXPORT_FILE, SOURCE_CONTROL_OWNERS_EXPORT_FILE, SOURCE_CONTROL_SSH_FOLDER, SOURCE_CONTROL_SSH_KEY_NAME, SOURCE_CONTROL_DEFAULT_BRANCH, SOURCE_CONTROL_ORIGIN, SOURCE_CONTROL_README, SOURCE_CONTROL_DEFAULT_NAME, SOURCE_CONTROL_DEFAULT_EMAIL

### Recreate

Place this file at `src2/environments.ee/source-control/constants.ts` and use the following source:

```ts
export const SOURCE_CONTROL_PREFERENCES_DB_KEY = 'features.sourceControl';
export const SOURCE_CONTROL_GIT_FOLDER = 'git';
export const SOURCE_CONTROL_GIT_KEY_COMMENT = 'sv deploy key';
export const SOURCE_CONTROL_WORKFLOW_EXPORT_FOLDER = 'workflows';
export const SOURCE_CONTROL_CREDENTIAL_EXPORT_FOLDER = 'credential_stubs';
export const SOURCE_CONTROL_VARIABLES_EXPORT_FILE = 'variable_stubs.json';
export const SOURCE_CONTROL_TAGS_EXPORT_FILE = 'tags.json';
export const SOURCE_CONTROL_FOLDERS_EXPORT_FILE = 'folders.json';
export const SOURCE_CONTROL_OWNERS_EXPORT_FILE = 'workflow_owners.json';
export const SOURCE_CONTROL_SSH_FOLDER = 'ssh';
export const SOURCE_CONTROL_SSH_KEY_NAME = 'key';
export const SOURCE_CONTROL_DEFAULT_BRANCH = 'main';
export const SOURCE_CONTROL_ORIGIN = 'origin';
export const SOURCE_CONTROL_README = `
# sv Source Control
`;
export const SOURCE_CONTROL_DEFAULT_NAME = 'sv user';
export const SOURCE_CONTROL_DEFAULT_EMAIL = 'n8n@example.com';

```
