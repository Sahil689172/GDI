import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { AnimatedCounter } from '../../ui/AnimatedCounter';
import { Flame, Clock, Zap } from 'lucide-react';

export const FocusAnalyticsSection = ({ focus }) => {
  const rows = [
    { label: 'Total Focus Hours', value: focus.totalHours, suffix: 'h', icon: Clock },
    { label: 'Daily Average', value: focus.avgPerDay, suffix: 'h', icon: Zap },
    { label: 'Sessions Est.', value: focus.sessionsEstimate, suffix: '', icon: Flame },
    { label: 'Current Streak', value: focus.streak, suffix: 'd', icon: Flame },
  ];

  return (
    <GlassCard className="!p-5" hover={false}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-sans mb-4">
        Focus Analytics
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border"
            >
              <Icon className="w-4 h-4 text-muted shrink-0" />
              <div>
                <p className="text-[9px] font-mono text-subtle uppercase tracking-wider">
                  {row.label}
                </p>
                <p className="text-lg font-bold font-mono text-foreground">
                  <AnimatedCounter value={row.value} />
                  {row.suffix}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
};
