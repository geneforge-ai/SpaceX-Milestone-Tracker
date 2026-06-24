import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { StatusBadge } from './StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const notifications = useStore((s) => s.notifications);
  const unreadCount = useStore((s) => s.getUnreadCount());
  const markRead = useStore((s) => s.markNotificationRead);
  const markAllRead = useStore((s) => s.markAllNotificationsRead);
  const clearAll = useStore((s) => s.clearNotifications);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-space-700 transition-colors"
        aria-label="Notifiche"
      >
        <Bell className="h-5 w-5 text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 glass rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-space-700">
            <h3 className="text-sm font-semibold text-slate-200">Notifiche</h3>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllRead}
                    className="p-1.5 rounded hover:bg-space-700 text-slate-500 hover:text-slate-300"
                    title="Segna tutte come lette"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={clearAll}
                    className="p-1.5 rounded hover:bg-space-700 text-slate-500 hover:text-slate-300"
                    title="Cancella tutte"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded hover:bg-space-700 text-slate-500 hover:text-slate-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">
                Nessuna notifica
              </p>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <Link
                  key={n.id}
                  to={`/milestone/${n.milestoneId}`}
                  onClick={() => {
                    markRead(n.id);
                    setOpen(false);
                  }}
                  className={`block px-4 py-3 border-b border-space-700/50 hover:bg-space-800/50 transition-colors ${
                    !n.read ? 'bg-blue-500/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-slate-300 leading-snug">{n.message}</p>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <StatusBadge status={n.status} />
                    <span className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(n.timestamp), {
                        addSuffix: true,
                        locale: it,
                      })}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}