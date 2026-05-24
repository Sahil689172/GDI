import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Pencil,
  Trash2,
  Folder,
} from 'lucide-react';
import { TaskItem } from './TaskItem';
import { TaskInput } from './TaskInput';

const WorkspaceHeader = ({
  workspace,
  taskCount,
  completedCount,
  onToggleCollapse,
  onRename,
  onDelete,
  dragHandleProps,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workspace.name);

  const saveName = () => {
    const trimmed = name.trim();
    if (trimmed) onRename(workspace.id, trimmed);
    else setName(workspace.name);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
      <button
        {...dragHandleProps}
        className="p-0.5 text-subtle hover:text-muted cursor-grab active:cursor-grabbing touch-none shrink-0"
        aria-label="Drag workspace"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <button
        onClick={() => onToggleCollapse(workspace.id)}
        className="p-1 rounded-lg hover:bg-elevated text-muted transition-colors shrink-0"
      >
        {workspace.collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      <Folder className="w-3.5 h-3.5 text-muted shrink-0" />

      {isEditing ? (
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveName}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveName();
            if (e.key === 'Escape') {
              setName(workspace.name);
              setIsEditing(false);
            }
          }}
          className="flex-1 bg-surface border border-border-strong rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none font-sans min-w-0"
        />
      ) : (
        <h3
          onDoubleClick={() => setIsEditing(true)}
          className="flex-1 text-xs font-semibold text-foreground font-sans tracking-wide truncate cursor-default"
        >
          {workspace.name}
        </h3>
      )}

      <span className="text-[9px] font-mono text-muted shrink-0">
        {completedCount}/{taskCount}
      </span>

      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover/ws:opacity-100 transition-opacity">
        <button
          onClick={() => {
            setName(workspace.name);
            setIsEditing(true);
          }}
          className="p-1.5 rounded-lg text-subtle hover:text-foreground hover:bg-elevated transition-colors"
        >
          <Pencil className="w-3 h-3" />
        </button>
        <button
          onClick={() => onDelete(workspace.id, workspace.name)}
          className="p-1.5 rounded-lg text-subtle hover:text-foreground hover:bg-elevated transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export const WorkspaceSection = ({
  workspace,
  filteredTasks,
  onToggleCollapse,
  onRename,
  onDeleteWorkspace,
  onAddTask,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  activeDragId,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: workspace.id, data: { type: 'workspace' } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const taskCount = workspace.tasks.length;
  const completedCount = workspace.tasks.filter((t) => t.completed).length;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        group/ws liquid-glass rounded-2xl overflow-hidden border transition-all duration-300
        ${isDragging ? 'opacity-70 shadow-glass-glow border-border-strong scale-[1.01]' : 'border-border'}
      `}
    >
      <WorkspaceHeader
        workspace={workspace}
        taskCount={taskCount}
        completedCount={completedCount}
        onToggleCollapse={onToggleCollapse}
        onRename={onRename}
        onDelete={onDeleteWorkspace}
        dragHandleProps={{ ...attributes, ...listeners }}
      />

      <AnimatePresence initial={false}>
        {!workspace.collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 flex flex-col gap-1.5">
              <SortableContext
                items={filteredTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      workspaceId={workspace.id}
                      onToggle={onToggleTask}
                      onUpdate={onUpdateTask}
                      onDelete={onDeleteTask}
                      isDragging={activeDragId === task.id}
                    />
                  ))}
                </AnimatePresence>
              </SortableContext>

              {filteredTasks.length === 0 && (
                <p className="text-[10px] text-subtle text-center font-mono py-3">
                  No tasks in this view
                </p>
              )}

              <TaskInput
                onAdd={(title, priority) => onAddTask(workspace.id, title, priority)}
                placeholder="Add a task..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
