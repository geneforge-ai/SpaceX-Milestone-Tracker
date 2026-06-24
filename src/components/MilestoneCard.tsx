import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, ExternalLink } from 'lucide-react';
import type { Milestone, MilestoneStatus } from '../types';
import { STATUS_LABELS } from '../types';
import { StatusBadge } from './StatusBadge';
import { useStore } from '../store/useStore';

interface MilestoneCardProps {
  milestone: Milestone;
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const updateStatus = useStore((s) => s.updateMilestoneStatus);

  return (
    <div className="glass rounded-xl p-5 card-hover">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <Link
            to={`/milestone/${milestone.id}`}
            className="group flex items-start gap-2"
          >
            <h3 className="text-base font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
              {milestone.name}
            </h3>
            <ChevronRight className="h-4 w-4 mt-0.5 text-slate-500 group-hover:text-blue-400 shrink-0 transition-colors" />
          </Link>
          <p className="mt-1.5 text-sm text-slate-400 leading-relaxed line-clamp-2">
            {milestone.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {milestone.expectedPeriod}
            </span>
            <span>Aggiornato: {milestone.lastUpdated}</span>
            <span className="inline-flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              {milestone.source}
            </span>
          </div>
          {milestone.personalNotes && (
            <p className="mt-2 text-xs text-slate-500 italic border-l-2 border-blue-500/30 pl-2">
              {milestone.personalNotes}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:items-end shrink-0">
          <StatusBadge status={milestone.status} />
          <select
            value={milestone.status}
            onChange={(e) =>
              updateStatus(milestone.id, e.target.value as MilestoneStatus)
            }
            className="text-xs bg-space-800 border border-space-600 rounded-lg px-2 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 cursor-pointer"
            aria-label={`Cambia stato per ${milestone.name}`}
          >
            {(Object.keys(STATUS_LABELS) as MilestoneStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}