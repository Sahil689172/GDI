import React from 'react';
import { motion } from 'framer-motion';

export const ProgressRing = ({
  progress = 0,
  size = 120,
  strokeWidth = 6,
  label,
  sublabel,
  className = '',
  onClick,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      className={`flex flex-col items-center gap-2 group ${onClick ? 'cursor-pointer' : 'cursor-default'} ${className}`}
      disabled={!onClick}
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
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="group-hover:opacity-90"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={progress}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
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
    </motion.button>
  );
};
