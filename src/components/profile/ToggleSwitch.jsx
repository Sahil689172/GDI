import React from 'react';
import { motion } from 'framer-motion';

export const ToggleSwitch = ({ checked, onChange, disabled = false, id, label }) => {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative w-11 h-6 rounded-full border shrink-0 transition-colors duration-300
        ${checked ? 'bg-foreground border-border-strong' : 'bg-elevated border-border'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-border-strong'}
      `}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className={`
          absolute top-0.5 w-5 h-5 rounded-full shadow-glass-glow
          ${checked ? 'left-[22px] bg-background' : 'left-0.5 bg-foreground'}
        `}
      />
    </button>
  );
};
