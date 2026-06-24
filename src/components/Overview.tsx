import { CheckCircle2, Clock, Circle, AlertTriangle } from 'lucide-react';
import type { Milestone } from '../types';

interface OverviewProps {
  milestones: Milestone[];
}

export function Overview({ milestones }: OverviewProps) {
  const counts = {
    raggiunto: milestones.filter((m) => m.status === 'raggiunto').length,
    'in-corso': milestones.filter((m) => m.status === 'in-corso').length,
    'non-iniziato': milestones.filter((m) => m.status === 'non-iniziato').length,
    ritardato: milestones.filter((m) => m.status === 'ritardato').length,
  };

  const cards = [
    {
      label: 'Raggiunti',
      value: counts.raggiunto,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      label: 'In corso',
      value: counts['in-corso'],
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      label: 'Non iniziati',
      value: counts['non-iniziato'],
      icon: Circle,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20',
    },
    {
      label: 'Ritardati',
      value: counts.ritardato,
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
    },
  ];

  const progress =
    milestones.length > 0
      ? Math.round((counts.raggiunto / milestones.length) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`glass rounded-xl p-4 border ${card.border}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">{card.label}</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">{card.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Progresso complessivo</span>
          <span className="text-sm font-semibold text-slate-200">{progress}%</span>
        </div>
        <div className="h-2 bg-space-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {counts.raggiunto} di {milestones.length} milestone raggiunti
        </p>
      </div>
    </div>
  );
}