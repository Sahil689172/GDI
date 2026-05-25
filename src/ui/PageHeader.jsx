import React from 'react';
import { motion } from 'framer-motion';

export const PageHeader = ({ title, subtitle, badge }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-4 sm:mb-6 md:mb-8 min-w-0"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <motion.h1
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground font-sans text-glow break-words"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="text-[11px] sm:text-xs text-muted mt-1 sm:mt-1.5 font-sans max-w-xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        {badge && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="self-start sm:self-auto shrink-0 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-muted bg-elevated border border-border px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full"
          >
            {badge}
          </motion.span>
        )}
      </div>
    </motion.header>
  );
};
