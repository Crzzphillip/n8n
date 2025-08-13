### src2/user-management/email/user-management-mailer.ts

Overview: src2/user-management/email/user-management-mailer.ts is a core component defining class UserManagementMailer within the sv CLI runtime.

How it works: It composes with neighboring modules through DI, typed configs, and shared types to implement its specific responsibility.

Why it’s designed this way: Clear modular boundaries and typed contracts keep the codebase maintainable and evolvable.

This component follows sv’s dependency-injection and modular architecture to keep responsibilities focused and testable. Decorators (e.g., @Service, @RestController, @Command) make wiring explicit while deferring lifecycle and registration to the container.
