import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

export const AnalyticsEmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="py-16"
  >
    <GlassCard className="!p-10 text-center max-w-lg mx-auto" glow hover={false}>
      <BarChart3 className="w-10 h-10 text-muted mx-auto mb-4" strokeWidth={1.5} />
      <h3 className="text-lg font-semibold text-foreground font-sans text-glow mb-2">
        No analytics available
      </h3>
      <p className="text-xs text-muted font-sans leading-relaxed max-w-sm mx-auto">
        Your charts and insights are built from real tasks, goals, and focus sessions. Start
        using the app to see productivity metrics here.
      </p>
    </GlassCard>
  </motion.div>
);
