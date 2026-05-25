import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useApp } from '../context/AppContext';
import { NAV_ITEMS } from '../routes/navigation';
import { navIndicatorTransition } from '../animations/microinteractions';

export const Sidebar = () => {
  const { streak } = useDashboard();
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const location = useLocation();

  const width = sidebarCollapsed ? 'w-[72px]' : 'w-64';

  return (
    <aside
      className={`hidden md:flex flex-col ${width} h-screen border-r border-border bg-background/80 backdrop-blur-xl p-4 justify-between select-none fixed left-0 top-0 z-30 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`}
    >
      <div className="flex flex-col gap-6 mt-2">
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} gap-2`}>
          <div className={`flex items-center gap-2.5 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-gray-800 via-background to-gray-600 border border-border flex items-center justify-center shadow-glass-glow">
              <Zap className="w-4 h-4 text-foreground" />
            </div>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col overflow-hidden"
              >
                <h1 className="text-sm font-semibold tracking-wider uppercase text-foreground font-sans text-glow whitespace-nowrap">
                  Gotta-do-it
                </h1>
                <span className="text-[9px] font-mono text-muted uppercase tracking-widest leading-none">
                  Focus OS
                </span>
              </motion.div>
            )}
          </div>

          {!sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-border-strong hover:shadow-glass-glow transition-all"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="mx-auto p-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-border-strong transition-all"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={`
                  relative flex items-center gap-3.5 px-3 py-3 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 group touch-manipulation
                  ${sidebarCollapsed ? 'justify-center' : ''}
                  ${isActive ? 'text-foreground' : 'text-muted hover:text-foreground hover:shadow-glass-glow'}
                `}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-900/60 to-surface border border-border shadow-glass-glow z-0"
                    transition={navIndicatorTransition}
                  />
                )}

                <Icon
                  className={`relative z-10 w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    isActive
                      ? 'text-foreground '
                      : 'text-muted group-hover:text-foreground'
                  }`}
                />

                {!sidebarCollapsed && (
                  <span className="relative z-10">{item.label}</span>
                )}

                {item.path === '/focus' && !sidebarCollapsed && (
                  <span className="relative z-10 ml-auto flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground" />
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className={`border-t border-border pt-4 flex flex-col gap-4 ${sidebarCollapsed ? 'items-center' : ''}`}>
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="relative w-9 h-9 shrink-0 rounded-full bg-gradient-to-tr from-gray-900 via-gray-800 to-white/20 border border-border flex items-center justify-center">
            <span className="text-xs font-semibold text-foreground font-mono">S</span>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-foreground border border-background" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-medium text-foreground font-sans leading-snug">Sahil</span>
              <span className="text-[10px] font-mono text-muted leading-none">
                Streak: {streak}d
              </span>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <button className="flex items-center gap-2.5 px-3 py-2 text-[10px] font-mono tracking-wider uppercase text-subtle hover:text-foreground transition-colors duration-200">
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        )}
      </div>
    </aside>
  );
};
