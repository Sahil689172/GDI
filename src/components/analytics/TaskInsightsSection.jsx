import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { AnimatedCounter } from '../../ui/AnimatedCounter';
import { ListTodo, CheckCircle2, AlertTriangle, Folder } from 'lucide-react';

export const TaskInsightsSection = ({ insights }) => {
  const items = [
    { label: 'Completed', value: insights.completed, icon: CheckCircle2 },
    { label: 'Pending', value: insights.pending, icon: ListTodo },
    { label: 'High Priority', value: insights.highPriority, icon: AlertTriangle },
    { label: 'Workspaces', value: insights.workspaces, icon: Folder },
  ];

  return (
    <GlassCard className="!p-5" hover={false}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-sans mb-4">
        Task Completion Insights
      </h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="p-3 rounded-xl border border-border bg-surface text-center"
            >
              <Icon className="w-3.5 h-3.5 text-muted mx-auto mb-1.5" />
              <p className="text-xl font-bold font-mono text-foreground">
                <AnimatedCounter value={item.value} />
              </p>
              <p className="text-[8px] font-mono text-subtle uppercase tracking-wider mt-0.5">
                {item.label}
              </p>
            </motion.div>
          );
        })}
      </div>
      <div className="pt-3 border-t border-border">
        <div className="flex justify-between text-[10px] font-mono text-muted mb-1.5">
          <span>Completion rate</span>
          <span className="text-foreground font-bold">{insights.completionRate}%</span>
        </div>
        <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden border border-border">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${insights.completionRate}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-foreground shadow-glass-glow"
          />
        </div>
      </div>
    </GlassCard>
  );
};
