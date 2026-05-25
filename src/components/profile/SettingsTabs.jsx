import React from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Bell,
  Sliders,
  Calendar,
  Shield,
  UserCircle,
} from 'lucide-react';

export const SETTINGS_TABS = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'productivity', label: 'Productivity', icon: Sliders },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'account', label: 'Account', icon: UserCircle },
];

export const SettingsTabs = ({ active, onChange }) => {
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
      {SETTINGS_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-[10px] font-mono uppercase tracking-wider transition-colors ${
              isActive
                ? 'text-foreground border-border-strong'
                : 'text-muted border-border bg-surface hover:text-foreground'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="settings-tab"
                className="absolute inset-0 rounded-xl bg-elevated border border-border-strong shadow-glass-glow"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10 hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
