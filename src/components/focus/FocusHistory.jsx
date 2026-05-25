import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { History } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { formatDurationLabel } from './focusConstants';

const phaseLabel = (phase) => {
  if (phase === 'work') return 'Focus';
  if (phase === 'longBreak') return 'Long break';
  return 'Break';
};

export const FocusHistory = ({ history }) => {
  const items = history.slice(0, 12);

  return (
    <GlassCard className="!p-4 h-full" hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <History className="w-4 h-4 text-muted" />
        <h3 className="text-xs font-semibold text-foreground font-sans uppercase tracking-wider">
          Focus History
        </h3>
      </div>
      <div className="space-y-2 max-h-[240px] overflow-y-auto no-scrollbar">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <p className="text-[10px] text-muted text-center py-8 font-sans">
              No sessions yet. Start your first focus block.
            </p>
          ) : (
            items.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-border bg-surface"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground font-sans capitalize truncate">
                    {session.mode} · {phaseLabel(session.phase)}
                  </p>
                  <p className="text-[9px] font-mono text-muted mt-0.5">
                    {format(new Date(session.completedAt), 'MMM d · h:mm a')}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-foreground shrink-0">
                  {formatDurationLabel(session.minutes)}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};
