import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({
  children,
  className = '',
  hover = true,
  glow = false,
  onClick,
  ...props
}) => {
  const canHover =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const hoverProps =
    hover && canHover && !onClick
      ? {
          whileHover: {
            y: -2,
            scale: 1.003,
            boxShadow: 'var(--shadow-glass)',
            borderColor: 'var(--border-strong)',
          },
        }
      : hover && canHover && onClick
        ? {
            whileHover: { scale: 1.01 },
            whileTap: { scale: 0.98 },
          }
        : onClick
          ? { whileTap: { scale: 0.98 } }
          : {};

  return (
    <motion.div
      onClick={onClick}
      {...hoverProps}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`
        liquid-glass
        rounded-xl sm:rounded-2xl
        p-4 sm:p-5 md:p-6
        transition-all
        duration-300
        min-w-0
        ${glow ? 'shadow-glass-glow border-border-strong' : 'border-border'}
        ${onClick ? 'cursor-pointer touch-manipulation' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-foreground/[0.04] pointer-events-none z-0" />
      <div className="relative z-10 w-full min-w-0">{children}</div>
    </motion.div>
  );
};
