import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isTomorrow } from 'date-fns';
import { AlertCircle, Flag } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

const formatDue = (date) => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d');
};

export const UpcomingDeadlines = ({ deadlines, onEventClick }) => {
  return (
    <GlassCard className="h-full !p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-4 h-4 text-muted" />
        <h3 className="text-xs font-semibold text-foreground font-sans uppercase tracking-wider">
          Upcoming Deadlines
        </h3>
      </div>

      <div className="space-y-2 max-h-[280px] overflow-y-auto no-scrollbar">
        <AnimatePresence mode="popLayout">
          {deadlines.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-muted font-sans text-center py-6"
            >
              No deadlines in the next two weeks.
            </motion.p>
          ) : (
            deadlines.map((event, i) => (
              <motion.button
                key={event.id}
                type="button"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => onEventClick?.(event)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all hover:bg-elevated hover:shadow-glass-glow ${
                  event.priority === 'high'
                    ? 'border-border-strong bg-elevated'
                    : 'border-border bg-surface'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate font-sans">
                      {event.title}
                    </p>
                    <p className="text-[9px] font-mono text-muted mt-0.5 capitalize">
                      {event.type}
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className="text-[9px] font-mono text-foreground">
                      {formatDue(event.start)}
                    </span>
                    {event.priority === 'high' && (
                      <Flag className="w-3 h-3 text-foreground" />
                    )}
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};
