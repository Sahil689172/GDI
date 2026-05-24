import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export const StreakBadge = ({ streak, label = 'Day Streak', compact = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center gap-2 rounded-xl border border-border bg-elevated
        ${compact ? 'px-2.5 py-1' : 'px-3 py-1.5'}
      `}
    >
      <motion.div
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Flame className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-foreground`} />
      </motion.div>
      <div className="flex flex-col leading-none">
        <span className={`font-bold font-mono text-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
          {streak}
        </span>
        {!compact && (
          <span className="text-[8px] font-mono text-muted uppercase tracking-widest mt-0.5">
            {label}
          </span>
        )}
      </div>
    </motion.div>
  );
};
