import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TasksContext';
import { PageHeader } from '../ui/PageHeader';
import { TaskStatsBar } from '../components/tasks/TaskStatsBar';
import { TaskToolbar } from '../components/tasks/TaskToolbar';
import { WorkspaceList } from '../components/tasks/WorkspaceList';
import { TasksEmptyState } from '../components/tasks/TasksEmptyState';
import { CreateWorkspaceModal } from '../components/tasks/CreateWorkspaceModal';
import { staggerContainer } from '../animations/pageTransitions';

export const TasksPage = () => {
  const { workspaces, stats, createWorkspace } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const hasWorkspaces = workspaces.length > 0;

  const noResults = useMemo(() => {
    if (!hasWorkspaces) return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q && filter === 'all') return false;
    return workspaces.every((ws) => {
      const wsMatch = ws.name.toLowerCase().includes(q);
      const tasks = ws.tasks.filter((t) => {
        const match = !q || t.title.toLowerCase().includes(q);
        if (filter === 'pending') return match && !t.completed;
        if (filter === 'completed') return match && t.completed;
        if (filter === 'high') return match && t.priority === 'high' && !t.completed;
        return match;
      });
      return !wsMatch && tasks.length === 0;
    });
  }, [workspaces, searchQuery, filter, hasWorkspaces]);

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <PageHeader
        title="Focus Tasks Ledger"
        subtitle="Workspace-based task management. Organize, prioritize, and complete with precision."
        badge={`${stats.pending} pending`}
      />

      {hasWorkspaces && <TaskStatsBar stats={stats} />}

      {hasWorkspaces && (
        <TaskToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
          onCreateWorkspace={() => setShowCreateModal(true)}
        />
      )}

      {!hasWorkspaces ? (
        <TasksEmptyState onCreateWorkspace={() => setShowCreateModal(true)} />
      ) : (
        <>
          <AnimatePresence mode="wait">
            {noResults ? (
              <motion.p
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-subtle text-center font-mono py-12 border border-dashed border-border rounded-2xl"
              >
                No tasks match your search or filter.
              </motion.p>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <WorkspaceList searchQuery={searchQuery} filter={filter} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <CreateWorkspaceModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={createWorkspace}
      />
    </motion.div>
  );
};
