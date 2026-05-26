import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Trash2,
  Pencil,
  Calendar,
  Target,
  Archive,
} from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { ProgressRing } from './ProgressRing';
import { StreakBadge } from './StreakBadge';
import { GoalTimeline } from './GoalTimeline';
import { StreakHistory } from './StreakHistory';
import { formatDeadlineLabel, getCategoryLabel } from '../../utils/goalProgress';

export const GoalCard = ({
  goal,
  onLogDay,
  onToggleMilestone,
  onDelete,
  onEdit,
  onArchive,
}) => {
  const [expanded, setExpanded] = useState(false);
  const milestonesDone = goal.milestones.filter((m) => m.completed).length;
  const canLog = goal.status === 'active' && !goal.isCompleted;
  const isArchived = goal.status === 'archived';

  return (
    <GlassCard
      className="!p-0 overflow-hidden"
      glow={goal.progress >= 75 && goal.status === 'active'}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <ProgressRing
            progress={goal.progress}
            size={88}
            strokeWidth={5}
            sublabel={`${goal.daysCompleted}/${goal.targetDays}d`}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-[8px] font-mono text-muted uppercase tracking-widest px-1.5 py-0.5 rounded border border-border bg-surface">
                    {getCategoryLabel(goal.category)}
                  </span>
                  {goal.status === 'completed' && (
                    <span className="text-[8px] font-mono text-foreground uppercase tracking-widest">
                      Completed
                    </span>
                  )}
                  {isArchived && (
                    <span className="text-[8px] font-mono text-subtle uppercase tracking-widest">
                      Archived
                    </span>
                  )}
                  {goal.isOverdue && (
                    <span className="text-[8px] font-mono text-red-400/90 uppercase tracking-widest">
                      Overdue
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-foreground font-sans truncate">
                  {goal.title}
                </h3>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {!isArchived && onArchive && goal.status === 'completed' && (
                  <button
                    type="button"
                    onClick={() => onArchive(goal.id)}
                    className="p-1.5 rounded-lg text-subtle hover:text-foreground hover:bg-elevated transition-colors"
                    aria-label="Archive goal"
                  >
                    <Archive className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onEdit(goal)}
                  className="p-1.5 rounded-lg text-subtle hover:text-foreground hover:bg-elevated transition-colors"
                  aria-label="Edit goal"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(goal)}
                  className="p-1.5 rounded-lg text-subtle hover:text-foreground hover:bg-elevated transition-colors"
                  aria-label="Delete goal"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {goal.description && (
              <p className="text-[10px] text-muted font-sans mt-1.5 line-clamp-2 leading-relaxed">
                {goal.description}
              </p>
            )}

            <p className="text-[9px] font-mono text-subtle mt-2 flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" />
              {formatDeadlineLabel(goal)}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <StreakBadge streak={goal.streak} compact />
              <span className="text-[9px] font-mono text-subtle flex items-center gap-1">
                <Target className="w-2.5 h-2.5" />
                {milestonesDone}/{goal.milestones.length} milestones
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {canLog && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onLogDay(goal.id)}
              className="flex-1 py-2 rounded-xl btn-primary text-[10px] font-semibold uppercase tracking-wider"
            >
              Log Today
            </motion.button>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 rounded-xl border border-border bg-surface text-muted hover:text-foreground hover:border-border-strong transition-all flex items-center gap-1"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider">Details</span>
            <motion.span animate={{ rotate: expanded ? 180 : 0 }}>
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center gap-2 mb-3 text-[9px] font-mono text-muted uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  Timeline
                </div>
                <GoalTimeline
                  milestones={goal.milestones}
                  currentDay={goal.daysCompleted}
                  goalId={goal.id}
                  onToggleMilestone={onToggleMilestone}
                />
              </div>
              <div>
                <StreakHistory history={goal.streakHistory} className="mb-4" />
                <div className="flex flex-col gap-1 text-[10px] font-mono text-muted">
                  <span>Start: {goal.startDate}</span>
                  <span>Deadline: {goal.endDate || goal.deadline}</span>
                  {goal.completedAt && (
                    <span>
                      Finished:{' '}
                      {new Date(goal.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};
