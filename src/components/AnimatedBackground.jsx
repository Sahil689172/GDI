import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
  // Generate random static particles to avoid re-rendering layout calculations
  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 30 + 30,
      delay: Math.random() * -20,
    }));
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden pointer-events-none z-0">
      
      {/* 1. Subtle futuristic grid overlay */}
      <div className="absolute inset-0 bg-tech-grid opacity-60 mix-blend-screen" />
      
      {/* 2. Soft horizontal line accentuates (Apple/Notion inspired premium header gradient line) */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-900/30 to-transparent" />

      {/* 3. Glowing Orbital Mesh Gradients (Dark Blue & Deep Cobalt Blurs) */}
      {/* Orb 1: Core Glow */}
      <motion.div 
        animate={{
          x: ['-20%', '30%', '-10%', '-20%'],
          y: ['-10%', '20%', '-20%', '-10%'],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[130px]"
      />

      {/* Orb 2: Secondary Accent Glow */}
      <motion.div 
        animate={{
          x: ['40%', '-10%', '20%', '40%'],
          y: ['30%', '-15%', '10%', '30%'],
          scale: [1.1, 0.85, 1.15, 1.1],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 right-[-200px] w-[700px] h-[700px] rounded-full bg-blue-950/15 blur-[150px]"
      />

      {/* Orb 3: Bottom ambient glow */}
      <motion.div 
        animate={{
          x: ['-10%', '10%', '-5%', '-10%'],
          y: ['40%', '10%', '20%', '40%'],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-300px] left-1/3 w-[800px] h-[800px] rounded-full bg-navy-950/20 blur-[180px] border border-blue-900/5"
      />

      {/* 4. Soft drifting cosmic particles (Strictly dark blue/white) */}
      <div className="absolute inset-0 z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}%`, 
              y: '110vh', 
              opacity: Math.random() * 0.4 + 0.1 
            }}
            animate={{ 
              y: '-10vh',
              x: [`${particle.x}%`, `${particle.x + (Math.random() * 10 - 5)}%`, `${particle.x}%`]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: particle.size,
              height: particle.size,
            }}
            className={`absolute rounded-full ${
              particle.id % 3 === 0 
                ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]' 
                : 'bg-white'
            }`}
          />
        ))}
      </div>
      
      {/* 5. Minimal radial light vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 opacity-80" />
    </div>
  );
};
