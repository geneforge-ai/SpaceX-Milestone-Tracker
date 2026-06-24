import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { AUTO_SYNC_INTERVAL_MS, fetchAutoStatus } from '../utils/autoSync';

export function useAutoSync() {
  const syncFromRemote = useStore((s) => s.syncFromRemote);
  const autoSyncEnabled = useStore((s) => s.autoSyncEnabled);
  const running = useRef(false);

  useEffect(() => {
    if (!autoSyncEnabled) return;

    const run = async () => {
      if (running.current) return;
      running.current = true;
      try {
        const data = await fetchAutoStatus();
        if (data) syncFromRemote(data);
      } finally {
        running.current = false;
      }
    };

    run();
    const interval = setInterval(run, AUTO_SYNC_INTERVAL_MS);

    const onFocus = () => run();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [autoSyncEnabled, syncFromRemote]);
}