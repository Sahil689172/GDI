import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { 
  Plus, 
  CheckSquare, 
  Target, 
  FileText, 
  X, 
  ChevronRight, 
  Send 
} from 'lucide-react';
import { GlassCard } from './GlassCard';

export const FloatingActionMenu = () => {
  const { addTask, addGoal, addNote, notes, deleteNote } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'task', 'goal', 'note', or null

  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskDeadline, setTaskDeadline] = useState('Today, 6:00 PM');
  
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('100%');
  
  const [noteText, setNoteText] = useState('');

  // Expand menu toggle
  const toggleMenu = () => setIsOpen(!isOpen);

  // Form submissions
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask(taskTitle, taskPriority, taskDeadline);
    setTaskTitle('');
    setActiveModal(null);
    setIsOpen(false);
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    addGoal(goalTitle, goalTarget);
    setGoalTitle('');
    setActiveModal(null);
    setIsOpen(false);
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNote(noteText);
    setNoteText('');
  };

  // Stagger configurations
  const menuVariants = {
    closed: { scale: 0, opacity: 0, y: 30 },
    open: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25, 
        staggerChildren: 0.08, 
        delayChildren: 0.05 
      } 
    }
  };

  const itemVariants = {
    closed: { scale: 0.7, opacity: 0, y: 15 },
    open: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 450, damping: 20 } }
  };

  const actionItems = [
    { id: 'task', label: 'Add Task', icon: CheckSquare, desc: 'Create a new action item' },
    { id: 'goal', label: 'Add Goal', icon: Target, desc: 'Set a new benchmark' },
    { id: 'note', label: 'Quick Note', icon: FileText, desc: 'Capture rapid thoughts' },
  ];

  return (
    <>
      {/* Floating Action Button (FAB) and Menu Container */}
      <div className="fixed bottom-20 md:bottom-8 right-6 z-40 flex flex-col items-end gap-3 select-none">
        
        {/* Expanded Sub-menu Actions */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex flex-col items-end gap-2.5 mb-1"
            >
              {actionItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    variants={itemVariants}
                    onClick={() => {
                      setActiveModal(item.id);
                      setIsOpen(false);
                    }}
                    whileHover={{ scale: 1.05, x: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 bg-black/85 backdrop-blur-md border border-blue-900/40 rounded-xl px-4 py-2.5 shadow-glass-glow hover:border-blue-500/30 transition-all text-left"
                  >
                    <div className="flex flex-col items-end text-right">
                      <span className="text-xs font-semibold text-white font-sans">{item.label}</span>
                      <span className="text-[9px] font-mono text-blue-500/70">{item.desc}</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-blue-950/50 border border-blue-900/30 flex items-center justify-center text-blue-400 group-hover:text-white">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Action Toggle FAB */}
        <motion.button
          onClick={toggleMenu}
          whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)" }}
          whileTap={{ scale: 0.93 }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-950 via-blue-900 to-white/10 border border-blue-900/50 flex items-center justify-center text-white shadow-blue-glow outline-none cursor-pointer"
        >
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <Plus className="w-6 h-6 text-white" strokeWidth="2.5" />
          </motion.div>
        </motion.button>
      </div>

      {/* Action Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center p-4">
            
            {/* Modal Glass Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Panel Container */}
            <motion.div
              initial={{ scale: 0.9, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 15, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="w-full max-w-md relative z-10"
            >
              <GlassCard glow={true} className="border-blue-500/20 shadow-blue-glow !p-0">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-blue-950/40">
                  <div className="flex items-center gap-2">
                    {activeModal === 'task' && <CheckSquare className="w-4 h-4 text-blue-400" />}
                    {activeModal === 'goal' && <Target className="w-4 h-4 text-blue-400" />}
                    {activeModal === 'note' && <FileText className="w-4 h-4 text-blue-400" />}
                    <h2 className="text-sm font-semibold tracking-wider uppercase text-white font-sans">
                      {activeModal === 'task' && 'New Priority Task'}
                      {activeModal === 'goal' && 'Define Focus Goal'}
                      {activeModal === 'note' && 'Scratch Workspace'}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="p-1 rounded-lg bg-blue-950/40 border border-blue-900/20 text-blue-200/50 hover:text-white hover:border-blue-900/50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form fields depending on active modal */}
                {activeModal === 'task' && (
                  <form onSubmit={handleTaskSubmit} className="p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-blue-500 uppercase tracking-widest">
                        Task Heading
                      </label>
                      <input
                        type="text"
                        required
                        value={taskTitle}
                        onChange={(e) => setTaskTaskTitle(e.target.value)}
                        placeholder="e.g. Design Linear Glass Effects"
                        className="bg-black/60 border border-blue-900/35 rounded-xl px-4 py-2.5 text-xs text-white placeholder-blue-900/50 focus:outline-none focus:border-blue-500/40 transition-colors font-sans w-full"
                        autoFocus
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-blue-500 uppercase tracking-widest">
                          Priority Matrix
                        </label>
                        <select
                          value={taskPriority}
                          onChange={(e) => setTaskPriority(e.target.value)}
                          className="bg-black/60 border border-blue-900/35 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40 transition-colors font-sans w-full"
                        >
                          <option value="High" className="bg-black text-white">High</option>
                          <option value="Medium" className="bg-black text-white">Medium</option>
                          <option value="Low" className="bg-black text-white">Low</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-blue-500 uppercase tracking-widest">
                          Deadline Limit
                        </label>
                        <input
                          type="text"
                          required
                          value={taskDeadline}
                          onChange={(e) => setTaskDeadline(e.target.value)}
                          placeholder="e.g. Today, 5:00 PM"
                          className="bg-black/60 border border-blue-900/35 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40 transition-colors font-sans w-full"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-2 w-full py-3 bg-gradient-to-tr from-blue-950 via-blue-900 to-white/10 hover:shadow-blue-glow hover:border-blue-500/40 transition-all border border-blue-900/30 rounded-xl text-xs font-semibold tracking-wider uppercase text-white flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Commit Task
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                    </button>
                  </form>
                )}

                {activeModal === 'goal' && (
                  <form onSubmit={handleGoalSubmit} className="p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-blue-500 uppercase tracking-widest">
                        Goal Objective
                      </label>
                      <input
                        type="text"
                        required
                        value={goalTitle}
                        onChange={(e) => setGoalTitle(e.target.value)}
                        placeholder="e.g. Master Framer Motion Physics"
                        className="bg-black/60 border border-blue-900/35 rounded-xl px-4 py-2.5 text-xs text-white placeholder-blue-900/50 focus:outline-none focus:border-blue-500/40 transition-colors font-sans w-full"
                        autoFocus
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-blue-500 uppercase tracking-widest">
                        Target Boundary
                      </label>
                      <input
                        type="text"
                        required
                        value={goalTarget}
                        onChange={(e) => setGoalTarget(e.target.value)}
                        placeholder="e.g. 30 Days or 100%"
                        className="bg-black/60 border border-blue-900/35 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40 transition-colors font-sans w-full"
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-2 w-full py-3 bg-gradient-to-tr from-blue-950 via-blue-900 to-white/10 hover:shadow-blue-glow hover:border-blue-500/40 transition-all border border-blue-900/30 rounded-xl text-xs font-semibold tracking-wider uppercase text-white flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Launch Goal
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                    </button>
                  </form>
                )}

                {activeModal === 'note' && (
                  <div className="p-5 flex flex-col gap-4">
                    {/* Add note input form */}
                    <form onSubmit={handleNoteSubmit} className="flex gap-2.5">
                      <input
                        type="text"
                        required
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Type quick thought and press send..."
                        className="bg-black/60 border border-blue-900/35 rounded-xl px-4 py-2.5 text-xs text-white placeholder-blue-900/50 focus:outline-none focus:border-blue-500/40 transition-colors font-sans flex-1"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-900/30 text-blue-400 hover:text-white hover:border-blue-500/40 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>

                    {/* Quick note scrollable area */}
                    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                      <label className="text-[10px] font-mono text-blue-500 uppercase tracking-widest mb-1 block">
                        Saved Notes
                      </label>
                      {notes.length === 0 ? (
                        <p className="text-[10px] text-blue-200/20 text-center font-mono py-4 border border-dashed border-blue-950/40 rounded-xl">
                          No notes pinned. Add one above!
                        </p>
                      ) : (
                        notes.map(note => (
                          <div 
                            key={note.id} 
                            className="bg-blue-950/20 border border-blue-900/10 hover:border-blue-900/30 rounded-xl p-3 flex justify-between items-start group/note transition-all"
                          >
                            <div className="flex flex-col gap-1 pr-4">
                              <p className="text-[11px] text-white font-sans leading-relaxed break-all">
                                {note.text}
                              </p>
                              <span className="text-[8px] font-mono text-blue-500/60">
                                {note.time}
                              </span>
                            </div>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="text-[9px] font-mono text-blue-500/30 hover:text-white transition-colors p-1"
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
    </>
  );
};

// Internal input handling helper to avoid react scope naming traps
const setTaskTaskTitle = (val) => {
  // Simple module helper
  const inputEl = document.querySelector('input[placeholder="e.g. Design Linear Glass Effects"]');
  if (inputEl) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(inputEl, val);
    const ev = new Event('input', { bubbles: true });
    inputEl.dispatchEvent(ev);
  }
};
