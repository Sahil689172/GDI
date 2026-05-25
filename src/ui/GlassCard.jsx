import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { cardHoverLift, cardTap } from '../animations/microinteractions';
import { SPRING } from '../animations/motion';

export const GlassCard = memo(function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
  onClick,
  ...props
}) {
  const reduced = useReducedMotion();
  const canHover =
    !reduced &&
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const hoverProps =
    reduced
      ? onClick
        ? { whileTap: cardTap }
        : {}
      : hover && canHover && !onClick
        ? { whileHover: cardHoverLift }
        : hover && canHover && onClick
          ? { whileHover: { y: -2, transition: SPRING.soft }, whileTap: cardTap }
          : onClick
            ? { whileTap: cardTap }
            : {};

  return (
    <motion.div
      onClick={onClick}
      {...hoverProps}
      transition={SPRING.soft}
      className={`
        liquid-glass glass-interactive
        rounded-xl sm:rounded-2xl
        p-4 sm:p-5 md:p-6
        min-w-0
        ${glow ? 'shadow-glass-glow border-border-strong glass-glow-pulse' : 'border-border'}
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
});
