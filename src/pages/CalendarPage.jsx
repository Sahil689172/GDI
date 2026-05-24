import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { PageHeader } from '../ui/PageHeader';
import { staggerContainer, staggerItem } from '../animations/pageTransitions';

export const CalendarPage = () => {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <PageHeader
        title="Flow Calendar"
        subtitle="Track historic streak accomplishments and upcoming focus deadlines."
        badge="May 2026"
      />

      <motion.div variants={staggerItem}>
        <GlassCard className="max-w-3xl mx-auto" glow>
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-semibold text-foreground tracking-widest font-mono uppercase">
              May 2026
            </span>
            <span className="text-[10px] font-mono text-muted uppercase tracking-widest">
              Global commits synchronized
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2.5 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
              <span
                key={i}
                className="text-[9px] font-mono text-muted uppercase tracking-wider pb-2"
              >
                {d}
              </span>
            ))}
            {Array.from({ length: 31 }).map((_, idx) => {
              const day = idx + 1;
              const isStreak = day >= 10 && day <= 22;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className={`aspect-square flex items-center justify-center rounded-xl text-xs font-mono border transition-all ${
                    isStreak
                      ? 'bg-elevated border-border-strong text-foreground shadow-glass-glow'
                      : 'bg-surface border-border text-subtle hover:border-border'
                  }`}
                >
                  {day}
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};
