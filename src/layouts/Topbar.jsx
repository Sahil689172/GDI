import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Bell,
  Plus,
  Target,
  Flame,
  Command,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useDashboard } from '../context/DashboardContext';
import { getPageTitle } from '../routes/navigation';
import { ThemeToggle } from '../components/ThemeToggle';

const QUICK_ACTIONS = [
  { label: 'Add Task', icon: Plus, path: '/tasks' },
  { label: 'Goals', icon: Target, path: '/goals' },
  { label: 'Focus', icon: Flame, path: '/focus' },
];

export const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openSearch } = useApp();
  const { streak } = useDashboard();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pageTitle = getPageTitle(location.pathname);
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-20 w-full px-4 md:px-8 pt-4 pb-2">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="liquid-glass rounded-2xl px-4 md:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-border"
      >
        <div className="flex items-center justify-between lg:justify-start gap-4 min-w-0">
          <div className="min-w-0">
            <motion.h2
              key={pageTitle}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm md:text-base font-semibold text-foreground font-sans tracking-wide truncate"
            >
              {pageTitle}
            </motion.h2>
            <p className="text-[10px] font-mono text-muted uppercase tracking-widest mt-0.5 hidden sm:block">
              Gotta-do-it · Focus OS
            </p>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={openSearch}
              className="p-2 rounded-xl border border-border text-muted hover:text-foreground hover:border-border-strong transition-all"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-900 via-gray-800 to-white/15 border border-border flex items-center justify-center text-xs font-mono text-foreground">
              S
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={openSearch}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface border border-border hover:border-border-strong hover:shadow-glass-glow transition-all group text-left"
          >
            <Search className="w-4 h-4 text-muted group-hover:text-muted transition-colors" />
            <span className="text-xs text-subtle font-sans flex-1">
              Search tasks, goals, categories...
            </span>
            <kbd className="hidden sm:flex items-center gap-0.5 text-[9px] font-mono text-subtle bg-elevated border border-border px-2 py-0.5 rounded-md">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-3 md:gap-4">
          <div className="hidden sm:flex items-center gap-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(action.path)}
                  className="p-2 rounded-xl bg-surface border border-border text-muted hover:text-foreground hover:border-border-strong hover:shadow-glass-glow transition-all"
                  title={action.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </motion.button>
              );
            })}
          </div>

          <motion.div
            className="hidden lg:flex flex-col items-end text-right px-3 border-l border-border"
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-sm font-mono font-bold text-foreground tracking-wider">{timeStr}</span>
            <span className="text-[9px] font-mono text-muted uppercase tracking-widest">
              {dateStr}
            </span>
          </motion.div>

          <ThemeToggle className="hidden sm:flex" />

          <button className="relative p-2 rounded-xl border border-border text-muted hover:text-foreground hover:border-border-strong transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-foreground shadow-glass-glow" />
          </button>

          <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-border">
            <div className="text-right hidden xl:block">
              <span className="text-xs font-medium text-foreground block leading-tight">Sahil</span>
              <span className="text-[9px] font-mono text-muted">{streak}d streak</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-900 via-gray-800 to-white/15 border border-border flex items-center justify-center shadow-glass-glow">
              <span className="text-xs font-bold font-mono text-foreground">S</span>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
};
