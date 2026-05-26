import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

export const FocusEmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <GlassCard className="!p-8 text-center" hover={false}>
      <Clock className="w-8 h-8 text-muted mx-auto mb-3" strokeWidth={1.5} />
      <p className="text-sm font-medium text-foreground font-sans mb-1">
        No focus sessions recorded
      </p>
      <p className="text-[11px] text-muted font-sans">
        Complete a focus timer session to build your history and stats.
      </p>
    </GlassCard>
  </motion.div>
);
