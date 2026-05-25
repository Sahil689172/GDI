import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';

export const WeeklyFocusChart = ({ weekDays }) => {
  const max = Math.max(...weekDays.map((d) => d.minutes), 1);

  return (
    <GlassCard className="!p-4 h-full" hover={false}>
      <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted mb-4">
        Weekly Focus
      </h3>
      <div className="flex items-end justify-between gap-2 h-28">
        {weekDays.map((day, i) => {
          const barH = Math.max(6, (day.minutes / max) * 96);
          return (
          <div key={day.label} className="flex-1 flex flex-col items-center gap-2 min-w-0 h-full justify-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: barH }}
              transition={{ delay: i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[28px] rounded-t-md bg-foreground/80"
            />
            <span className="text-[8px] font-mono text-muted uppercase">{day.label}</span>
          </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
