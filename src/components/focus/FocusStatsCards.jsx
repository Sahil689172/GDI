import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Timer, Sun, Sparkles } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { AnimatedCounter } from '../../ui/AnimatedCounter';

const Stat = ({ label, value, suffix = '', icon: Icon, displayValue, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
  >
    <GlassCard className="!p-4 h-full" hover={false}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-[9px] font-mono text-muted uppercase tracking-wider leading-tight">
          {label}
        </span>
        <Icon className="w-3.5 h-3.5 text-muted shrink-0" />
      </div>
      <p className="text-xl font-bold font-mono text-foreground text-glow">
        {displayValue ?? (
          <>
            <AnimatedCounter value={typeof value === 'number' ? value : 0} />
            {suffix}
          </>
        )}
      </p>
    </GlassCard>
  </motion.div>
);

export const FocusStatsCards = ({ analytics }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <Stat
      label="Total Focus"
      icon={Clock}
      displayValue={`${analytics.totalHours}h`}
    />
    <Stat
      label="Avg Session"
      value={analytics.avgSession}
      suffix="m"
      icon={Timer}
      delay={0.05}
    />
    <Stat
      label="Today"
      icon={Sun}
      displayValue={`${analytics.dailyHoursToday}h`}
      delay={0.1}
    />
    <Stat
      label="Best Time"
      icon={Sparkles}
      displayValue={analytics.bestTime}
      delay={0.15}
    />
  </div>
);
