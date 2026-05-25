import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { EventCard } from './EventCard';

export const TodaySchedule = ({ events, onEventClick }) => {
  return (
    <GlassCard className="h-full !p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-muted" />
        <h3 className="text-xs font-semibold text-foreground font-sans uppercase tracking-wider">
          Today&apos;s Schedule
        </h3>
        <span className="ml-auto text-[10px] font-mono text-muted">{events.length}</span>
      </div>

      <div className="space-y-2 max-h-[280px] overflow-y-auto no-scrollbar">
        <AnimatePresence mode="popLayout">
          {events.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-muted font-sans text-center py-6"
            >
              No events scheduled for today.
            </motion.p>
          ) : (
            events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={onEventClick}
                compact
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};
