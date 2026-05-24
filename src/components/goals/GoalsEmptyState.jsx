import React from 'react';
import { motion } from 'framer-motion';
import { Target, Sparkles } from 'lucide-react';

export const GoalsEmptyState = ({ onCreateGoal }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="relative mb-8">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-2xl liquid-glass border border-border flex items-center justify-center shadow-glass-glow"
        >
          <Target className="w-10 h-10 text-foreground" strokeWidth={1.5} />
        </motion.div>
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3], rotate: [0, 15, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-5 h-5 text-muted" />
        </motion.span>
      </div>

      <h3 className="text-xl font-semibold text-foreground font-sans text-glow mb-2 max-w-sm">
        Your future starts with one goal.
      </h3>
      <p className="text-xs text-muted font-sans max-w-md mb-8 leading-relaxed">
        Define long-term objectives, track daily consistency, and watch your progress rings
        fill with every committed day.
      </p>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCreateGoal}
        className="px-8 py-3 rounded-xl btn-primary text-xs font-semibold uppercase tracking-wider"
      >
        Create Your First Goal
      </motion.button>
    </motion.div>
  );
};
