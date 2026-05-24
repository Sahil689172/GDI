import React from 'react';
import { motion } from 'framer-motion';
import { FolderPlus, Sparkles } from 'lucide-react';

export const TasksEmptyState = ({ onCreateWorkspace }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="relative mb-8">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-2xl liquid-glass border border-border flex items-center justify-center shadow-glass-glow"
        >
          <FolderPlus className="w-10 h-10 text-muted" />
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-4 rounded-full border border-border border-dashed pointer-events-none"
        />
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="w-4 h-4 text-muted" />
        </motion.span>
      </div>

      <h3 className="text-lg font-semibold text-foreground font-sans text-glow mb-2">
        Create Your First Workspace
      </h3>
      <p className="text-xs text-muted font-sans max-w-sm mb-8 leading-relaxed">
        Organize your productivity into focused categories. Add tasks, track progress, and
        build momentum with a premium workspace flow.
      </p>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCreateWorkspace}
        className="px-6 py-3 rounded-xl bg-elevated border border-border border border-border text-xs font-semibold uppercase tracking-wider text-foreground hover:shadow-glass-glow transition-all"
      >
        New Workspace
      </motion.button>
    </motion.div>
  );
};
