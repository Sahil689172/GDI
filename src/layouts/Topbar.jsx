import React, { useState, useEffect, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Target,
  Flame,
  Command,
  Menu,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { useIsMobileLayout } from '../hooks/useMediaQuery';
import { getPageTitle } from '../routes/navigation';
import { ThemeToggle } from '../components/ThemeToggle';
import { NotificationBell } from '../components/notifications/NotificationBell';
import { SyncButton } from '../components/sync/SyncButton';
import { InstallPrompt } from '../components/pwa/InstallPrompt';
import { DURATION, EASE } from '../animations/motion';

const QUICK_ACTIONS = [
  { label: 'Add Task', icon: Plus, path: '/tasks' },
  { label: 'Goals', icon: Target, path: '/goals' },
  { label: 'Focus', icon: Flame, path: '/focus' },
];

export const Topbar = memo(function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openSearch, openMobileMenu } = useApp();
  const { user } = useAuth();
  const { streak } = useDashboard();
  const displayName = user?.name ?? 'Operator';
  const displayStreak = user?.streak ?? streak;
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const isMobile = useIsMobileLayout();
  const isHome = location.pathname === '/';
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pageTitle = getPageTitle(location.pathname);
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isMobile && isHome) {
    return (
      <header className="sticky top-0 z-20 w-full px-4 pt-2 pb-1 pt-safe">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={openMobileMenu}
            className="touch-target w-10 h-10 rounded-xl border border-border bg-surface flex items-center justify-center shrink-0"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest flex-1 text-center">
            Gotta-do-it
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={openSearch}
              className="touch-target w-10 h-10 rounded-xl border border-border bg-surface flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-foreground" />
            </button>
            <SyncButton className="scale-90" />
            <NotificationBell className="scale-90" />
            <InstallPrompt />
            <ThemeToggle className="scale-90" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-20 w-full px-4 md:px-8 pt-2 sm:pt-4 pb-2 pt-safe">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.normal, ease: EASE.out }}
        className="liquid-glass glass-interactive rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-border min-w-0"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {isMobile && (
            <button
              type="button"
              onClick={openMobileMenu}
              className="touch-target p-2 rounded-xl border border-border shrink-0"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-sm sm:text-base font-semibold text-foreground font-sans truncate">
              {pageTitle}
            </h2>
            {!isMobile && (
              <p className="text-[10px] font-mono text-muted uppercase tracking-widest mt-0.5 truncate hidden sm:block">
                Gotta-do-it · Focus OS
              </p>
            )}
          </div>
          {isMobile && (
            <div className="flex items-center gap-1 shrink-0">
              <SyncButton className="md:hidden" />
              <NotificationBell className="md:hidden" />
              <InstallPrompt />
              <ThemeToggle className="scale-90" />
              <button
                type="button"
                onClick={openSearch}
                className="touch-target p-2 rounded-xl border border-border"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-4 min-w-0">
          <button
            type="button"
            onClick={openSearch}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface border border-border hover:border-border-strong transition-all text-left"
          >
            <Search className="w-4 h-4 text-muted shrink-0" />
            <span className="text-xs text-subtle font-sans flex-1 truncate">Search...</span>
            <kbd className="hidden lg:flex items-center gap-0.5 text-[9px] font-mono text-subtle bg-elevated border border-border px-2 py-0.5 rounded-md">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>
        </div>

        <div className="hidden sm:flex items-center justify-end gap-2 md:gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.path}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => navigate(action.path)}
                  className="touch-target p-2 rounded-xl bg-surface border border-border"
                  title={action.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </motion.button>
              );
            })}
          </div>
          <div className="hidden xl:flex flex-col items-end text-right px-3 border-l border-border">
            <span className="text-sm font-mono font-bold text-foreground">{timeStr}</span>
          </div>
          <ThemeToggle className="hidden sm:flex" />
          <SyncButton className="hidden md:flex" />
          <NotificationBell className="hidden md:flex" />
          <div className="hidden md:flex">
            <InstallPrompt />
          </div>
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-border">
            <div className="text-right hidden xl:block">
              <span className="text-xs font-medium text-foreground block truncate max-w-[120px]">
                {displayName}
              </span>
              <span className="text-[9px] font-mono text-muted">{displayStreak}d streak</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-elevated border border-border flex items-center justify-center">
              <span className="text-xs font-bold font-mono">{initials}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
});
