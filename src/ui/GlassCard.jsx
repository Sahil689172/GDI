import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({
  children,
  className = '',
  hover = true,
  glow = false,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={
        hover
          ? {
              y: -3,
              scale: 1.005,
              boxShadow: 'var(--shadow-glass)',
              borderColor: 'var(--border-strong)',
            }
          : {}
      }
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`
        liquid-glass 
        rounded-2xl 
        p-6 
        transition-all 
        duration-300 
        ${glow ? 'shadow-glass-glow border-border-strong' : 'border-border'} 
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 rounded-2xl border border-foreground/[0.04] pointer-events-none z-0" />
      <div className="relative z-10 w-full h-full">{children}</div>
    </motion.div>
  );
};
