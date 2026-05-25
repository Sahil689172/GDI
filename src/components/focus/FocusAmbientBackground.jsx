import React from 'react';
import { motion } from 'framer-motion';

export const FocusAmbientBackground = ({ intense = false }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      <motion.div
        animate={{
          opacity: intense ? [0.4, 0.7, 0.4] : [0.2, 0.35, 0.2],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[80px]"
        style={{ background: 'var(--orb-1)' }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-[0.04]"
        style={{
          background:
            'conic-gradient(from 0deg, transparent, var(--fg), transparent, var(--fg), transparent)',
        }}
      />
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-8 bg-foreground/10"
          style={{
            left: `${15 + i * 14}%`,
            top: '20%',
          }}
          animate={{
            y: [0, 40, 0],
            opacity: [0.1, 0.35, 0.1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
