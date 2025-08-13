### src2/commands/base-command.ts

Overview: src2/commands/base-command.ts declares a CLI command (BaseCommand), integrating into sv’s command runner.

How it works: At runtime, the base command bootstraps error reporting, configuration, DB, node/credential loading, and optional modules. The command class implements the workflow for its subtask, relying on shared services and repositories.

Why it’s designed this way: Centralized boot logic ensures consistent environments across commands, while dedicated classes keep each command’s behavior self-contained and composable.

This component follows sv’s dependency-injection and modular architecture to keep responsibilities focused and testable. Decorators (e.g., @Service, @RestController, @Command) make wiring explicit while deferring lifecycle and registration to the container.
