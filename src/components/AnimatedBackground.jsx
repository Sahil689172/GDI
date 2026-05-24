import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      duration: Math.random() * 30 + 30,
      delay: Math.random() * -20,
    }));
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-background overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-tech-grid opacity-50" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <motion.div
        animate={{
          x: ['-20%', '30%', '-10%', '-20%'],
          y: ['-10%', '20%', '-20%', '-10%'],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[130px]"
        style={{ background: 'var(--orb-1)' }}
      />

      <motion.div
        animate={{
          x: ['40%', '-10%', '20%', '40%'],
          y: ['30%', '-15%', '10%', '30%'],
          scale: [1.1, 0.9, 1.1, 1.1],
        }}
        transition={{ duration: 50, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 right-[-200px] w-[700px] h-[700px] rounded-full blur-[150px]"
        style={{ background: 'var(--orb-2)' }}
      />

      <motion.div
        animate={{
          x: ['-10%', '10%', '-5%', '-10%'],
          y: ['40%', '10%', '20%', '40%'],
        }}
        transition={{ duration: 55, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-300px] left-1/3 w-[800px] h-[800px] rounded-full blur-[180px] border border-border"
        style={{ background: 'var(--orb-2)' }}
      />

      <div className="absolute inset-0 z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ x: `${particle.x}%`, y: '110vh', opacity: 0.15 }}
            animate={{
              y: '-10vh',
              x: [`${particle.x}%`, `${particle.x + (Math.random() * 6 - 3)}%`],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ width: particle.size, height: particle.size, background: 'var(--particle)' }}
            className="absolute rounded-full"
          />
        ))}
      </div>

      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            'linear-gradient(to top, var(--bg) 0%, transparent 40%, transparent 70%, var(--bg) 100%)',
        }}
      />
    </div>
  );
};
