import { Filter } from 'lucide-react';
import type { MilestoneStatus, SectionId } from '../types';
import { STATUS_LABELS, SECTIONS } from '../types';
import { useStore } from '../store/useStore';

export function MilestoneFilters() {
  const filters = useStore((s) => s.filters);
  const setFilters = useStore((s) => s.setFilters);

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-4 w-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-300">Filtri</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={filters.section}
          onChange={(e) =>
            setFilters({ section: e.target.value as SectionId | 'all' })
          }
          className="flex-1 bg-space-800 border border-space-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          aria-label="Filtra per sezione"
        >
          <option value="all">Tutte le sezioni</option>
          {SECTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({ status: e.target.value as MilestoneStatus | 'all' })
          }
          className="flex-1 bg-space-800 border border-space-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          aria-label="Filtra per stato"
        >
          <option value="all">Tutti gli stati</option>
          {(Object.keys(STATUS_LABELS) as MilestoneStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}