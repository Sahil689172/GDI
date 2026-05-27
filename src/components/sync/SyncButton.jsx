import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CloudOff } from 'lucide-react';
import { useSync } from '../../context/SyncContext';

export const SyncButton = memo(function SyncButton({ className = '' }) {
  const { isOnline, syncing, queueSize, syncNow } = useSync();

  return (
    <button
      type="button"
      onClick={() => syncNow({ pull: true })}
      className={`touch-target relative p-2 rounded-xl border border-border ${className}`}
      aria-label="Sync"
      title={isOnline ? 'Sync' : 'Offline'}
    >
      {isOnline ? (
        <motion.span
          animate={syncing ? { rotate: 360 } : { rotate: 0 }}
          transition={syncing ? { repeat: Infinity, ease: 'linear', duration: 1 } : { duration: 0.2 }}
          className="block"
        >
          <RefreshCw className="w-4 h-4" />
        </motion.span>
      ) : (
        <CloudOff className="w-4 h-4 text-muted" />
      )}
      {queueSize > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-foreground text-background text-[9px] font-bold font-mono flex items-center justify-center">
          {queueSize > 99 ? '99+' : queueSize}
        </span>
      )}
    </button>
  );
});

