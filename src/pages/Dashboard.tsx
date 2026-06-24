import { Download, FileText } from 'lucide-react';
import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { SECTIONS } from '../types';
import { Overview } from '../components/Overview';
import { MilestoneFilters } from '../components/MilestoneFilters';
import { MilestoneCard } from '../components/MilestoneCard';
import { SectionHeader } from '../components/SectionHeader';
import { exportToCSV, exportToPDF } from '../utils/export';

export function Dashboard() {
  const milestones = useStore((s) => s.milestones);
  const filters = useStore((s) => s.filters);

  const filtered = useMemo(() => {
    return milestones.filter((m) => {
      if (filters.section !== 'all' && m.sectionId !== filters.section) return false;
      if (filters.status !== 'all' && m.status !== filters.status) return false;
      return true;
    });
  }, [milestones, filters]);

  const grouped = useMemo(() => {
    const sections = filters.section !== 'all'
      ? SECTIONS.filter((s) => s.id === filters.section)
      : SECTIONS;

    return sections
      .map((section) => ({
        section,
        milestones: filtered.filter((m) => m.sectionId === section.id),
      }))
      .filter((g) => g.milestones.length > 0);
  }, [filtered, filters.section]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">
            Monitoraggio milestone SpaceX per investitori SPCX
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(milestones)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-space-800 border border-space-600 rounded-lg hover:bg-space-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            onClick={() => exportToPDF(milestones)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-space-800 border border-space-600 rounded-lg hover:bg-space-700 transition-colors"
          >
            <FileText className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      <Overview milestones={milestones} />
      <MilestoneFilters />

      {grouped.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-slate-500">Nessun milestone corrisponde ai filtri selezionati.</p>
        </div>
      ) : (
        grouped.map(({ section, milestones: sectionMilestones }) => (
          <section key={section.id}>
            <SectionHeader section={section} count={sectionMilestones.length} />
            <div className="space-y-3">
              {sectionMilestones.map((m) => (
                <MilestoneCard key={m.id} milestone={m} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}