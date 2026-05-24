import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { GlassCard } from '../ui/GlassCard';
import { PageHeader } from '../ui/PageHeader';
import { staggerContainer, staggerItem } from '../animations/pageTransitions';

export const FocusPage = () => {
  const {
    isFocusActive,
    focusTimeLeft,
    focusSessionTotal,
    startFocus,
    stopFocus,
    resetFocus,
  } = useDashboard();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const focusRatio = focusTimeLeft / focusSessionTotal;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <PageHeader
        title="Immersive Focus Chamber"
        subtitle="Enter absolute silence. Sandglass draining syncs focus stats on completion."
        badge={isFocusActive ? 'Active' : 'Standby'}
      />

      <motion.div variants={staggerItem}>
        <GlassCard
          className="max-w-xl mx-auto flex flex-col items-center justify-center p-8 border-border-strong"
          glow={isFocusActive}
        >
          <div className="relative w-40 h-40 mb-6">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-subtle fill-none stroke-current"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M25,15 L75,15 C75,15 70,45 50,50 C30,45 25,15 25,15 Z"
                className="stroke-border fill-black/60"
              />
              <path
                d="M25,85 L75,85 C75,85 70,55 50,50 C30,55 25,85 25,85 Z"
                className="stroke-border fill-black/60"
              />
              <line x1="20" y1="15" x2="80" y2="15" className="stroke-foreground/80" />
              <line x1="20" y1="85" x2="80" y2="85" className="stroke-foreground/80" />
            </svg>

            {isFocusActive && (
              <>
                <div className="absolute top-[60px] bottom-[28px] left-[78px] w-[1px] overflow-hidden pointer-events-none">
                  <motion.div
                    animate={{ y: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-full h-8 bg-white/70"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, 16], opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5, ease: 'linear' }}
                    className="w-[1.5px] h-[1.5px] bg-white rounded-full translate-y-6"
                  />
                </div>
              </>
            )}

            <div className="absolute inset-0 flex justify-center items-start pt-[28px]">
              <div
                style={{
                  transform: `scaleY(${focusRatio})`,
                  transformOrigin: 'bottom',
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                }}
                className="w-[48px] h-[35px] bg-gradient-to-b from-gray-900 to-white/60 transition-all duration-1000"
              />
            </div>
            <div className="absolute inset-0 flex justify-center items-end pb-[28px]">
              <div
                style={{
                  transform: `scaleY(${1 - focusRatio})`,
                  transformOrigin: 'bottom',
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                }}
                className="w-[48px] h-[35px] bg-gradient-to-t from-gray-900 to-white transition-all duration-1000"
              />
            </div>
          </div>

          <div className="text-5xl font-bold font-mono tracking-widest text-foreground text-glow mb-2">
            {formatTime(focusTimeLeft)}
          </div>
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest mb-8">
            Micro Hourglass Calibrated
          </span>

          <div className="flex gap-4 w-full max-w-sm">
            {isFocusActive ? (
              <button
                onClick={stopFocus}
                className="flex-1 py-3.5 btn-primary hover:opacity-90 rounded-2xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-glass-glow"
              >
                <Pause className="w-4 h-4" />
                Hold Stream
              </button>
            ) : (
              <button
                onClick={() => startFocus(25)}
                className="flex-1 py-3.5 bg-elevated border border-border hover:shadow-glass-glow hover:border-border-strong border border-border text-foreground rounded-2xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 text-muted" />
                Initiate Stream
              </button>
            )}
            <button
              onClick={resetFocus}
              className="px-5 bg-surface border border-border hover:border-border-strong text-muted hover:text-foreground rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};
