import { Bell, BellOff, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SECTIONS } from '../types';
import { requestNotificationPermission } from '../utils/notifications';

export function SettingsPage() {
  const settings = useStore((s) => s.notificationSettings);
  const updateSettings = useStore((s) => s.updateNotificationSettings);
  const toggleSection = useStore((s) => s.toggleSectionNotification);

  const handleEnablePush = async () => {
    const permission = await requestNotificationPermission();
    updateSettings({ pushEnabled: permission === 'granted' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Impostazioni</h2>
        <p className="text-sm text-slate-500 mt-1">
          Configura notifiche e preferenze di monitoraggio
        </p>
      </div>

      <div className="glass rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Bell className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Notifiche</h3>
            <p className="text-xs text-slate-500">
              Ricevi avvisi quando un milestone diventa Raggiunto o Ritardato
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-space-800/50 rounded-lg cursor-pointer">
            <div>
              <p className="text-sm font-medium text-slate-300">Notifiche in-app</p>
              <p className="text-xs text-slate-500">Toast e centro notifiche</p>
            </div>
            <input
              type="checkbox"
              checked={settings.inAppEnabled}
              onChange={(e) => updateSettings({ inAppEnabled: e.target.checked })}
              className="h-4 w-4 rounded border-space-600 bg-space-800 text-blue-500 focus:ring-blue-500/50"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-space-800/50 rounded-lg cursor-pointer">
            <div>
              <p className="text-sm font-medium text-slate-300">Notifiche push del browser</p>
              <p className="text-xs text-slate-500">
                {typeof Notification !== 'undefined' && Notification.permission === 'granted'
                  ? 'Permesso concesso'
                  : 'Richiede autorizzazione del browser'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushEnabled}
              onChange={(e) => {
                if (e.target.checked) {
                  handleEnablePush();
                } else {
                  updateSettings({ pushEnabled: false });
                }
              }}
              className="h-4 w-4 rounded border-space-600 bg-space-800 text-blue-500 focus:ring-blue-500/50"
            />
          </label>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-300 mb-3">
            Notifiche per sezione
          </h4>
          <div className="space-y-2">
            {SECTIONS.map((section) => (
              <label
                key={section.id}
                className="flex items-center justify-between p-3 bg-space-800/30 rounded-lg cursor-pointer hover:bg-space-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: section.color }}
                  />
                  <span className="text-sm text-slate-300">{section.name}</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.sections[section.id]}
                  onChange={() => toggleSection(section.id)}
                  className="h-4 w-4 rounded border-space-600 bg-space-800 text-blue-500 focus:ring-blue-500/50"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Shield className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Dati locali</h3>
            <p className="text-xs text-slate-500">
              Tutti i dati sono salvati localmente nel browser
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          Le modifiche agli stati, le note personali e le impostazioni di notifica vengono
          persistite in localStorage. Nessun dato viene inviato a server esterni.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem('spcx-milestone-tracker');
            window.location.reload();
          }}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
        >
          <BellOff className="h-4 w-4" />
          Ripristina dati iniziali
        </button>
      </div>
    </div>
  );
}