import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { Target } from 'lucide-react';

export const GoalPerformanceSection = ({ goals }) => {
  return (
    <GlassCard className="!p-5" hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-3.5 h-3.5 text-muted" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">
          Goal Performance
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {goals.length === 0 ? (
          <p className="text-[10px] text-muted text-center py-8 font-sans">No goals yet</p>
        ) : (
        goals.slice(0, 5).map((goal, i) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col gap-1.5"
          >
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-sans text-foreground truncate pr-2">{goal.title}</span>
              <span className="font-mono text-muted shrink-0">{goal.progress}%</span>
            </div>
            <div className="h-1 bg-gray-900 rounded-full overflow-hidden border border-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goal.progress}%` }}
                transition={{ duration: 0.8, delay: i * 0.08 }}
                className="h-full bg-foreground"
              />
            </div>
            <span className="text-[8px] font-mono text-subtle">
              {goal.daysCompleted}/{goal.targetDays}d · {goal.streak}d streak
            </span>
          </motion.div>
        ))
        )}
      </div>
    </GlassCard>
  );
};
