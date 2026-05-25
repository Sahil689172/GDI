import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minimize2 } from 'lucide-react';
import { useFocus } from '../../context/FocusContext';
import { FocusAmbientBackground } from './FocusAmbientBackground';
import { FocusProgressRing } from './FocusProgressRing';
import { AnimatedTimer } from './AnimatedTimer';
import { FocusControls } from './FocusControls';

export const FullscreenFocusMode = () => {
  const {
    isFullscreen,
    setIsFullscreen,
    progress,
    secondsRemaining,
    status,
    phaseLabel,
    phase,
    start,
    pause,
    resume,
    reset,
    skipBreak,
  } = useFocus();

  useEffect(() => {
    if (!isFullscreen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isFullscreen, setIsFullscreen]);

  const active = status === 'running';

  return (
    <AnimatePresence>
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-background flex flex-col items-center justify-center p-6"
        >
          <FocusAmbientBackground intense={active} />
          <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-2.5 rounded-xl border border-border text-muted hover:text-foreground transition-colors z-10"
            aria-label="Exit fullscreen"
          >
            <Minimize2 className="w-4 h-4" />
          </button>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted mb-8 z-10"
          >
            {phaseLabel}
          </motion.p>

          <div className="z-10 mb-10">
            <FocusProgressRing progress={progress} size={320} active={active}>
              <AnimatedTimer seconds={secondsRemaining} active={active} />
            </FocusProgressRing>
          </div>

          <div className="z-10 w-full max-w-sm">
            <FocusControls
              status={status}
              phase={phase}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onReset={reset}
              onFullscreen={() => setIsFullscreen(false)}
              onSkipBreak={skipBreak}
            />
          </div>

          <p className="absolute bottom-8 text-[9px] font-mono text-subtle uppercase tracking-widest z-10">
            Press Esc to exit
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
