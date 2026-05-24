import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAV_ITEMS } from '../routes/navigation';

export const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-2xl border-t border-border z-30 px-1 py-1 flex items-center justify-around select-none overflow-x-auto no-scrollbar">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={`relative flex flex-col items-center gap-0.5 px-1.5 py-1.5 rounded-xl text-[8px] font-medium tracking-wider transition-all duration-150 shrink-0 ${
              isActive ? 'text-foreground' : 'text-muted'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="mobile-active"
                className="absolute inset-x-1 inset-y-0.5 rounded-xl bg-elevated border border-border z-0"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
            <Icon className={`relative z-10 w-4 h-4 ${isActive ? 'text-foreground' : ''}`} />
            <span className="relative z-10 font-sans">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
