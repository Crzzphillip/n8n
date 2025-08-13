"use client";
import { useState } from 'react';
import { useExecutionsStore } from '../../src3/stores/executions';

export default function RunControls(props: { workflowId?: string }) {
  const { run, stop } = useExecutionsStore();
  const [currentExecutionId, setCurrentExecutionId] = useState<string | undefined>(undefined);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const onRun = async () => {
    if (!props.workflowId) return;
    setRunning(true);
    setError(undefined);
    try {
      const execId = await run(props.workflowId);
      setCurrentExecutionId(execId);
    } catch (e: any) {
      setError(e?.message || 'Failed to run');
    } finally {
      setRunning(false);
    }
  };

  const onStop = async () => {
    if (!currentExecutionId) return;
    try {
      await stop(currentExecutionId);
    } catch (e: any) {
      setError(e?.message || 'Failed to stop');
    }
  };

  return (
    <div>
      <button onClick={onRun} disabled={!props.workflowId || running}>Run</button>
      <button onClick={onStop} disabled={!currentExecutionId}>Stop</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}