import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

export const TaskInput = ({ onAdd, placeholder = 'Add a task...' }) => {
  const [value, setValue] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [priority, setPriority] = useState('normal');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value.trim(), priority);
    setValue('');
    setExpanded(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      layout
      className="mt-2"
    >
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.button
            key="collapsed"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-border text-subtle hover:text-muted hover:border-border-strong transition-all text-xs font-sans"
          >
            <Plus className="w-3.5 h-3.5" />
            {placeholder}
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2"
          >
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => {
                if (!value.trim()) setExpanded(false);
              }}
              placeholder={placeholder}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-subtle focus:outline-none focus:border-border-strong font-sans"
            />
            <div className="flex items-center gap-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="flex-1 bg-surface border border-border rounded-lg px-2 py-1.5 text-[10px] text-foreground font-mono uppercase focus:outline-none focus:border-border-strong"
              >
                <option value="normal" className="bg-surface">Normal</option>
                <option value="high" className="bg-surface">High Priority</option>
              </select>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-elevated border border-border border border-border text-[10px] font-semibold uppercase tracking-wider text-foreground hover:shadow-glass-glow transition-all"
              >
                Add
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
};
