import { RefreshCw, Bot } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { useStore } from '../store/useStore';

export function AutoSyncStatus() {
  const lastSync = useStore((s) => s.lastAutoSyncAt);
  const feedCount = useStore((s) => s.lastAutoSyncFeedCount);
  const enabled = useStore((s) => s.autoSyncEnabled);

  if (!enabled) {
    return (
      <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-slate-500">
        <Bot className="h-4 w-4" />
        Monitoraggio automatico disattivato
      </div>
    );
  }

  return (
    <div className="glass rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-cyan-500/10">
          <Bot className="h-4 w-4 text-cyan-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-300">Monitoraggio automatico attivo</p>
          <p className="text-xs text-slate-500">
            {lastSync
              ? `Ultimo controllo ${formatDistanceToNow(new Date(lastSync), { addSuffix: true, locale: it })}`
              : 'In attesa del primo sync...'}
            {feedCount > 0 && ` · ${feedCount} articoli analizzati`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <RefreshCw className="h-3 w-3" />
        Aggiornamento ogni 6h via GitHub Actions
      </div>
    </div>
  );
}