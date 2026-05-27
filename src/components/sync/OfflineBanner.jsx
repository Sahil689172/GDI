import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useSync } from '../../context/SyncContext';

export const OfflineBanner = memo(function OfflineBanner() {
  const { isOnline, queueSize } = useSync();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          className="sticky top-0 z-[65] w-full px-4 md:px-8 pt-safe"
        >
          <div className="liquid-glass border border-border-strong shadow-glass-glow rounded-xl px-4 py-2.5 flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-muted" />
            <span className="text-xs font-sans text-foreground">
              Offline mode — changes are saved locally
            </span>
            {queueSize > 0 && (
              <span className="ml-auto text-[10px] font-mono text-muted uppercase tracking-widest">
                {queueSize} pending
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

