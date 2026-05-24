import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { ProgressRing } from './ProgressRing';
import { AnimatedCounter } from '../../ui/AnimatedCounter';
import { StreakBadge } from './StreakBadge';
import { Flame, Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { staggerContainer, staggerItem } from '../../animations/pageTransitions';

export const GoalsOverview = ({ stats, topGoals }) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="mb-6 space-y-4"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { key: 'active', label: 'Active Goals', icon: Target },
          { key: 'completed', label: 'Completed', icon: CheckCircle2 },
          { key: 'avgProgress', label: 'Avg Progress', icon: TrendingUp, suffix: '%' },
          { key: 'maxStreak', label: 'Best Streak', icon: Flame },
        ].map(({ key, label, icon: Icon, suffix = '' }) => (
          <motion.div key={key} variants={staggerItem}>
            <GlassCard className="!p-4 min-h-[80px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-muted uppercase tracking-widest">
                  {label}
                </span>
                <Icon className="w-3.5 h-3.5 text-muted" />
              </div>
              <span className="text-2xl font-bold font-mono text-foreground mt-2">
                <AnimatedCounter value={stats[key]} />
                {suffix}
              </span>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {topGoals.length > 0 && (
        <motion.div variants={staggerItem}>
          <GlassCard className="!p-5" hover={false}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">
                  Progress Matrix
                </h3>
                <p className="text-[10px] text-subtle font-sans mt-0.5">
                  Top objectives at a glance
                </p>
              </div>
              <StreakBadge streak={stats.maxStreak} label="Peak Consistency" />
            </div>
            <div className="flex flex-wrap justify-center sm:justify-around gap-6">
              {topGoals.map((goal) => (
                <ProgressRing
                  key={goal.id}
                  progress={goal.progress}
                  size={100}
                  strokeWidth={5}
                  label={goal.title}
                  sublabel={`${goal.daysCompleted}/${goal.targetDays}d`}
                />
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  );
};
