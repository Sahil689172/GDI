import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { AnimatedCounter } from '../../ui/AnimatedCounter';

export const MetricCard = ({ label, value, suffix = '', icon: Icon, glow = false, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="!p-4 min-h-[96px] flex flex-col justify-between" glow={glow}>
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-muted uppercase tracking-widest leading-tight">
            {label}
          </span>
          {Icon && <Icon className="w-3.5 h-3.5 text-muted shrink-0" />}
        </div>
        <div className="mt-3">
          <span className="text-2xl md:text-3xl font-bold font-mono text-foreground text-glow">
            <AnimatedCounter value={typeof value === 'number' ? value : 0} />
            {suffix}
          </span>
        </div>
      </GlassCard>
    </motion.div>
  );
};
