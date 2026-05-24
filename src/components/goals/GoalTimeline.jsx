import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';

export const GoalTimeline = ({
  milestones = [],
  currentDay = 0,
  compact = false,
  onToggleMilestone,
  goalId,
}) => {
  if (!milestones.length) {
    return (
      <p className="text-[10px] text-subtle font-mono text-center py-3">No milestones yet</p>
    );
  }

  return (
    <div className={`relative ${compact ? 'pl-3' : 'pl-4'}`}>
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
      <div className="flex flex-col gap-3">
        {milestones.map((m, i) => {
          const upcoming = !m.completed && m.targetDay && m.targetDay > currentDay;
          return (
            <motion.button
              type="button"
              key={m.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onToggleMilestone?.(goalId, m.id)}
              disabled={!onToggleMilestone}
              className={`relative flex items-start gap-3 w-full text-left ${
                onToggleMilestone ? 'hover:opacity-80 cursor-pointer' : ''
              }`}
            >
              <div
                className={`relative z-10 w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  m.completed
                    ? 'bg-foreground border-foreground'
                    : upcoming
                      ? 'border-border-strong bg-surface'
                      : 'border-border bg-surface'
                }`}
              >
                {m.completed && <Check className="w-2 h-2 text-background" strokeWidth={3} />}
                {!m.completed && upcoming && (
                  <Circle className="w-1.5 h-1.5 text-muted fill-current" />
                )}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <p
                  className={`text-[11px] font-sans leading-snug ${
                    m.completed ? 'text-muted line-through' : 'text-foreground'
                  }`}
                >
                  {m.title}
                </p>
                {m.targetDay != null && (
                  <span className="text-[8px] font-mono text-subtle uppercase tracking-wider">
                    Day {m.targetDay}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
