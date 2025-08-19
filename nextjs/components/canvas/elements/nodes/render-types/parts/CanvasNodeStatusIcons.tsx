'use client';

import React, { useMemo } from 'react';
import styles from './CanvasNodeStatusIcons.module.css';

export const CanvasNodeDirtiness = {
  PARAMETERS_UPDATED: 'parameters-updated',
  INCOMING_CONNECTIONS_UPDATED: 'incoming-connections-updated',
  PINNED_DATA_UPDATED: 'pinned-data-updated',
  UPSTREAM_DIRTY: 'upstream-dirty',
} as const;

export type DirtinessType = (typeof CanvasNodeDirtiness)[keyof typeof CanvasNodeDirtiness];

type Props = {
  size?: 'small' | 'medium' | 'large';
  spinnerScrim?: boolean;
  spinnerLayout?: 'absolute' | 'static';
  // Derived node state inputs (to be provided by parent)
  hasPinnedData?: boolean;
  issues?: string[];
  hasIssues?: boolean;
  executionStatus?: 'unknown' | 'waiting' | 'success' | 'running' | 'error' | string;
  executionWaiting?: string | false;
  executionWaitingForNext?: boolean;
  executionRunning?: boolean;
  hasRunData?: boolean;
  runDataIterations?: number;
  isDisabled?: boolean;
  renderType?: 'default' | string;
  dirtiness?: DirtinessType | undefined;
  isExecuting?: boolean;
};

export default function CanvasNodeStatusIcons({
  size = 'large',
  spinnerScrim = false,
  spinnerLayout = 'absolute',
  hasPinnedData,
  issues = [],
  hasIssues,
  executionStatus,
  executionWaiting,
  executionWaitingForNext,
  executionRunning,
  hasRunData,
  runDataIterations = 0,
  isDisabled,
  dirtiness,
  isExecuting,
}: Props) {
  const isNodeExecuting = useMemo(() => {
    if (!isExecuting) return false;
    return Boolean(executionRunning || executionWaitingForNext || executionStatus === 'running');
  }, [isExecuting, executionRunning, executionWaitingForNext, executionStatus]);

  const commonClass = [
    styles.status,
    spinnerScrim ? styles.spinnerScrim : '',
    spinnerLayout === 'absolute' ? styles.absoluteSpinner : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Icons: replace N8nIcon with simple emoji placeholders; consumer can inject real icons later
  const Icon = ({ name }: { name: string }) => {
    const map: Record<string, string> = {
      clock: '🕒',
      refresh: '⟳',
      power: '⏻',
      error: '⚠️',
      pin: '📌',
      dirty: '✱',
      success: '✔️',
    };
    return <span className={name === 'refresh' ? styles.spin : undefined}>{map[name] ?? '•'}</span>;
  };

  if (executionWaiting || executionStatus === 'waiting') {
    return (
      <div>
        <div className={[commonClass, styles.waiting].join(' ')} title={String(executionWaiting)}>
          <Icon name="clock" />
        </div>
        {spinnerLayout === 'absolute' && (
          <div className={[commonClass, styles.nodeWaitingSpinner].join(' ')}>
            <Icon name="refresh" />
          </div>
        )}
      </div>
    );
  }

  if (isNodeExecuting) {
    return (
      <div data-test-id="canvas-node-status-running" className={[commonClass, styles.running].join(' ')}>
        <Icon name="refresh" />
      </div>
    );
  }

  if (isDisabled) {
    return (
      <div className={[commonClass, styles.disabled].join(' ')}>
        <Icon name="power" />
      </div>
    );
  }

  if (hasIssues) {
    return (
      <div className={[commonClass, styles.issues].join(' ')} data-test-id="node-issues" title={issues.join('\n')}>
        <Icon name="error" />
      </div>
    );
  }

  if (executionStatus === 'unknown') {
    return null; // never executed
  }

  if (hasPinnedData) {
    return (
      <div className={[commonClass, styles.pinnedData].join(' ')} data-test-id="canvas-node-status-pinned">
        <Icon name="pin" />
      </div>
    );
  }

  if (dirtiness !== undefined) {
    const title =
      dirtiness === CanvasNodeDirtiness.PARAMETERS_UPDATED ? 'Node is dirty' : 'Node may be affected by upstream changes';
    return (
      <div className={[commonClass, styles.warning].join(' ')} data-test-id="canvas-node-status-warning" title={title}>
        <Icon name="dirty" />
        {runDataIterations > 1 && <span className={styles.count}>{runDataIterations}</span>}
      </div>
    );
  }

  if (hasRunData) {
    return (
      <div className={[commonClass, styles.runData].join(' ')} data-test-id="canvas-node-status-success">
        <Icon name="success" />
        {runDataIterations > 1 && <span className={styles.count}>{runDataIterations}</span>}
      </div>
    );
  }

  return null;
}

