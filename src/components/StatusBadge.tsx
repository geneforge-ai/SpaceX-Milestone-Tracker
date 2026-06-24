import type { MilestoneStatus } from '../types';
import { STATUS_LABELS } from '../types';

const statusStyles: Record<MilestoneStatus, string> = {
  'non-iniziato': 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  'in-corso': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'raggiunto': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'ritardato': 'bg-red-500/15 text-red-400 border-red-500/30',
};

const statusDots: Record<MilestoneStatus, string> = {
  'non-iniziato': 'bg-slate-400',
  'in-corso': 'bg-blue-400',
  'raggiunto': 'bg-emerald-400',
  'ritardato': 'bg-red-400',
};

interface StatusBadgeProps {
  status: MilestoneStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${statusStyles[status]} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusDots[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}