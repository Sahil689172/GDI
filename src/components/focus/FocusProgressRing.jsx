import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE, DURATION } from '../../animations/motion';

export const FocusProgressRing = ({
  progress = 1,
  size = 280,
  strokeWidth = 3,
  children,
  active = false,
}) => {
  const reduced = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.svg
        width={size}
        height={size}
        className="-rotate-90"
        animate={
          reduced || !active
            ? {}
            : { scale: [1, 1.004, 1] }
        }
        transition={
          reduced
            ? {}
            : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={strokeWidth}
          opacity={0.35}
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
          animate={{ strokeDashoffset: offset }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: DURATION.normal, ease: EASE.out }
          }
          style={{
            filter: active && !reduced ? 'drop-shadow(0 0 8px var(--fg))' : undefined,
          }}
          opacity={active ? 1 : 0.55}
        />
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
};
