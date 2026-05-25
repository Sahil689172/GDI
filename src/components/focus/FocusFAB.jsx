import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export const FocusFAB = ({ onClick, hidden }) => {
  if (hidden) return null;

  return (
    <motion.button
      type="button"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 w-12 h-12 rounded-full bg-foreground text-background shadow-glass-glow flex items-center justify-center border border-border-strong"
      aria-label="Quick start focus"
    >
      <Zap className="w-5 h-5" />
    </motion.button>
  );
};
