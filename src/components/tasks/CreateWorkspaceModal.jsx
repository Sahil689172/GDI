import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderPlus, X } from 'lucide-react';

export const CreateWorkspaceModal = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (open) setName('');
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim());
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
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-md liquid-glass rounded-2xl border border-border shadow-glass-glow p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg text-subtle hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center">
                <FolderPlus className="w-5 h-5 text-muted" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground font-sans">New Workspace</h3>
                <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
                  Category / Project
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Academic Goals"
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-subtle focus:outline-none focus:border-border-strong font-sans"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-elevated border border-border border border-border text-xs font-semibold uppercase tracking-wider text-foreground hover:shadow-glass-glow transition-all"
              >
                Create Workspace
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
