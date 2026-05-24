import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, ListTodo, TrendingUp } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { AnimatedCounter } from '../../ui/AnimatedCounter';
import { staggerContainer, staggerItem } from '../../animations/pageTransitions';

const STAT_CARDS = [
  { key: 'total', label: 'Total Tasks', icon: ListTodo },
  { key: 'completed', label: 'Completed', icon: CheckSquare },
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'productivity', label: 'Productivity', icon: TrendingUp, suffix: '%' },
];

export const TaskStatsBar = ({ stats }) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
    >
      {STAT_CARDS.map(({ key, label, icon: Icon, suffix = '' }) => (
        <motion.div key={key} variants={staggerItem}>
          <GlassCard className="!p-4 min-h-[88px] flex flex-col justify-between" hover>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-muted uppercase tracking-widest">
                {label}
              </span>
              <Icon className="w-3.5 h-3.5 text-muted" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold font-mono text-foreground text-glow">
                <AnimatedCounter value={stats[key]} />
                {suffix}
              </span>
            </div>
            {key === 'productivity' && (
              <div className="w-full h-1 bg-gray-900 rounded-full mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.productivity}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-foreground shadow-glass-glow"
                />
              </div>
            )}
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
};
