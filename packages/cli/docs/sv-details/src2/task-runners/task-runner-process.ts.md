### src2/task-runners/task-runner-process.ts

Overview: src2/task-runners/task-runner-process.ts belongs to the task runner subsystem for isolated background work.

How it works: Supervisors manage worker processes, restart heuristics, disconnect analysis, and signaling interfaces.

Why it’s designed this way: Isolation improves robustness and security by containing failures and privileges.

This component follows sv’s dependency-injection and modular architecture to keep responsibilities focused and testable. Decorators (e.g., @Service, @RestController, @Command) make wiring explicit while deferring lifecycle and registration to the container.
