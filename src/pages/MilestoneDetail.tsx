import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SECTIONS, STATUS_LABELS } from '../types';
import type { MilestoneStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';

export function MilestoneDetail() {
  const { id } = useParams<{ id: string }>();
  const milestone = useStore((s) => s.getMilestoneById(id ?? ''));
  const updateStatus = useStore((s) => s.updateMilestoneStatus);
  const updateNotes = useStore((s) => s.updateMilestoneNotes);

  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (milestone) setNotes(milestone.personalNotes);
  }, [milestone]);

  if (!milestone) return <Navigate to="/" replace />;

  const section = SECTIONS.find((s) => s.id === milestone.sectionId);

  const handleSaveNotes = () => {
    updateNotes(milestone.id, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Torna alla dashboard
      </Link>

      <div className="glass rounded-xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {section && (
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${section.color}15`,
                color: section.color,
              }}
            >
              {section.name}
            </span>
          )}
          <StatusBadge status={milestone.status} size="md" />
        </div>

        <h1 className="text-2xl font-bold text-slate-100">{milestone.name}</h1>
        <p className="mt-3 text-slate-400 leading-relaxed">{milestone.description}</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-space-800/50 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium">Periodo atteso</p>
            <p className="mt-1 text-sm text-slate-200 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              {milestone.expectedPeriod}
            </p>
          </div>
          <div className="bg-space-800/50 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium">Ultimo aggiornamento</p>
            <p className="mt-1 text-sm text-slate-200">{milestone.lastUpdated}</p>
          </div>
          <div className="bg-space-800/50 rounded-lg p-4 sm:col-span-2">
            <p className="text-xs text-slate-500 font-medium">Fonte</p>
            <p className="mt-1 text-sm text-slate-200 flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              {milestone.source}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Dettagli</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{milestone.details}</p>
        </div>

        <div className="mt-6 pt-6 border-t border-space-700">
          <label className="text-sm font-semibold text-slate-300 block mb-2">
            Cambia stato
          </label>
          <select
            value={milestone.status}
            onChange={(e) =>
              updateStatus(milestone.id, e.target.value as MilestoneStatus)
            }
            className="w-full sm:w-auto bg-space-800 border border-space-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          >
            {(Object.keys(STATUS_LABELS) as MilestoneStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Note personali</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Aggiungi le tue note, osservazioni o link utili..."
          rows={4}
          className="w-full bg-space-800 border border-space-600 rounded-lg px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-y"
        />
        <button
          onClick={handleSaveNotes}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
        >
          <Save className="h-4 w-4" />
          {saved ? 'Salvato!' : 'Salva note'}
        </button>
      </div>
    </div>
  );
}