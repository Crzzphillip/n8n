### src2/controllers/__tests__/api-keys.controller.test.ts

Overview: src2/controllers/__tests__/api-keys.controller.test.ts defines an HTTP controller that exposes Express routes for a focused domain. 

How it works: The controller is discovered via side-effect imports in the server bootstrap and registered by the ControllerRegistry. Each handler delegates to services for business logic, keeping the controller thin and transport-oriented. Validation and DTOs are colocated where needed.

Why it’s designed this way: Separating transport (controller) from domain services promotes testability and reusability. Using decorators centralizes route definition and favors convention over configuration for consistent endpoint registration.

This component follows sv’s dependency-injection and modular architecture to keep responsibilities focused and testable. Decorators (e.g., @Service, @RestController, @Command) make wiring explicit while deferring lifecycle and registration to the container.
