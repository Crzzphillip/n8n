### src2/metrics/license-metrics.service.ts

Overview: src2/metrics/license-metrics.service.ts integrates Prometheus-compatible metrics into the HTTP server.

How it works: The service registers middleware and endpoints, collecting process and application metrics for scraping.

Why it’s designed this way: First-class metrics enable SRE workflows without burdening application code paths.

This component follows sv’s dependency-injection and modular architecture to keep responsibilities focused and testable. Decorators (e.g., @Service, @RestController, @Command) make wiring explicit while deferring lifecycle and registration to the container.
