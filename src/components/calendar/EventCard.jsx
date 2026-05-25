import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Flame, Bell, Flag } from 'lucide-react';
import { formatEventTime } from './eventUtils';

const ICONS = {
  assignment: BookOpen,
  goal: Target,
  focus: Flame,
  reminder: Bell,
};

export const EventCard = ({ event, onClick, compact = false }) => {
  const Icon = ICONS[event.type] || BookOpen;

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 6 }}
      onClick={() => onClick?.(event)}
      className={`
        w-full text-left rounded-xl border bg-surface hover:bg-elevated
        hover:border-border-strong hover:shadow-glass-glow transition-all
        ${compact ? 'p-2.5' : 'p-3'}
        ${event.priority === 'high' ? 'border-border-strong' : 'border-border'}
      `}
    >
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center shrink-0">
          <Icon className="w-3.5 h-3.5 text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-foreground font-sans truncate">
              {event.title}
            </span>
            {event.priority === 'high' && (
              <Flag className="w-3 h-3 text-foreground shrink-0" />
            )}
          </div>
          <p className="text-[9px] font-mono text-muted mt-0.5">{formatEventTime(event)}</p>
          {!compact && event.description && (
            <p className="text-[10px] text-subtle mt-1 line-clamp-1">{event.description}</p>
          )}
        </div>
      </div>
    </motion.button>
  );
};
