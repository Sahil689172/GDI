import React from 'react';
import { motion } from 'framer-motion';
import { useFocus } from '../context/FocusContext';
import { PageHeader } from '../ui/PageHeader';
import { GlassCard } from '../ui/GlassCard';
import { staggerContainer, staggerItem } from '../animations/pageTransitions';
import { FocusAmbientBackground } from '../components/focus/FocusAmbientBackground';
import { FocusProgressRing } from '../components/focus/FocusProgressRing';
import { AnimatedTimer } from '../components/focus/AnimatedTimer';
import { FocusControls } from '../components/focus/FocusControls';
import { FocusModeSelector } from '../components/focus/FocusModeSelector';
import { FocusStatsCards } from '../components/focus/FocusStatsCards';
import { WeeklyFocusChart } from '../components/focus/WeeklyFocusChart';
import { FocusHistory } from '../components/focus/FocusHistory';
import { FocusQuotes } from '../components/focus/FocusQuotes';
import { SessionCompleteOverlay } from '../components/focus/SessionCompleteOverlay';
import { FullscreenFocusMode } from '../components/focus/FullscreenFocusMode';
import { FocusFAB } from '../components/focus/FocusFAB';

export const FocusPage = () => {
  const {
    mode,
    phase,
    phaseLabel,
    status,
    progress,
    secondsRemaining,
    customMinutes,
    selectMode,
    setCustomDuration,
    start,
    pause,
    resume,
    reset,
    skipBreak,
    setIsFullscreen,
    analytics,
    history,
    showComplete,
    lastCompleted,
  } = useFocus();

  const active = status === 'running';
  const timerDisabled = status === 'running' || status === 'paused';

  const badge =
    status === 'running' ? 'In session' : status === 'paused' ? 'Paused' : 'Ready';

  return (
    <>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <PageHeader
          title="Focus Chamber"
          subtitle="Pomodoro, deep work, and ambient sessions — tracked in monochrome clarity."
          badge={badge}
        />

        <motion.div variants={staggerItem} className="mb-6">
          <FocusStatsCards analytics={analytics} />
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
          <motion.div variants={staggerItem} className="space-y-4">
            <GlassCard className="!p-6 md:!p-8 relative overflow-hidden" glow={active}>
              <FocusAmbientBackground intense={active} />

              <div className="relative z-10">
                <FocusModeSelector
                  mode={mode}
                  onSelect={selectMode}
                  customMinutes={customMinutes}
                  onCustomChange={setCustomDuration}
                  disabled={timerDisabled}
                />

                <div className="flex flex-col items-center mt-8 mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted mb-6">
                    {phaseLabel}
                  </span>
                  <FocusProgressRing
                    progress={progress}
                    size={260}
                    active={active}
                  >
                    <AnimatedTimer seconds={secondsRemaining} active={active} />
                  </FocusProgressRing>
                </div>

                <FocusControls
                  status={status}
                  phase={phase}
                  onStart={start}
                  onPause={pause}
                  onResume={resume}
                  onReset={reset}
                  onFullscreen={() => setIsFullscreen(true)}
                  onSkipBreak={skipBreak}
                />
              </div>
            </GlassCard>

            <FocusQuotes paused={active} />
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4"
          >
            <WeeklyFocusChart weekDays={analytics.weekDays} />
            <FocusHistory history={history} />
          </motion.div>
        </div>
      </motion.div>

      <FocusFAB
        onClick={start}
        hidden={status !== 'idle'}
      />

      <FullscreenFocusMode />
      <SessionCompleteOverlay show={showComplete} session={lastCompleted} />
    </>
  );
};
