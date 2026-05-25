import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

export const SettingsSection = ({
  title,
  description,
  icon: Icon,
  children,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <GlassCard className="!p-0 overflow-hidden" hover={false}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface/50 transition-colors"
      >
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-elevated border border-border flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold text-foreground font-sans">{title}</h3>
          {description && (
            <p className="text-[10px] text-muted font-sans mt-0.5 truncate">{description}</p>
          )}
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-4 h-4 text-muted shrink-0" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-border space-y-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};
