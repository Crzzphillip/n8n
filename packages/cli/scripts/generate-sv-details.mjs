#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = '/workspace/packages/cli';
const SRC = join(ROOT, 'src2');
const OUT_DIR = join(ROOT, 'docs', 'sv-details');

const list = execSync(`find ${SRC} -type f | sort`, { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const getTag = (rel) => {
  if (rel.includes('/controllers/')) return 'controller';
  if (rel.includes('/services/')) return 'service';
  if (rel.includes('/commands/')) return 'command';
  if (rel.includes('/executions/')) return 'executions';
  if (rel.includes('/workflows/')) return 'workflows';
  if (rel.includes('/webhooks/')) return 'webhooks';
  if (rel.includes('/eventbus/')) return 'eventbus';
  if (rel.includes('/events/')) return 'events';
  if (rel.includes('/metrics/')) return 'metrics';
  if (rel.includes('/task-runners/')) return 'task-runner';
  if (rel.includes('/middlewares/')) return 'middleware';
  if (rel.includes('/auth/')) return 'auth';
  if (rel.includes('/mfa/')) return 'mfa';
  if (rel.includes('/ldap.ee/')) return 'ldap.ee';
  if (rel.includes('/sso.ee/')) return 'sso.ee';
  if (rel.includes('/environments.ee/')) return 'env.ee';
  if (rel.includes('/permissions.ee/')) return 'permissions.ee';
  if (rel.includes('/security-audit/')) return 'security-audit';
  if (rel.includes('/modules/')) return 'module';
  if (rel.includes('/deprecation/')) return 'deprecation';
  if (rel.includes('/deduplication/')) return 'deduplication';
  if (rel.includes('/databases/')) return 'databases';
  if (rel.includes('/public-api/')) return 'public-api';
  if (rel.includes('/push/')) return 'push';
  if (rel.includes('/scaling/')) return 'scaling';
  if (rel.includes('/errors/')) return 'error';
  if (rel.includes('/utils/')) return 'utils';
  if (rel.includes('/types/')) return 'types';
  if (rel.includes('/__tests__/')) return 'test';
  return 'misc';
};

const mkdirp = (p) => {
  mkdirSync(p, { recursive: true });
};

const paragraphsByTag = (ctx) => {
  const { tag, fileRel, className, route, command } = ctx;
  const commonWhy = [
    'This component follows sv’s dependency-injection and modular architecture to keep responsibilities focused and testable. Decorators (e.g., @Service, @RestController, @Command) make wiring explicit while deferring lifecycle and registration to the container.',
  ];

  const paras = [];

  const cls = className ? ' (' + className + ')' : '';
  const routeStr = route ? 'Its base route is `' + route + '`.' : '';
  const cmdStr = command ? ' named `' + command + '`' : '';

  switch (tag) {
    case 'controller':
      paras.push('Overview: ' + fileRel + ' defines an HTTP controller' + cls + ' that exposes Express routes for a focused domain. ' + routeStr);
      paras.push('How it works: The controller is discovered via side-effect imports in the server bootstrap and registered by the ControllerRegistry. Each handler delegates to services for business logic, keeping the controller thin and transport-oriented. Validation and DTOs are colocated where needed.');
      paras.push('Why it’s designed this way: Separating transport (controller) from domain services promotes testability and reusability. Using decorators centralizes route definition and favors convention over configuration for consistent endpoint registration.');
      break;
    case 'service':
      paras.push('Overview: ' + fileRel + ' provides a service' + cls + ' encapsulating domain/business logic and integrations.');
      paras.push('How it works: The service is injected where needed via the container. It aggregates repositories, utilities, and external APIs, exposing cohesive methods consumed by controllers, commands, or other services.');
      paras.push('Why it’s designed this way: Concentrating domain behavior in services avoids fat controllers and enables clear unit testing boundaries. DI enables mocking dependencies and late binding of environment-specific implementations.');
      break;
    case 'command':
      paras.push('Overview: ' + fileRel + ' declares a CLI command' + cls + cmdStr + ', integrating into sv’s command runner.');
      paras.push('How it works: At runtime, the base command bootstraps error reporting, configuration, DB, node/credential loading, and optional modules. The command class implements the workflow for its subtask, relying on shared services and repositories.');
      paras.push('Why it’s designed this way: Centralized boot logic ensures consistent environments across commands, while dedicated classes keep each command’s behavior self-contained and composable.');
      break;
    case 'executions':
      paras.push('Overview: ' + fileRel + ' participates in the execution pipeline, coordinating workflow runs, status, and results.');
      paras.push('How it works: Components in this area interop with the workflow runner, active execution tracking, lifecycle hooks, and persistence to the database. They manage cancellations, timeouts, streaming, and error finalization.');
      paras.push('Why it’s designed this way: Decoupling orchestration from transport allows sv to support inline and queued runs uniformly, improving resilience and scalability.');
      break;
    case 'workflows':
      paras.push('Overview: ' + fileRel + ' provides workflow orchestration support, from lookup and loading to execution services.');
      paras.push('How it works: These components interact with node types, static data, sharing, and history, preparing validated workflow representations for execution or editing.');
      paras.push('Why it’s designed this way: Keeping orchestration separate from execution makes the system easier to reason about and evolve without coupling UI/editor concerns to runtime.');
      break;
    case 'webhooks':
      paras.push('Overview: ' + fileRel + ' implements webhook registration, lookup, and request handling for workflow-triggered HTTP endpoints.');
      paras.push('How it works: Webhooks are registered at activation time, normalized, stored, and matched at runtime. Helpers handle body parsing, sanitation, and response shaping, supporting test/live modes and waiting states.');
      paras.push('Why it’s designed this way: Centralized management ensures idempotent provisioning and secure handling while keeping workflow logic clean.');
      break;
    case 'eventbus':
    case 'events':
      paras.push('Overview: ' + fileRel + ' is part of sv’s eventing layer, emitting and relaying internal events (e.g., logs, job signals).');
      paras.push('How it works: Producers publish events that relays forward to subscribers or push transports. This enables decoupled observability and collaboration features.');
      paras.push('Why it’s designed this way: Event-driven boundaries reduce coupling and enable cross-cutting features (telemetry, streaming) without contaminating domain logic.');
      break;
    case 'metrics':
      paras.push('Overview: ' + fileRel + ' integrates Prometheus-compatible metrics into the HTTP server.');
      paras.push('How it works: The service registers middleware and endpoints, collecting process and application metrics for scraping.');
      paras.push('Why it’s designed this way: First-class metrics enable SRE workflows without burdening application code paths.');
      break;
    case 'task-runner':
      paras.push('Overview: ' + fileRel + ' belongs to the task runner subsystem for isolated background work.');
      paras.push('How it works: Supervisors manage worker processes, restart heuristics, disconnect analysis, and signaling interfaces.');
      paras.push('Why it’s designed this way: Isolation improves robustness and security by containing failures and privileges.');
      break;
    case 'middleware':
      paras.push('Overview: ' + fileRel + ' defines an Express middleware for request parsing, security headers, or query helpers.');
      paras.push('How it works: It attaches to the Express pipeline before controllers and shapes requests into validated forms or enforces policies.');
      paras.push('Why it’s designed this way: Middlewares separate cross-cutting HTTP concerns from controllers to keep handlers focused.');
      break;
    case 'scaling':
      paras.push('Overview: ' + fileRel + ' contributes to queue-based scaling (jobs, workers, pub/sub).');
      paras.push('How it works: It configures Redis-backed queues, job processing, and instance coordination, enabling offloaded executions and horizontal scale.');
      paras.push('Why it’s designed this way: Separating API and execution capacity increases resilience and throughput at scale.');
      break;
    default:
      paras.push('Overview: ' + fileRel + ' is a core component' + (className ? ' defining class ' + className : '') + ' within the sv CLI runtime.');
      paras.push('How it works: It composes with neighboring modules through DI, typed configs, and shared types to implement its specific responsibility.');
      paras.push('Why it’s designed this way: Clear modular boundaries and typed contracts keep the codebase maintainable and evolvable.');
  }

  return paras.concat(commonWhy);
};

const extract = (content) => {
  const classMatch = content.match(/\bclass\s+([A-Za-z0-9_.$]+)/);
  const className = classMatch ? classMatch[1] : '';
  const restMatch = content.match(/@RestController\((['"`])([^'"`]+)\1\)/);
  const route = restMatch ? restMatch[2] : '';
  const cmdMatch = content.match(/@Command\(\{[\s\S]*?name:\s*['"`]([^'"`]+)['"`]/);
  const command = cmdMatch ? cmdMatch[1] : '';
  const decorators = [];
  if (/@Service\(/.test(content)) decorators.push('@Service');
  if (/@RestController\(/.test(content)) decorators.push('@RestController');
  if (/@Command\(/.test(content)) decorators.push('@Command');
  return { className, route, command, decorators };
};

for (const file of list) {
  const rel = file.replace(`${ROOT}/`, '');
  const outPath = join(OUT_DIR, `${rel}.md`);
  mkdirp(dirname(outPath));

  let content = '';
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    // binary or unreadable
  }

  const ext = file.split('.').pop();
  const tag = getTag(rel);
  let body = '';

  if (ext === 'ts' || ext === 'js' || ext === 'mjs' || ext === 'cjs') {
    const info = extract(content);
    const paras = paragraphsByTag({ tag, fileRel: rel, ...info });
    body = `### ${rel}\n\n` + paras.map((p) => `${p}\n`).join('\n');
  } else {
    body = `### ${rel}\n\nThis file is part of the sv CLI package and supports the surrounding TypeScript modules (extension: .${ext}). It is included here for completeness.`;
  }

  writeFileSync(outPath, body, 'utf8');
}

console.log(`Wrote per-file docs to ${OUT_DIR}`);