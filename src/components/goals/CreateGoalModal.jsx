import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, X, Plus, Trash2 } from 'lucide-react';

const emptyMilestone = () => ({ title: '', targetDay: '' });

export const CreateGoalModal = ({ open, onClose, onSave, editGoal = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDays, setTargetDays] = useState(30);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [milestones, setMilestones] = useState([emptyMilestone()]);

  useEffect(() => {
    if (open && editGoal) {
      setTitle(editGoal.title);
      setDescription(editGoal.description || '');
      setTargetDays(editGoal.targetDays);
      setStartDate(editGoal.startDate);
      setMilestones(
        editGoal.milestones.length
          ? editGoal.milestones.map((m) => ({
              title: m.title,
              targetDay: m.targetDay ?? '',
            }))
          : [emptyMilestone()]
      );
    } else if (open) {
      setTitle('');
      setDescription('');
      setTargetDays(30);
      setStartDate(new Date().toISOString().split('T')[0]);
      setMilestones([emptyMilestone()]);
    }
  }, [open, editGoal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title,
      description,
      targetDays,
      startDate,
      milestones,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-overlay backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="relative w-full max-w-lg liquid-glass rounded-2xl border border-border shadow-glass-glow max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between p-5 border-b border-border bg-background/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center">
                  <Target className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground font-sans">
                    {editGoal ? 'Edit Goal' : 'New Goal'}
                  </h3>
                  <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
                    Long-term objective
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-elevated transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5 block">
                  Goal Name
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Learn Machine Learning"
                  className="w-full input-field rounded-xl px-4 py-2.5 text-sm font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5 block">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="What does success look like?"
                  className="w-full input-field rounded-xl px-4 py-2.5 text-xs font-sans resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5 block">
                    Target Days
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={targetDays}
                    onChange={(e) => setTargetDays(Number(e.target.value))}
                    className="w-full input-field rounded-xl px-4 py-2.5 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-muted uppercase tracking-widest mb-1.5 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full input-field rounded-xl px-4 py-2.5 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-mono text-muted uppercase tracking-widest">
                    Milestones
                  </label>
                  <button
                    type="button"
                    onClick={() => setMilestones((m) => [...m, emptyMilestone()])}
                    className="flex items-center gap-1 text-[10px] font-mono text-muted hover:text-foreground"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={m.title}
                        onChange={(e) => {
                          const next = [...milestones];
                          next[i] = { ...next[i], title: e.target.value };
                          setMilestones(next);
                        }}
                        placeholder="Milestone title"
                        className="flex-1 input-field rounded-lg px-3 py-2 text-xs font-sans"
                      />
                      <input
                        type="number"
                        min={1}
                        value={m.targetDay}
                        onChange={(e) => {
                          const next = [...milestones];
                          next[i] = { ...next[i], targetDay: e.target.value };
                          setMilestones(next);
                        }}
                        placeholder="Day"
                        className="w-16 input-field rounded-lg px-2 py-2 text-xs font-mono text-center"
                      />
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setMilestones((ms) => ms.filter((_, j) => j !== i))}
                          className="p-2 text-subtle hover:text-foreground"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl btn-primary text-xs font-semibold uppercase tracking-wider mt-2"
              >
                {editGoal ? 'Save Changes' : 'Launch Goal'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
