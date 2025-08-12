import { Container } from '@n8n/di';
import { GlobalConfig } from '@n8n/config';

export function setRestBasePath(basePath: string) {
  const cfg = Container.get(GlobalConfig);
  // @ts-ignore
  cfg.endpoints = cfg.endpoints || {};
  // @ts-ignore
  cfg.endpoints.rest = basePath.replace(/^\/+/, '');
}