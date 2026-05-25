import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { buttonHover, buttonTap } from '../../animations/microinteractions';

export const MotionButton = ({
  children,
  className = '',
  variant = 'primary',
  as: Tag = 'button',
  ...props
}) => {
  const reduced = useReducedMotion();
  const MotionTag = motion[Tag] || motion.button;

  const base =
    variant === 'primary'
      ? 'bg-foreground text-background'
      : variant === 'ghost'
        ? 'border border-border bg-surface text-foreground'
        : 'border border-border bg-elevated text-foreground';

  const interaction = reduced
    ? {}
    : {
        whileHover: buttonHover,
        whileTap: buttonTap,
      };

  return (
    <MotionTag
      type={Tag === 'button' ? 'button' : undefined}
      className={`touch-manipulation rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${base} ${className}`}
      {...interaction}
      {...props}
    >
      {children}
    </MotionTag>
  );
};
