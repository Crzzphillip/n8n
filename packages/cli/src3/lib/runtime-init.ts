import { Container } from '@n8n/di';
import { Logger } from '@n8n/backend-common';
import config from '../../src2/config';
import { ActiveWorkflowManager } from '../../src2/active-workflow-manager';
import { WaitTracker } from '../../src2/wait-tracker';
import { ScalingService } from '../../src2/scaling/scaling.service';
import { Push } from '../../src2/push';

let initialized = false;

export async function ensureRuntimeInitialized() {
  if (initialized) return;
  const logger = Container.get(Logger).scoped('runtime');

  // Setup scaling queue if needed
  if (config.getEnv('executions.mode') === 'queue') {
    const scaling = Container.get(ScalingService);
    await scaling.setupQueue();
  }

  // Initialize push transport (SSE/ws) routing if needed
  Container.get(Push);

  // Initialize active workflows and wait tracker
  const awm = Container.get(ActiveWorkflowManager);
  await awm.init();
  Container.get(WaitTracker).init();

  initialized = true;
  logger.info('sv Next backend runtime initialized');
}