import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoals } from '../context/GoalsContext';
import { PageHeader } from '../ui/PageHeader';
import { ConfirmModal } from '../ui/ConfirmModal';
import { GoalsOverview } from '../components/goals/GoalsOverview';
import { GoalsToolbar } from '../components/goals/GoalsToolbar';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalAnalytics } from '../components/goals/GoalAnalytics';
import { GoalsEmptyState } from '../components/goals/GoalsEmptyState';
import { CreateGoalModal } from '../components/goals/CreateGoalModal';
import { staggerContainer, staggerItem } from '../animations/pageTransitions';

const filterGoals = (goals, filter, query, sort) => {
  let result = [...goals];
  const q = query.trim().toLowerCase();

  if (filter === 'active') result = result.filter((g) => !g.isCompleted);
  if (filter === 'completed') result = result.filter((g) => g.isCompleted);
  if (q) {
    result = result.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
    );
  }

  switch (sort) {
    case 'progress-asc':
      result.sort((a, b) => a.progress - b.progress);
      break;
    case 'streak-desc':
      result.sort((a, b) => b.streak - a.streak);
      break;
    case 'title':
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      result.sort((a, b) => b.progress - a.progress);
  }

  return result;
};

export const GoalsPage = () => {
  const {
    goals,
    stats,
    weeklyTrend,
    createGoal,
    updateGoal,
    deleteGoal,
    logProgressDay,
    toggleMilestone,
    loading,
    error,
  } = useGoals();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('progress-desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredGoals = useMemo(
    () => filterGoals(goals, filter, searchQuery, sort),
    [goals, filter, searchQuery, sort]
  );

  const topGoals = useMemo(
    () => [...goals].sort((a, b) => b.progress - a.progress).slice(0, 4),
    [goals]
  );

  const handleSave = (data) => {
    if (editGoal) {
      updateGoal(editGoal.id, {
        title: data.title,
        description: data.description,
        targetDays: data.targetDays,
        startDate: data.startDate,
        milestones: data.milestones
          .filter((m) => m.title?.trim())
          .map((m, i) => ({
            id: editGoal.milestones[i]?.id || `m-${Date.now()}-${i}`,
            title: m.title.trim(),
            completed: editGoal.milestones[i]?.completed ?? false,
            targetDay: m.targetDay ? Number(m.targetDay) : undefined,
          })),
      });
      setEditGoal(null);
    } else {
      createGoal(data);
    }
  };

  const hasGoals = goals.length > 0;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <PageHeader
        title="Flow Objectives"
        subtitle="Long-term growth dashboard. Track rings, streaks, milestones, and momentum."
        badge={`${stats.active} active`}
      />

      {error && (
        <p className="mb-4 text-xs text-red-400/90 font-sans" role="alert">
          {error}
        </p>
      )}

      {loading && !hasGoals ? (
        <p className="text-xs text-muted font-mono uppercase tracking-wider py-12 text-center">
          Loading goals…
        </p>
      ) : !hasGoals ? (
        <GoalsEmptyState onCreateGoal={() => setModalOpen(true)} />
      ) : (
        <>
          <GoalsOverview stats={stats} topGoals={topGoals} />

          <GoalsToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filter={filter}
            onFilterChange={setFilter}
            sort={sort}
            onSortChange={setSort}
            onCreateGoal={() => {
              setEditGoal(null);
              setModalOpen(true);
            }}
          />

          <div className="mb-6">
            <GoalAnalytics weeklyTrend={weeklyTrend} goals={goals} />
          </div>

          <AnimatePresence mode="popLayout">
            {filteredGoals.length === 0 ? (
              <motion.p
                key="empty-filter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-subtle text-center font-mono py-12 border border-dashed border-border rounded-2xl"
              >
                No goals match your search or filter.
              </motion.p>
            ) : (
              <motion.div
                key="grid"
                className="grid grid-cols-1 xl:grid-cols-2 gap-5"
                layout
              >
                {filteredGoals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    layout
                    variants={staggerItem}
                    initial="initial"
                    animate="animate"
                    exit={{ opacity: 0, scale: 0.96 }}
                  >
                    <GoalCard
                      goal={goal}
                      onLogDay={logProgressDay}
                      onToggleMilestone={toggleMilestone}
                      onEdit={(g) => {
                        setEditGoal(g);
                        setModalOpen(true);
                      }}
                      onDelete={(g) => setDeleteTarget(g)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <CreateGoalModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditGoal(null);
        }}
        onSave={handleSave}
        editGoal={editGoal}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteGoal(deleteTarget.id)}
        title="Delete Goal"
        message={
          deleteTarget
            ? `Remove "${deleteTarget.title}" and all its progress? This cannot be undone.`
            : ''
        }
      />
    </motion.div>
  );
};
