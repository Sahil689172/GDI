import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { NAV_ITEMS } from '../../routes/navigation';
import { ThemeToggle } from '../ThemeToggle';

export const MobileDrawer = () => {
  const { mobileMenuOpen, closeMobileMenu, openSearch } = useApp();
  const { user } = useAuth();
  const { streak } = useDashboard();
  const displayName = user?.name ?? 'Operator';
  const displayStreak = user?.streak ?? streak;
  const location = useLocation();

  useScrollLock(mobileMenuOpen);

  const handleNav = () => closeMobileMenu();

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-overlay backdrop-blur-md md:hidden"
            onClick={closeMobileMenu}
            aria-hidden
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 36 }}
            className="fixed top-0 left-0 bottom-0 z-[56] w-[min(300px,88vw)] md:hidden liquid-glass border-r border-border flex flex-col pt-safe pb-safe touch-manipulation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-elevated border border-border flex items-center justify-center">
                  <Zap className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-sans">Gotta-do-it</p>
                  <p className="text-[9px] font-mono text-muted uppercase tracking-wider">Focus OS</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="touch-target p-2 rounded-xl border border-border text-muted hover:text-foreground flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                openSearch();
                closeMobileMenu();
              }}
              className="mx-4 mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border text-left touch-target"
            >
              <Search className="w-4 h-4 text-muted shrink-0" />
              <span className="text-xs text-subtle font-sans flex-1">Search & commands</span>
              <kbd className="text-[9px] font-mono text-subtle bg-elevated border border-border px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </button>

            <nav className="flex-1 scroll-region scroll-smooth-touch p-4 space-y-1 min-h-0">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={handleNav}
                    className={`touch-target flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-elevated border border-border-strong text-foreground shadow-glass-glow'
                        : 'text-muted border border-transparent active:bg-surface'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="font-sans">{item.label}</span>
                    <span className="ml-auto text-[10px] font-mono text-subtle">{item.title}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted uppercase tracking-wider">Theme</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-elevated border border-border flex items-center justify-center font-mono text-sm font-bold">
                  {displayName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground font-sans truncate">{displayName}</p>
                  <p className="text-[10px] font-mono text-muted">{displayStreak}d streak</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
