### src2/middlewares/list-query/sort-by.ts

Overview: src2/middlewares/list-query/sort-by.ts defines an Express middleware for request parsing, security headers, or query helpers.

How it works: It attaches to the Express pipeline before controllers and shapes requests into validated forms or enforces policies.

Why it’s designed this way: Middlewares separate cross-cutting HTTP concerns from controllers to keep handlers focused.

This component follows sv’s dependency-injection and modular architecture to keep responsibilities focused and testable. Decorators (e.g., @Service, @RestController, @Command) make wiring explicit while deferring lifecycle and registration to the container.
