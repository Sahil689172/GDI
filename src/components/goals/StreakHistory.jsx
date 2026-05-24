import React from 'react';
import { motion } from 'framer-motion';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const StreakHistory = ({ history = [], className = '' }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[9px] font-mono text-muted uppercase tracking-widest">
        7-Day Consistency
      </span>
      <div className="flex items-end gap-1.5 h-10">
        {history.map((active, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: active ? '100%' : '25%' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`w-full rounded-sm min-h-[4px] ${
                active ? 'bg-foreground shadow-glass-glow' : 'bg-border'
              }`}
            />
            <span className="text-[7px] font-mono text-subtle">{DAY_LABELS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
