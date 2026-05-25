import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const FocusAmbientBackground = ({ intense = false }) => {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] rounded-full blur-[60px] opacity-30"
          style={{ background: 'var(--orb-1)' }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      <motion.div
        animate={{
          opacity: intense ? [0.35, 0.55, 0.35] : [0.18, 0.28, 0.18],
          scale: [1, 1.04, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] rounded-full blur-[72px]"
        style={{ background: 'var(--orb-1)' }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background:
            'conic-gradient(from 0deg, transparent, var(--fg), transparent, var(--fg), transparent)',
        }}
      />
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-6 bg-foreground/8"
          style={{
            left: `${20 + i * 18}%`,
            top: '22%',
          }}
          animate={{
            y: [0, 28, 0],
            opacity: [0.08, 0.22, 0.08],
          }}
          transition={{
            duration: 5 + i * 0.6,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
