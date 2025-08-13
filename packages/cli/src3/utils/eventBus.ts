export type EventHandler<T = any> = (data: T) => void;

export type EventMap = Record<string, any>;

export class EventBus<T extends EventMap = EventMap> {
  private handlers: Map<keyof T, Set<EventHandler<any>>> = new Map();

  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    
    const handlers = this.handlers.get(event)!;
    handlers.add(handler);

    // Return unsubscribe function
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(event);
      }
    };
  }

  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(event);
      }
    }
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${String(event)}:`, error);
        }
      });
    }
  }

  clear(): void {
    this.handlers.clear();
  }

  getHandlerCount<K extends keyof T>(event: K): number {
    return this.handlers.get(event)?.size || 0;
  }

  hasHandlers<K extends keyof T>(event: K): boolean {
    return this.getHandlerCount(event) > 0;
  }
}

// Create singleton event buses for different domains
export const nodeViewEventBus = new EventBus<{
  newWorkflow: never;
  openChat: never;
  importWorkflowData: any;
  importWorkflowUrl: any;
  'runWorkflowButton:mouseenter': never;
  'runWorkflowButton:mouseleave': never;
  tidyUp: never;
}>();

export const canvasEventBus = new EventBus<{
  'fitView': never;
  'nodes:select': { ids: string[] };
  'saved:workflow': never;
  'open:execution': any;
  'tidyUp': { source: string; nodeIdsFilter?: string[] };
}>();

export const sourceControlEventBus = new EventBus<{
  pull: never;
  push: never;
  commit: never;
  branch: { name: string };
}>();

export const historyBus = new EventBus<{
  nodeMove: { nodeName: string; position: [number, number] };
  revertAddNode: { node: any };
  revertRemoveNode: { node: any };
  revertAddConnection: { connection: [any, any] };
  revertRemoveConnection: { connection: [any, any] };
  revertRenameNode: { currentName: string; newName: string };
  revertReplaceNodeParameters: { nodeId: string; currentProperties: any; newProperties: any };
  enableNodeToggle: { nodeName: string };
}>();

// Utility function to create a typed event bus
export function createEventBus<T extends EventMap>(): EventBus<T> {
  return new EventBus<T>();
}