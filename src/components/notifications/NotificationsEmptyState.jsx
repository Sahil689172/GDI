import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { BellOff } from 'lucide-react';

export const NotificationsEmptyState = memo(function NotificationsEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl liquid-glass border border-border flex items-center justify-center mb-4">
        <BellOff className="w-7 h-7 text-muted" />
      </div>
      <p className="text-sm font-medium text-foreground">All caught up</p>
      <p className="text-xs text-muted mt-1 max-w-[240px]">
        Reminders for tasks, goals, streaks, and daily summaries will appear here.
      </p>
    </motion.div>
  );
});
