# Testing sv Next backend

## 1) Install dependencies (root repo)

pnpm install

## 2) Build shared packages (if needed)

pnpm -w build

## 3) Run the Next backend

cd packages/cli/src3
pnpm dev

## 4) Initialize runtime

curl -X POST http://localhost:3000/api/initialize -H 'content-type: application/json' -d '{rest:rest}'

## 5) Health check

curl http://localhost:3000/api/health

## 6) Call REST endpoints (examples)

# Users list (adjust to your config/auth requirements)
curl http://localhost:3000/api/rest/users

# Workflows endpoints
curl http://localhost:3000/api/rest/workflows

# Executions
curl http://localhost:3000/api/rest/executions

## 7) Test webhooks

# Assuming a webhook is registered by an active workflow, call it via webhooks route
curl -X POST http://localhost:3000/api/webhooks/<your/path>

Notes:
- Some endpoints require auth headers/cookies as in sv (formerly n8n). Provide the same tokens you would for CLI.
- For queue mode, ensure Redis and envs are configured as usual.
- To change REST base path, set it in step 4 (defaults to rest).
