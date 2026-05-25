import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X, Calendar } from 'lucide-react';
import { EventCard } from './EventCard';

export const DayEventsModal = ({ open, date, events = [], onClose, onEventClick }) => {
  const title = date ? format(date, 'EEEE, MMM d') : '';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[66] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-overlay backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full sm:max-w-sm max-h-[80vh] flex flex-col liquid-glass rounded-t-2xl sm:rounded-2xl border border-border shadow-glass-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 p-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-elevated border border-border flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-foreground" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-foreground font-sans truncate">
                    {title}
                  </h2>
                  <p className="text-[10px] font-mono text-muted uppercase tracking-wider">
                    {events.length} event{events.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-subtle hover:text-foreground transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-2 no-scrollbar">
              {events.length === 0 ? (
                <p className="text-xs text-muted text-center py-6 font-sans">No events</p>
              ) : (
                events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    compact
                    onClick={(ev) => {
                      onClose();
                      onEventClick?.(ev);
                    }}
                  />
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
