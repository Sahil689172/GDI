import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, Flag } from 'lucide-react';
import { TaskCheckbox } from './TaskCheckbox';

export const TaskItem = ({
  task,
  workspaceId,
  onToggle,
  onUpdate,
  onDelete,
  isDragging,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id, data: { type: 'task', workspaceId } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragging = isDragging || isSortableDragging;

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdate(workspaceId, task.id, { title: trimmed });
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`
        group flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200
        ${dragging
          ? 'opacity-60 scale-[1.02] shadow-glass-glow border-border-strong bg-elevated z-50'
          : task.completed
            ? 'bg-surface border-border'
            : 'bg-surface border-border hover:border-border hover:shadow-glass-glow'
        }
      `}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-0.5 text-subtle hover:text-muted cursor-grab active:cursor-grabbing touch-none opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        aria-label="Drag task"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>

      <TaskCheckbox
        checked={task.completed}
        onChange={() => onToggle(workspaceId, task.id)}
      />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveEdit();
              if (e.key === 'Escape') {
                setEditTitle(task.title);
                setIsEditing(false);
              }
            }}
            className="w-full bg-surface border border-border-strong rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none font-sans"
          />
        ) : (
          <motion.span
            className={`text-xs font-medium font-sans block truncate ${
              task.completed ? 'text-subtle line-through' : 'text-foreground'
            }`}
            animate={{ opacity: task.completed ? 0.55 : 1 }}
          >
            {task.title}
          </motion.span>
        )}
      </div>

      {task.priority === 'high' && !task.completed && (
        <span className="shrink-0 flex items-center gap-0.5 text-[8px] font-mono uppercase tracking-wider text-foreground border border-white/20 bg-white/5 px-1.5 py-0.5 rounded-full">
          <Flag className="w-2.5 h-2.5" />
        </span>
      )}

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => {
            setEditTitle(task.title);
            setIsEditing(true);
          }}
          className="p-1.5 rounded-lg text-subtle hover:text-foreground hover:bg-elevated transition-colors"
          aria-label="Edit task"
        >
          <Pencil className="w-3 h-3" />
        </button>
        <button
          onClick={() => onDelete(workspaceId, task.id, task.title)}
          className="p-1.5 rounded-lg text-subtle hover:text-foreground hover:bg-elevated transition-colors"
          aria-label="Delete task"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};
