### src2/services/__tests__/workflow-statistics.service.test.ts

Overview: src2/services/__tests__/workflow-statistics.service.test.ts provides a service encapsulating domain/business logic and integrations.

How it works: The service is injected where needed via the container. It aggregates repositories, utilities, and external APIs, exposing cohesive methods consumed by controllers, commands, or other services.

Why it’s designed this way: Concentrating domain behavior in services avoids fat controllers and enables clear unit testing boundaries. DI enables mocking dependencies and late binding of environment-specific implementations.

This component follows sv’s dependency-injection and modular architecture to keep responsibilities focused and testable. Decorators (e.g., @Service, @RestController, @Command) make wiring explicit while deferring lifecycle and registration to the container.
