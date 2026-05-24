import React from 'react';
import { motion } from 'framer-motion';

export const SandglassLoader = ({ size = 'md' }) => {
  const dimensions = size === 'sm' ? 'w-12 h-12' : size === 'lg' ? 'w-20 h-20' : 'w-16 h-16';

  return (
    <div className={`relative ${dimensions} flex items-center justify-center`}>
      <motion.div
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-full h-full"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-subtle fill-none stroke-current"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M25,15 L75,15 C75,15 70,45 50,50 C30,45 25,15 25,15 Z"
            className="stroke-border fill-surface"
          />
          <path
            d="M25,85 L75,85 C75,85 70,55 50,50 C30,55 25,85 25,85 Z"
            className="stroke-border fill-surface"
          />
          <line x1="20" y1="15" x2="80" y2="15" className="stroke-foreground/80" />
          <line x1="20" y1="85" x2="80" y2="85" className="stroke-foreground/80" />
        </svg>
      </motion.div>

      <div className="absolute top-[38%] bottom-[22%] left-1/2 -translate-x-1/2 w-[1px] overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
          className="w-full h-6 bg-gradient-to-b from-white to-foreground/80"
        />
      </div>

      <div className="absolute -bottom-1 w-8 h-[2px] bg-foreground/30 rounded-full blur-[1px] animate-pulse" />
    </div>
  );
};
