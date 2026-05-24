import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const TaskCheckbox = ({ checked, onChange, disabled }) => {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      whileTap={{ scale: 0.88 }}
      className={`
        relative w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-colors duration-200
        ${checked
          ? 'bg-elevated border-border-strong shadow-glass-glow'
          : 'bg-surface border-border hover:border-border-strong hover:shadow-glass-glow'
        }
      `}
    >
      <motion.div
        initial={false}
        animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        <Check className="w-3 h-3 text-foreground" strokeWidth={3} />
      </motion.div>
    </motion.button>
  );
};
