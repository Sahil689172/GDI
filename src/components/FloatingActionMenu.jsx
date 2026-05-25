import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { useApp } from '../context/AppContext';
import {
  Plus,
  CheckSquare,
  Target,
  Calendar,
  Flame,
  FileText,
  X,
  ChevronRight,
  Send,
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useIsMobileLayout } from '../hooks/useMediaQuery';

const ACTION_ITEMS = [
  { id: 'task', label: 'Add Task', icon: CheckSquare, desc: 'New action item' },
  { id: 'goal', label: 'Add Goal', icon: Target, desc: 'Set objective' },
  { id: 'event', label: 'Add Event', icon: Calendar, desc: 'Schedule block' },
  { id: 'focus', label: 'Start Focus', icon: Flame, desc: 'Begin session' },
  { id: 'note', label: 'Quick Note', icon: FileText, desc: 'Capture thought' },
];

const HIDE_ON_PATHS = ['/calendar', '/focus'];

export const FloatingActionMenu = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobileLayout();
  const { addTask, addGoal, addNote, notes, deleteNote } = useDashboard();
  const { quickAction, clearQuickAction } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('30 Days');
  const [noteText, setNoteText] = useState('');
  const [noteToDelete, setNoteToDelete] = useState(null);

  useEffect(() => {
    if (!quickAction?.type) return;
    const { type } = quickAction;
    if (type === 'event') {
      navigate('/calendar');
      clearQuickAction();
      return;
    }
    if (type === 'focus') {
      navigate('/focus');
      clearQuickAction();
      return;
    }
    if (type === 'task' || type === 'goal' || type === 'note') {
      setActiveModal(type);
      setIsOpen(false);
      clearQuickAction();
    }
  }, [quickAction, navigate, clearQuickAction]);

  if (HIDE_ON_PATHS.includes(pathname)) return null;
  if (isMobile && pathname === '/') return null;

  const toggleMenu = () => setIsOpen((o) => !o);

  const handleAction = (id) => {
    if (id === 'event') {
      navigate('/calendar');
      setIsOpen(false);
      return;
    }
    if (id === 'focus') {
      navigate('/focus');
      setIsOpen(false);
      return;
    }
    setActiveModal(id);
    setIsOpen(false);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask(taskTitle, taskPriority);
    setTaskTitle('');
    setActiveModal(null);
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    addGoal(goalTitle, goalTarget);
    setGoalTitle('');
    setActiveModal(null);
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNote(noteText);
    setNoteText('');
  };

  const menuVariants = {
    closed: { scale: 0, opacity: 0, y: 20 },
    open: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 420,
        damping: 28,
        staggerChildren: 0.06,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    closed: { scale: 0.8, opacity: 0, y: 12 },
    open: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 450, damping: 22 } },
  };

  return (
    <>
      <div
        className="fixed right-4 md:right-6 z-[35] md:z-40 flex flex-col items-end gap-2 select-none touch-manipulation md:bottom-8"
        style={{
          bottom: 'max(calc(var(--mobile-nav-total) + 0.75rem), 5.5rem)',
        }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex flex-col items-end gap-2 mb-1"
            >
              {ACTION_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    variants={itemVariants}
                    onClick={() => handleAction(item.id)}
                    whileHover={{ scale: 1.03, x: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 liquid-glass rounded-xl px-3.5 py-2.5 border border-border shadow-glass hover:border-border-strong transition-all text-left"
                  >
                    <div className="flex flex-col items-end text-right">
                      <span className="text-xs font-semibold text-foreground font-sans">
                        {item.label}
                      </span>
                      <span className="text-[9px] font-mono text-muted">{item.desc}</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center">
                      <Icon className="w-4 h-4 text-foreground" />
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={toggleMenu}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-glass-glow border border-border-strong outline-none"
          aria-label={isOpen ? 'Close menu' : 'Quick actions'}
          aria-expanded={isOpen}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-overlay backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.94, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 12, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-md relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard glow className="border-border-strong shadow-glass-glow !p-0">
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <h2 className="text-sm font-semibold tracking-wider uppercase text-foreground font-sans">
                    {activeModal === 'task' && 'New Task'}
                    {activeModal === 'goal' && 'New Goal'}
                    {activeModal === 'note' && 'Quick Note'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="p-1.5 rounded-lg text-subtle hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {activeModal === 'task' && (
                  <form onSubmit={handleTaskSubmit} className="p-5 space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase tracking-wider mb-1.5">
                        Title
                      </label>
                      <input
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        className="w-full input-field text-sm"
                        placeholder="What needs doing?"
                        autoFocus
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase tracking-wider mb-1.5">
                        Priority
                      </label>
                      <select
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value)}
                        className="w-full input-field text-xs"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-foreground text-background text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      Add Task
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {activeModal === 'goal' && (
                  <form onSubmit={handleGoalSubmit} className="p-5 space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase tracking-wider mb-1.5">
                        Goal
                      </label>
                      <input
                        value={goalTitle}
                        onChange={(e) => setGoalTitle(e.target.value)}
                        className="w-full input-field text-sm"
                        placeholder="What are you building?"
                        autoFocus
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase tracking-wider mb-1.5">
                        Target
                      </label>
                      <input
                        value={goalTarget}
                        onChange={(e) => setGoalTarget(e.target.value)}
                        className="w-full input-field text-xs"
                        placeholder="30 Days"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-foreground text-background text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      Add Goal
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {activeModal === 'note' && (
                  <div className="p-5 space-y-4">
                    <form onSubmit={handleNoteSubmit} className="flex gap-2">
                      <input
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="flex-1 input-field text-xs"
                        placeholder="Type a note..."
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                    <div className="max-h-48 overflow-y-auto space-y-2 no-scrollbar">
                      {notes.length === 0 ? (
                        <p className="text-[10px] text-muted text-center py-6 font-sans">
                          No notes yet
                        </p>
                      ) : (
                        notes.map((note) => (
                          <div
                            key={note.id}
                            className="p-3 rounded-xl border border-border bg-surface flex justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <p className="text-[11px] text-foreground font-sans break-words">
                                {note.text}
                              </p>
                              <span className="text-[8px] font-mono text-muted">{note.time}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setNoteToDelete(note)}
                              className="text-[9px] font-mono text-muted hover:text-foreground shrink-0"
                            >
                              Clear
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        onConfirm={() => {
          if (noteToDelete) deleteNote(noteToDelete.id);
          setNoteToDelete(null);
        }}
        title="Delete Note"
        message="Remove this note?"
      />
    </>
  );
};
