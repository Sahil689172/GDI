import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
}) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-overlay backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative w-full max-w-sm liquid-glass rounded-2xl border border-border shadow-glass-glow p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg text-subtle hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-muted" />
              </div>
              <h3 className="text-sm font-semibold text-foreground font-sans">{title}</h3>
            </div>

            <p className="text-xs text-muted font-sans leading-relaxed mb-6">{message}</p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold uppercase tracking-wider text-muted hover:text-foreground hover:border-border-strong transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-white text-background text-xs font-semibold uppercase tracking-wider hover:bg-white/90 transition-all shadow-glass-glow"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
