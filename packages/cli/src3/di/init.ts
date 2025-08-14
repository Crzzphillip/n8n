import 'reflect-metadata';
import { Container } from '@n8n/di';
import { GlobalConfig } from '@n8n/config';
import { ModulesConfig, ModuleRegistry, Logger } from '@n8n/backend-common';

// Minimal DI setup to satisfy src2 dependencies when running inside Next.js
export function initDI() {
  // Bind configs if not already bound (Next boot may run multiple times)
  try { Container.get(GlobalConfig); } catch { Container.set(GlobalConfig, new GlobalConfig()); }
  try { Container.get(ModulesConfig); } catch { Container.set(ModulesConfig, new ModulesConfig()); }
  try { Container.get(ModuleRegistry); } catch { Container.set(ModuleRegistry, new ModuleRegistry()); }
  try { Container.get(Logger); } catch { Container.set(Logger, new Logger()); }
}