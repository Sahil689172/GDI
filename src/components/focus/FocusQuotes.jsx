import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { FOCUS_QUOTES } from './focusConstants';

export const FocusQuotes = ({ paused }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % FOCUS_QUOTES.length);
    }, 12000);
    return () => clearInterval(id);
  }, [paused]);

  const quote = FOCUS_QUOTES[index];

  return (
    <GlassCard className="!p-5" hover={false}>
      <Quote className="w-4 h-4 text-muted mb-3" />
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-foreground font-sans leading-relaxed italic">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="text-[10px] font-mono text-muted mt-3 uppercase tracking-wider">
            — {quote.author}
          </p>
        </motion.div>
      </AnimatePresence>
    </GlassCard>
  );
};
