## Task Runners

Directory: `src/task-runners`

### Components
- `task-runner-module.ts`: orchestrates lifecycle of task runner processes when enabled by config.
- `task-managers/` and `task-broker/`: coordination, restart detection, sliding-window signals, and error analysis.

### Why this design works
- Enables isolating long-running or privileged tasks from the main server process for robustness and security, configurable per environment.