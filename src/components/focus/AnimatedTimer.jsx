import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatFocusTime } from './focusConstants';

export const AnimatedTimer = ({ seconds, active }) => {
  const display = formatFocusTime(seconds);

  return (
    <div className="text-center">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={display}
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-mono tracking-[0.08em] sm:tracking-[0.12em] tabular-nums ${
            active ? 'text-foreground text-glow' : 'text-foreground'
          }`}
        >
          {display}
        </motion.div>
      </AnimatePresence>
      <motion.div
        animate={active ? { opacity: [0.4, 0.8, 0.4] } : { opacity: 0.5 }}
        transition={{ duration: 2, repeat: active ? Infinity : 0 }}
        className="h-px w-16 mx-auto mt-4 bg-gradient-to-r from-transparent via-foreground/40 to-transparent"
      />
    </div>
  );
};
