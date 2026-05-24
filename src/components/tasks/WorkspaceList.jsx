import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import { useTasks } from '../../context/TasksContext';
import { WorkspaceSection } from './WorkspaceSection';
import { TaskItem } from './TaskItem';
import { ConfirmModal } from '../../ui/ConfirmModal';

const filterTask = (task, filter) => {
  if (filter === 'pending') return !task.completed;
  if (filter === 'completed') return task.completed;
  if (filter === 'high') return task.priority === 'high' && !task.completed;
  return true;
};

export const WorkspaceList = ({ searchQuery, filter }) => {
  const {
    workspaces,
    reorderWorkspaces,
    reorderTasks,
    toggleWorkspaceCollapse,
    updateWorkspace,
    deleteWorkspace,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [activeId, setActiveId] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredWorkspaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return workspaces
      .map((ws) => {
        const nameMatch = !q || ws.name.toLowerCase().includes(q);
        let tasks = ws.tasks.filter((t) => filterTask(t, filter));

        if (q) {
          if (nameMatch) {
            tasks = ws.tasks.filter((t) => filterTask(t, filter));
          } else {
            tasks = tasks.filter((t) => t.title.toLowerCase().includes(q));
          }
        }

        if (!nameMatch && tasks.length === 0) return null;
        if (tasks.length === 0 && filter !== 'all') return null;

        return { ...ws, collapsed: q ? false : ws.collapsed, tasks };
      })
      .filter(Boolean);
  }, [workspaces, searchQuery, filter]);

  const activeTask = useMemo(() => {
    if (activeType !== 'task' || !activeId) return null;
    for (const ws of workspaces) {
      const t = ws.tasks.find((task) => task.id === activeId);
      if (t) return { task: t, workspaceId: ws.id };
    }
    return null;
  }, [activeId, activeType, workspaces]);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.active.id);
    setActiveType(active.data.current?.type ?? 'workspace');
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === 'workspace') {
      reorderWorkspaces(active.id, over.id);
    } else if (activeData?.type === 'task' && activeData.workspaceId === overData?.workspaceId) {
      reorderTasks(activeData.workspaceId, active.id, over.id);
    }
  };

  const requestDeleteTask = (workspaceId, taskId, title) => {
    setDeleteTarget({
      type: 'task',
      workspaceId,
      taskId,
      title,
      message: `Delete "${title}"? This task will be permanently removed.`,
    });
  };

  const requestDeleteWorkspace = (workspaceId, name) => {
    setDeleteTarget({
      type: 'workspace',
      workspaceId,
      title: name,
      message: `Delete workspace "${name}" and all its tasks? This cannot be undone.`,
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'task') {
      deleteTask(deleteTarget.workspaceId, deleteTarget.taskId);
    } else {
      deleteWorkspace(deleteTarget.workspaceId);
    }
    setDeleteTarget(null);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredWorkspaces.map((ws) => ws.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {filteredWorkspaces.map((ws) => (
                <WorkspaceSection
                  key={ws.id}
                  workspace={ws}
                  filteredTasks={ws.tasks}
                  onToggleCollapse={toggleWorkspaceCollapse}
                  onRename={updateWorkspace}
                  onDeleteWorkspace={requestDeleteWorkspace}
                  onAddTask={addTask}
                  onToggleTask={toggleTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={requestDeleteTask}
                  activeDragId={activeId}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
          {activeTask ? (
            <div className="opacity-90 shadow-glass-glow rounded-xl">
              <TaskItem
                task={activeTask.task}
                workspaceId={activeTask.workspaceId}
                onToggle={() => {}}
                onUpdate={() => {}}
                onDelete={() => {}}
                isDragging
              />
            </div>
          ) : activeId && activeType === 'workspace' ? (
            <div className="liquid-glass rounded-2xl px-4 py-3 border border-border-strong shadow-glass-glow opacity-90">
              <span className="text-xs text-foreground font-sans">
                {workspaces.find((w) => w.id === activeId)?.name}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={deleteTarget?.type === 'workspace' ? 'Delete Workspace' : 'Delete Task'}
        message={deleteTarget?.message}
      />
    </>
  );
};
