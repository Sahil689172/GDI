import React from 'react';
import { motion } from 'framer-motion';

const PERIODS = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

export const PeriodFilter = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border">
      {PERIODS.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`relative px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors ${
            value === p.id ? 'text-foreground' : 'text-muted hover:text-foreground'
          }`}
        >
          {value === p.id && (
            <motion.div
              layoutId="period-active"
              className="absolute inset-0 rounded-lg bg-elevated border border-border-strong shadow-glass-glow"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{p.label}</span>
        </button>
      ))}
    </div>
  );
};
