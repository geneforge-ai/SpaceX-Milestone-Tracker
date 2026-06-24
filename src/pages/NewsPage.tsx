import { useState } from 'react';
import { Plus, Trash2, ExternalLink, Rss } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SECTIONS } from '../types';
import type { SectionId } from '../types';

export function NewsPage() {
  const news = useStore((s) => s.news);
  const addNews = useStore((s) => s.addNewsItem);
  const deleteNews = useStore((s) => s.deleteNewsItem);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    summary: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    sectionId: '' as SectionId | '',
    url: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.summary) return;
    addNews({
      title: form.title,
      summary: form.summary,
      source: form.source || 'Manuale',
      date: form.date,
      sectionId: form.sectionId || undefined,
      url: form.url || undefined,
    });
    setForm({
      title: '',
      summary: '',
      source: '',
      date: new Date().toISOString().split('T')[0],
      sectionId: '',
      url: '',
    });
    setShowForm(false);
  };

  const getSectionLabel = (id?: SectionId) => {
    if (!id) return null;
    return SECTIONS.find((s) => s.id === id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">News & Updates</h2>
          <p className="text-sm text-slate-500 mt-1">
            Ultime notizie rilevanti per il monitoraggio SPCX
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Aggiungi notizia
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">Nuova notizia manuale</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Titolo *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="bg-space-800 border border-space-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
            <input
              type="text"
              placeholder="Fonte"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="bg-space-800 border border-space-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="bg-space-800 border border-space-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
            <select
              value={form.sectionId}
              onChange={(e) =>
                setForm({ ...form, sectionId: e.target.value as SectionId | '' })
              }
              className="bg-space-800 border border-space-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            >
              <option value="">Sezione (opzionale)</option>
              {SECTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Riassunto *"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            required
            rows={3}
            className="w-full bg-space-800 border border-space-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-y"
          />
          <input
            type="url"
            placeholder="URL (opzionale)"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="w-full bg-space-800 border border-space-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
            >
              Salva
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Annulla
            </button>
          </div>
        </form>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Rss className="h-3.5 w-3.5" />
        Feed simulato + notizie manuali · {news.length} articoli
      </div>

      <div className="space-y-3">
        {news.map((item) => {
          const section = getSectionLabel(item.sectionId);
          return (
            <article key={item.id} className="glass rounded-xl p-5 card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {section && (
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${section.color}15`,
                          color: section.color,
                        }}
                      >
                        {section.name}
                      </span>
                    )}
                    {item.isManual && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                        Manuale
                      </span>
                    )}
                    <span className="text-xs text-slate-500">{item.date}</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-100">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                      >
                        {item.title}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      item.title
                    )}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">
                    {item.summary}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">Fonte: {item.source}</p>
                </div>
                {item.isManual && (
                  <button
                    onClick={() => deleteNews(item.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors shrink-0"
                    title="Elimina"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}