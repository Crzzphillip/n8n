#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = '/workspace/packages/cli';
const SRC = join(ROOT, 'src2');
const OUT_DIR = join(ROOT, 'docs', 'sv-deep');

const list = execSync(`find ${SRC} -type f | sort`, { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const mkdirp = (p) => mkdirSync(p, { recursive: true });

const tagFor = (rel) => {
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

const extractInfo = (content) => {
  const imports = content.split('\n').filter((l) => /^\s*import\s/.test(l));
  const classNames = Array.from(content.matchAll(/\bclass\s+([A-Za-z0-9_.$]+)/g)).map((m) => m[1]);
  const funcNames = Array.from(content.matchAll(/\bfunction\s+([A-Za-z0-9_.$]+)/g)).map((m) => m[1]);
  const exports = Array.from(content.matchAll(/\bexport\s+(?:default\s+)?(?:class|function|const|let|var|interface|type|enum)\s+([A-Za-z0-9_.$]+)/g)).map((m) => m[1]);
  const rest = content.match(/@RestController\((['"`])([^'"`]+)\1\)/);
  const route = rest ? rest[2] : '';
  const cmd = content.match(/@Command\(\{[\s\S]*?name:\s*['"`]([^'"`]+)['"`]/);
  const commandName = cmd ? cmd[1] : '';
  return { imports, classNames, funcNames, exports, route, commandName };
};

const overviewFor = (rel, tag, info) => {
  const cls = info.classNames[0] ? ' (' + info.classNames[0] + ')' : '';
  const routeStr = info.route ? ' Base route: `' + info.route + '`.' : '';
  const cmdStr = info.commandName ? ' Command: `' + info.commandName + '`.' : '';
  switch (tag) {
    case 'controller':
      return [
        'Overview: ' + rel + ' defines an HTTP controller' + cls + ' that exposes Express routes for a focused domain.' + routeStr,
        'How it works: Registered via the ControllerRegistry during server bootstrap. Each handler delegates to services and applies DTO validation, returning sanitized responses.',
        'Why: Separation of transport and domain logic improves testability and consistency of route registration.'
      ];
    case 'service':
      return [
        'Overview: ' + rel + ' provides a service' + cls + ' encapsulating domain logic and integrations.',
        'How it works: Injected via DI, composes repositories, utilities, and external APIs into cohesive operations.',
        'Why: Keeps controllers/commands thin and enables unit testing with dependency mocks.'
      ];
    case 'command':
      return [
        'Overview: ' + rel + ' declares a CLI command' + cls + '.' + cmdStr,
        'How it works: Bootstraps configuration, DB, and modules via the base command, then performs its task using shared services.',
        'Why: Centralized boot logic with per-command behavior simplifies maintenance.'
      ];
    default:
      return [
        'Overview: ' + rel + ' is a core component' + cls + ' within the sv CLI runtime.',
        'How it works: Integrates with neighbors via DI, typed configs, and shared types to fulfill its responsibility.',
        'Why: Clear modular boundaries and typed contracts keep the code maintainable.'
      ];
  }
};

const langFor = (ext) => {
  switch (ext) {
    case 'ts': return 'ts';
    case 'js': return 'js';
    case 'mjs': return 'js';
    case 'cjs': return 'js';
    case 'json': return 'json';
    case 'css': return 'css';
    case 'md': return 'markdown';
    case 'yaml':
    case 'yml': return 'yaml';
    case 'hbs':
    case 'handlebars': return 'handlebars';
    default: return '';
  }
};

for (const file of list) {
  const rel = file.replace(`${ROOT}/`, '');
  const outPath = join(OUT_DIR, `${rel}.md`);
  mkdirp(dirname(outPath));

  let content = '';
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    // skip binary
  }

  const ext = file.split('.').pop();
  const tag = tagFor(rel);
  const info = extractInfo(content || '');
  const overview = overviewFor(rel, tag, info);

  const header = '## ' + rel + '\n\n';
  const importsSec = info.imports.length ? ('### Imports\n\n' + info.imports.map((l) => '- ' + l).join('\n') + '\n\n') : '';
  const decls = [];
  if (info.classNames.length) decls.push('Classes: ' + info.classNames.join(', '));
  if (info.funcNames.length) decls.push('Functions: ' + info.funcNames.join(', '));
  if (info.exports.length) decls.push('Exports: ' + info.exports.join(', '));
  const declsSec = decls.length ? ('### Declarations\n\n' + decls.map((d) => '- ' + d).join('\n') + '\n\n') : '';

  const recreate = '### Recreate\n\nPlace this file at `' + rel + '` and use the following source:\n\n';
  const lang = langFor(ext);
  const code = content ? ('```' + lang + '\n' + content + '\n```\n') : '_Binary or empty file._\n';

  const body = header + overview.map((p) => p + '\n\n').join('') + importsSec + declsSec + recreate + code;
  writeFileSync(outPath, body, 'utf8');
}

console.log(`Wrote deep per-file docs to ${OUT_DIR}`);