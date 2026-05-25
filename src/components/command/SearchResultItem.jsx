import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const SearchResultItem = ({
  item,
  selected,
  index,
  onSelect,
  onHover,
}) => {
  const Icon = item.icon;

  return (
    <motion.button
      type="button"
      data-selected={selected ? 'true' : 'false'}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.12) }}
      onClick={() => onSelect(index)}
      onMouseEnter={() => onHover(index)}
      className={`
        w-full flex items-center justify-between gap-3 px-3 py-3 sm:py-2.5 rounded-xl text-left transition-all touch-manipulation active:scale-[0.99]
        ${selected
          ? 'bg-elevated border border-border-strong shadow-glass-glow'
          : 'border border-transparent hover:bg-surface hover:border-border'
        }
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
            selected ? 'bg-foreground text-background border-border-strong' : 'bg-elevated border-border'
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <span className="text-xs text-foreground font-sans block truncate">{item.title}</span>
          {item.meta && (
            <span className="text-[9px] font-mono text-muted mt-0.5 block truncate">{item.meta}</span>
          )}
        </div>
      </div>
      <ArrowRight
        className={`w-3.5 h-3.5 shrink-0 transition-all ${
          selected ? 'text-foreground translate-x-0.5' : 'text-subtle'
        }`}
      />
    </motion.button>
  );
};
