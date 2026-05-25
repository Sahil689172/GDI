import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { DURATION, EASE } from '../animations/motion';
import { staggerItem } from '../animations/microinteractions';

const fadeUp = (reduced, delay = 0) =>
  reduced
    ? { initial: false, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: DURATION.normal, ease: EASE.out, delay },
      };

export const PageHeader = ({ title, subtitle, badge }) => {
  const reduced = useReducedMotion();
  const titleMotion = fadeUp(reduced, 0.04);
  const subMotion = fadeUp(reduced, 0.1);
  const badgeMotion = reduced
    ? { initial: false, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 0.94 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: DURATION.fast, ease: EASE.out, delay: 0.14 },
      };

  return (
    <motion.header
      variants={staggerItem}
      initial="initial"
      animate="animate"
      className="mb-4 sm:mb-6 md:mb-8 min-w-0"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <motion.h1
            {...titleMotion}
            className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground font-sans text-glow break-words"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              {...subMotion}
              className="text-[11px] sm:text-xs text-muted mt-1 sm:mt-1.5 font-sans max-w-xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        {badge && (
          <motion.span
            {...badgeMotion}
            className="self-start sm:self-auto shrink-0 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-muted bg-elevated border border-border px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full"
          >
            {badge}
          </motion.span>
        )}
      </div>
    </motion.header>
  );
};
