import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SPRING } from '../animations/motion';

export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.94 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        relative w-14 h-8 rounded-full border border-border bg-elevated
        flex items-center p-1 overflow-hidden shrink-0
        hover:border-border-strong transition-colors duration-300
        ${className}
      `}
    >
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-foreground shadow-glass-glow flex items-center justify-center"
        style={{ transformOrigin: '50% 50%' }}
        animate={{ x: isDark ? 0 : 24 }}
        transition={SPRING.snappy}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-background" strokeWidth={2.5} />
        ) : (
          <Sun className="w-3 h-3 text-background" strokeWidth={2.5} />
        )}
      </motion.div>
      <span className="sr-only">Toggle theme</span>
      <Moon
        className={`w-3 h-3 absolute left-2 transition-opacity duration-300 ${
          isDark ? 'opacity-40 text-muted' : 'opacity-0'
        }`}
      />
      <Sun
        className={`w-3 h-3 absolute right-2 transition-opacity duration-300 ${
          !isDark ? 'opacity-40 text-muted' : 'opacity-0'
        }`}
      />
    </motion.button>
  );
};
