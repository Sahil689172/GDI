import React from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { GlassCard } from '../ui/GlassCard';
import { PageHeader } from '../ui/PageHeader';
import { staggerContainer, staggerItem } from '../animations/pageTransitions';

export const ProfilePage = () => {
  const { streak, focusHours } = useDashboard();

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <PageHeader
        title="Focus Credentials"
        subtitle="System access parameters and historic benchmarks."
        badge="Operator"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <motion.div variants={staggerItem}>
          <GlassCard className="flex flex-col items-center justify-center text-center p-6" glow>
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gray-900 via-gray-800 to-white/15 border border-border flex items-center justify-center shadow-glass-glow mb-4">
              <span className="text-2xl font-bold font-mono text-foreground text-glow">S</span>
            </div>
            <h2 className="text-base font-semibold text-foreground font-sans">Sahil</h2>
            <span className="text-[10px] font-mono text-muted uppercase tracking-widest mt-1">
              Focus Operator
            </span>
          </GlassCard>
        </motion.div>

        <motion.div variants={staggerItem} className="md:col-span-2">
          <GlassCard>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4 font-sans">
              Security Profile Logs
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs text-muted font-sans">Current Streak Core</span>
                <span className="text-xs font-mono text-foreground font-bold">{streak} Days</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs text-muted font-sans">Accumulated Focus Logs</span>
                <span className="text-xs font-mono text-foreground font-bold">{focusHours} Hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted font-sans">Focus Engine Security Key</span>
                <span className="text-[9px] font-mono text-muted bg-elevated px-3 py-1 rounded border border-border">
                  GDID-8892-FCS
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};
