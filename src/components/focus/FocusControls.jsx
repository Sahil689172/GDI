import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Maximize2, SkipForward } from 'lucide-react';

export const FocusControls = ({
  status,
  phase,
  onStart,
  onPause,
  onResume,
  onReset,
  onFullscreen,
  onSkipBreak,
}) => {
  const isBreak = phase === 'shortBreak' || phase === 'longBreak';

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      <div className="flex gap-3 w-full">
        {status === 'running' ? (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onPause}
            className="flex-1 py-3.5 rounded-2xl bg-foreground text-background text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Pause
          </motion.button>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={status === 'paused' ? onResume : onStart}
            className="flex-1 py-3.5 rounded-2xl bg-foreground text-background text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glass-glow"
          >
            <Play className="w-4 h-4" />
            {status === 'paused' ? 'Resume' : 'Start'}
          </motion.button>
        )}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          className="px-5 py-3.5 rounded-2xl border border-border bg-surface text-muted hover:text-foreground hover:border-border-strong transition-all"
          aria-label="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="flex gap-2 w-full justify-center">
        {isBreak && (
          <button
            type="button"
            onClick={onSkipBreak}
            className="px-4 py-2 rounded-xl border border-border text-[10px] font-mono uppercase tracking-wider text-muted hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <SkipForward className="w-3 h-3" />
            Skip break
          </button>
        )}
        <button
          type="button"
          onClick={onFullscreen}
          className="px-4 py-2 rounded-xl border border-border text-[10px] font-mono uppercase tracking-wider text-muted hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          <Maximize2 className="w-3 h-3" />
          Fullscreen
        </button>
      </div>
    </div>
  );
};
