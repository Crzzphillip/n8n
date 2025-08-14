"use client";
import { useState } from 'react';
import { useExecutionsStore } from '../../src3/stores/executions';
import { useI18n } from '../../src3/hooks/useI18n';
import styles from './styles/NodeView.module.css';
import { usePermissions } from '../../src3/hooks/usePermissions';

export default function RunControls(props: { workflowId?: string }) {
  const { run, stop } = useExecutionsStore();
  const [currentExecutionId, setCurrentExecutionId] = useState<string | undefined>(undefined);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const { t } = useI18n();
  const { isCanvasReadOnly } = usePermissions();

  const onRun = async () => {
    if (!props.workflowId || isCanvasReadOnly) return;
    setRunning(true);
    setError(undefined);
    try {
      const execId = await run(props.workflowId);
      setCurrentExecutionId(execId);
    } catch (e: any) {
      setError(e?.message || t('nodeView.error.loadWorkflow'));
    } finally {
      setRunning(false);
    }
  };

  const onStop = async () => {
    if (!currentExecutionId) return;
    try {
      await stop(currentExecutionId);
    } catch (e: any) {
      setError(e?.message || t('nodeView.error.loadWorkflow'));
    }
  };

  return (
    <div className={styles.executionButtons}>
      <button onClick={onRun} disabled={!props.workflowId || running || isCanvasReadOnly}>{t('nodeView.buttons.run')}</button>
      <button onClick={onStop} disabled={!currentExecutionId}>{t('nodeView.buttons.running')}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}