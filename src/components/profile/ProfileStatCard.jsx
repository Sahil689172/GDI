import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { AnimatedCounter } from '../../ui/AnimatedCounter';

export const ProfileStatCard = ({ label, value, suffix = '', icon: Icon, delay = 0, decimals }) => {
  const isNumber = typeof value === 'number';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <GlassCard className="!p-4" hover={false}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-mono text-muted uppercase tracking-wider">{label}</span>
          {Icon && <Icon className="w-3.5 h-3.5 text-muted" />}
        </div>
        <p className="text-xl font-bold font-mono text-foreground text-glow">
          {isNumber ? (
            <>
              <AnimatedCounter value={value} />
              {suffix}
            </>
          ) : (
            <>
              {value}
              {suffix}
            </>
          )}
        </p>
      </GlassCard>
    </motion.div>
  );
};
