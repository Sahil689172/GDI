import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FOCUS_MODES } from './focusConstants';

export const FocusModeSelector = ({ mode, onSelect, customMinutes, onCustomChange, disabled }) => {
  const [editingCustom, setEditingCustom] = useState(false);

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Object.values(FOCUS_MODES).map((m) => (
        <button
          key={m.id}
          type="button"
          disabled={disabled}
          onClick={() => {
            onSelect(m.id);
            if (m.id === 'custom') setEditingCustom(true);
          }}
          className={`relative px-4 py-2.5 rounded-xl border text-left transition-all disabled:opacity-50 ${
            mode === m.id
              ? 'border-border-strong bg-elevated shadow-glass-glow'
              : 'border-border bg-surface hover:border-border-strong'
          }`}
        >
          {mode === m.id && (
            <motion.div
              layoutId="focus-mode"
              className="absolute inset-0 rounded-xl border border-border-strong"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative block text-[10px] font-mono uppercase tracking-wider text-foreground">
            {m.label}
          </span>
          <span className="relative block text-[9px] font-mono text-muted mt-0.5">
            {m.id === 'custom' && mode === 'custom'
              ? `${customMinutes} min`
              : m.sublabel}
          </span>
        </button>
      ))}

      {mode === 'custom' && editingCustom && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="w-full flex items-center justify-center gap-2 mt-1"
        >
          <input
            type="number"
            min={1}
            max={180}
            value={customMinutes}
            onChange={(e) => onCustomChange(Number(e.target.value))}
            className="w-20 px-3 py-2 rounded-xl input-field text-xs font-mono text-center"
          />
          <span className="text-[10px] font-mono text-muted">minutes</span>
          <button
            type="button"
            onClick={() => setEditingCustom(false)}
            className="text-[10px] font-mono text-muted hover:text-foreground uppercase"
          >
            Done
          </button>
        </motion.div>
      )}
    </div>
  );
};
