import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE, DURATION } from '../../animations/motion';
import { buttonTap } from '../../animations/microinteractions';

export const ProgressRing = ({
  progress = 0,
  size = 120,
  strokeWidth = 6,
  label,
  sublabel,
  className = '',
  onClick,
}) => {
  const reduced = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const Wrapper = onClick ? motion.button : motion.div;

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      whileTap={onClick && !reduced ? buttonTap : undefined}
      whileHover={onClick && !reduced ? { scale: 1.02 } : undefined}
      transition={{ duration: DURATION.fast, ease: EASE.out }}
      className={`flex flex-col items-center gap-2 group ${onClick ? 'cursor-pointer touch-manipulation' : 'cursor-default'} ${className}`}
      disabled={onClick ? false : undefined}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth={strokeWidth}
            opacity={0.5}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--fg)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={reduced ? false : { strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: DURATION.slow, ease: EASE.out }
            }
            className="group-hover:opacity-90"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={progress}
            initial={reduced ? false : { opacity: 0.6, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.fast, ease: EASE.out }}
            className="text-lg font-bold font-mono text-foreground text-glow"
          >
            {progress}%
          </motion.span>
          {sublabel && (
            <span className="text-[8px] font-mono text-muted uppercase tracking-wider mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className="text-[10px] font-sans font-medium text-foreground text-center max-w-[100px] truncate">
          {label}
        </span>
      )}
    </Wrapper>
  );
};
