## Node and Credential Loading

File: `src/load-nodes-and-credentials.ts`

### Goals
- Discover and lazily load nodes and credentials from multiple sources: base packages, community packages, and custom directories.
- Maintain three views:
  - `known`: names and source paths
  - `types`: descriptions for frontend
  - `loaded`: instantiated classes for execution

### Sources and loaders
- Base paths include the CLI dir and its `node_modules` sibling.
- Community packages are loaded from `InstanceSettings.nodesDownloadDir/node_modules` when enabled.
- Custom directories are provided via `InstanceSettings.customExtensionDir` and env `N8N_CUSTOM_EXTENSIONS`.
- Loaders:
  - `LazyPackageDirectoryLoader`: lazily resolves node/credential classes
  - `PackageDirectoryLoader`: eager load for installed packages
  - `CustomDirectoryLoader`: for local/custom folders

### Post-processing
- `postProcessLoaders()` merges all loaders into unified maps, prefixes node names with their package, and maps supported nodes on credentials.
- `injectCustomApiCallOptions()` augments latest-version nodes that support proxy auth with a "Custom API Call" option on `resource`/`operation` selectors.
- `createAiTools()` generates AI Agent tools by cloning `usableAsTool` node descriptions and adjusting inputs/outputs and properties.

### Resolution helpers
- `resolveIcon()` and `resolveSchema()` back UI endpoints under `/icons/...` and `/schemas/...`.
- `recognizesNode()`, `getNode()`, `getCredential()` provide runtime lookup with helpful errors for unknown types.

### Why this design works
- Keeps startup lean by lazy-loading heavy packages while still exposing full type metadata to the frontend.
- Makes community and custom packages first-class citizens without compromising security (path containment checks).