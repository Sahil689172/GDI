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
      whileHover={hover ? { 
        y: -4, 
        scale: 1.01,
        boxShadow: "0 20px 40px -15px rgba(37, 99, 235, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.35)",
        borderColor: "rgba(59, 130, 246, 0.3)"
      } : {}}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`
        liquid-glass 
        rounded-2xl 
        p-6 
        transition-all 
        duration-300 
        ${glow ? 'shadow-glass-glow border-blue-900/40' : 'border-blue-900/20'} 
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Liquid-like moving radial reflection highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-transparent pointer-events-none z-0" />
      
      {/* Light border reflection overlay */}
      <div className="absolute inset-0 rounded-2xl border border-white/[0.03] pointer-events-none z-0" />
      
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};
