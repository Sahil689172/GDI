import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NAV_ITEMS } from '../routes/navigation';

const PRIMARY_PATHS = ['/', '/tasks', '/calendar', '/focus'];

export const MobileNav = () => {
  const location = useLocation();
  const { openMobileMenu, closeMobileMenu, mobileMenuOpen } = useApp();

  const primaryItems = NAV_ITEMS.filter((item) => PRIMARY_PATHS.includes(item.path));
  const isMoreActive =
    !PRIMARY_PATHS.includes(location.pathname) || mobileMenuOpen;

  const handleNav = () => closeMobileMenu();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-2xl touch-manipulation"
      style={{
        paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom, 0px))',
      }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-between px-2 pt-2 pb-1 max-w-lg mx-auto w-full">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path && !mobileMenuOpen;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={handleNav}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 min-h-[56px] max-w-[72px] rounded-2xl transition-colors touch-manipulation active:scale-[0.97] ${
                isActive ? 'text-foreground' : 'text-muted'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-indicator"
                  className="absolute inset-1 rounded-2xl bg-elevated border border-border-strong shadow-glass-glow"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <Icon
                className="relative z-10 w-[22px] h-[22px] shrink-0"
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              <span className="relative z-10 text-[10px] font-medium font-sans leading-none">
                {item.label}
              </span>
            </NavLink>
          );
        })}

        <button
          type="button"
          onClick={openMobileMenu}
          className={`relative flex flex-1 flex-col items-center justify-center gap-1 min-h-[56px] max-w-[72px] rounded-2xl transition-colors touch-manipulation active:scale-[0.97] ${
            isMoreActive ? 'text-foreground' : 'text-muted'
          }`}
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
        >
          {isMoreActive && (
            <motion.div
              layoutId="mobile-tab-indicator"
              className="absolute inset-1 rounded-2xl bg-elevated border border-border-strong shadow-glass-glow"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <Menu
            className="relative z-10 w-[22px] h-[22px] shrink-0"
            strokeWidth={isMoreActive ? 2.25 : 1.75}
          />
          <span className="relative z-10 text-[10px] font-medium font-sans leading-none">More</span>
        </button>
      </div>
    </nav>
  );
};
