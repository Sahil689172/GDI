import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { overlayVariants, modalVariants, buttonTap } from '../animations/microinteractions';

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
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-overlay backdrop-blur-md"
          />
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-sm liquid-glass glass-interactive rounded-2xl border border-border shadow-glass-glow p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              type="button"
              onClick={onClose}
              whileTap={buttonTap}
              className="absolute top-4 right-4 p-1 rounded-lg text-subtle hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-muted" />
              </div>
              <h3 className="text-sm font-semibold text-foreground font-sans">{title}</h3>
            </div>

            <p className="text-xs text-muted font-sans leading-relaxed mb-6">{message}</p>

            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={onClose}
                whileTap={buttonTap}
                className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold uppercase tracking-wider text-muted hover:text-foreground hover:border-border-strong transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                whileTap={buttonTap}
                className="flex-1 py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-glass-glow"
              >
                {confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
