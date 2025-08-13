import 'reflect-metadata';
import { Container } from '@n8n/di';
import { Logger } from '@n8n/backend-common';
import { DbConnection } from '@n8n/db';
import { PostHogClient } from '../../src2/posthog';
import { TelemetryEventRelay } from '../../src2/events/relays/telemetry.event-relay';
import { MessageEventBus } from '../../src2/eventbus/message-event-bus/message-event-bus';
import { LoadNodesAndCredentials } from '../../src2/load-nodes-and-credentials';
import { initDI } from '../di/init';

let bootstrapped = false;

export async function ensureBootstrapped() {
  if (bootstrapped) return;
  initDI();
  const logger = Container.get(Logger).scoped('bootstrap');
  logger.info('sv Next backend bootstrap starting');

  const loaders = Container.get(LoadNodesAndCredentials);
  await loaders.init();

  const db = Container.get(DbConnection);
  await db.init();
  await db.migrate();

  // Initialize event bus and telemetry
  Container.get(MessageEventBus); // side-effect initialize
  await Container.get(PostHogClient).init();
  await Container.get(TelemetryEventRelay).init();

  bootstrapped = true;
  logger.info('sv Next backend bootstrap completed');
}