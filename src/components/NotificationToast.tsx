import { useEffect, useState } from 'react';
import { X, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import { StatusBadge } from './StatusBadge';

export function NotificationToast() {
  const notifications = useStore((s) => s.notifications);
  const markRead = useStore((s) => s.markNotificationRead);
  const inAppEnabled = useStore((s) => s.notificationSettings.inAppEnabled);
  const [visible, setVisible] = useState<string | null>(null);

  useEffect(() => {
    if (!inAppEnabled) return;
    const unread = notifications.find((n) => !n.read);
    if (unread && unread.id !== visible) {
      setVisible(unread.id);
      const timer = setTimeout(() => {
        markRead(unread.id);
        setVisible(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notifications, inAppEnabled, visible, markRead]);

  if (!inAppEnabled || !visible) return null;

  const notification = notifications.find((n) => n.id === visible);
  if (!notification) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-4">
      <div className="glass rounded-xl p-4 shadow-2xl shadow-black/40 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Bell className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200">Aggiornamento Milestone</p>
            <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
            <div className="mt-2">
              <StatusBadge status={notification.status} />
            </div>
          </div>
          <button
            onClick={() => {
              markRead(notification.id);
              setVisible(null);
            }}
            className="p-1 rounded hover:bg-space-700 text-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}