import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Settings,
  Rocket,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { NotificationBell } from './NotificationBell';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/news', label: 'News & Updates', icon: Newspaper },
  { path: '/settings', label: 'Impostazioni', icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-space-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <Rocket className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-100 leading-tight">
                  SpaceX Milestone Tracker
                </h1>
                <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                  SPCX · Long-Term Investor View
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-space-700/50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <NotificationBell />
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              <NotificationBell />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg hover:bg-space-700"
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5 text-slate-400" />
                ) : (
                  <Menu className="h-5 w-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-space-700/50 px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-space-700/50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {children}
      </main>

      <footer className="border-t border-space-700/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-600">
          SpaceX Milestone Tracker — Strumento di monitoraggio per investitori di lungo termine.
          Non costituisce consulenza finanziaria.
        </div>
      </footer>
    </div>
  );
}