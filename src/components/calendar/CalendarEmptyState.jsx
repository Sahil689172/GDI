import React from 'react';
import { motion } from 'framer-motion';
import { CalendarPlus } from 'lucide-react';

export const CalendarEmptyState = ({ onAdd }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-elevated border border-border flex items-center justify-center mb-4 shadow-glass">
        <CalendarPlus className="w-6 h-6 text-muted" />
      </div>
      <h3 className="text-sm font-semibold text-foreground font-sans mb-1">
        Your calendar is clear
      </h3>
      <p className="text-[11px] text-muted font-sans max-w-xs mb-5">
        Schedule assignments, goals, focus sessions, and reminders to stay on track.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
      >
        Add first event
      </button>
    </motion.div>
  );
};
