import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../animations/microinteractions';
import { useDashboard } from '../../context/DashboardContext';
import { GlassCard } from '../../ui/GlassCard';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Flame,
  Clock,
  CheckSquare,
  Calendar,
  Target,
  ChevronRight,
  Zap,
  TrendingUp,
} from 'lucide-react';

const MetricCard = ({ label, value, sub, icon: Icon, glow }) => (
  <GlassCard className="!p-4 min-h-[100px] flex flex-col justify-between" glow={glow} hover={false}>
    <div className="flex items-center justify-between gap-2 mb-3">
      <span className="text-[10px] font-mono text-muted uppercase tracking-wider leading-tight">
        {label}
      </span>
      <Icon className="w-4 h-4 text-muted shrink-0" />
    </div>
    <div>
      <p className="text-2xl font-bold font-mono text-foreground text-glow leading-none">{value}</p>
      {sub && <p className="text-[10px] text-muted font-sans mt-2 leading-snug">{sub}</p>}
    </div>
  </GlassCard>
);

export const DashboardMobile = () => {
  const navigate = useNavigate();
  const {
    streak,
    focusHours,
    tasks,
    toggleTask,
    addTask,
    goals,
    isFocusActive,
    focusTimeLeft,
    focusSessionTotal,
    startFocus,
    stopFocus,
    resetFocus,
    tasksCompleted,
    totalTasks,
    progressPercentage,
  } = useDashboard();

  const [greeting, setGreeting] = useState('Good Morning');
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const incomplete = tasks.filter((t) => !t.completed).length;
  const avgGoal =
    goals.length > 0
      ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)
      : 0;

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good Morning');
    else if (h < 18) setGreeting('Good Afternoon');
    else if (h < 22) setGreeting('Good Evening');
    else setGreeting('Good Night');
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const focusRatio = focusSessionTotal > 0 ? focusTimeLeft / focusSessionTotal : 1;

  const handleQuickTaskAdd = (e) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    addTask(quickTaskTitle, 'Medium');
    setQuickTaskTitle('');
    setShowQuickAdd(false);
  };

  const quickActions = [
    { label: 'Add Task', icon: Plus, onClick: () => setShowQuickAdd(true) },
    { label: 'Focus', icon: Play, onClick: () => { navigate('/focus'); startFocus(25); } },
    { label: 'Goals', icon: Target, onClick: () => navigate('/goals') },
    { label: 'Calendar', icon: Calendar, onClick: () => navigate('/calendar') },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="w-full max-w-full pb-4"
    >
      <motion.header variants={staggerItem} className="mb-6">
        <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight text-foreground font-sans">
          {greeting}
        </h1>
        <p className="text-sm text-muted font-sans mt-2 leading-relaxed">
          {incomplete} task{incomplete !== 1 ? 's' : ''} left today · {progressPercentage}% flow
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-elevated border border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
            Synced
          </span>
        </div>
      </motion.header>

      <motion.section variants={staggerItem} className="grid grid-cols-2 gap-3 mb-6">
        <MetricCard
          label="Progress"
          value={`${progressPercentage}%`}
          sub="Today's flow"
          icon={CheckSquare}
          glow={progressPercentage > 70}
        />
        <MetricCard
          label="Tasks"
          value={`${tasksCompleted}/${totalTasks}`}
          sub="Completed"
          icon={Zap}
        />
        <MetricCard label="Streak" value={`${streak}d`} sub="Keep it going" icon={Flame} />
        <MetricCard label="Focus" value={`${focusHours}h`} sub="Total hours" icon={Clock} />
      </motion.section>

      <motion.section variants={staggerItem} className="mb-6">
        <GlassCard className="!p-4" hover={false}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-foreground font-sans uppercase tracking-wider">
              Overview
            </span>
            <TrendingUp className="w-4 h-4 text-muted" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] font-mono text-muted mb-1">
                <span>Tasks</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                <motion.div
                  className="h-full bg-foreground rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono text-muted mb-1">
                <span>Goals</span>
                <span>{avgGoal}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                <motion.div
                  className="h-full bg-foreground/70 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${avgGoal}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.section>

      <motion.section variants={staggerItem} className="mb-6">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted mb-3 px-0.5">
          Quick actions
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={action.onClick}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-border active:bg-elevated text-left touch-manipulation min-h-[56px]"
              >
                <div className="w-9 h-9 rounded-lg bg-elevated border border-border flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-xs font-medium text-foreground font-sans">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {showQuickAdd && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleQuickTaskAdd}
              className="mt-3 flex gap-2"
            >
              <input
                value={quickTaskTitle}
                onChange={(e) => setQuickTaskTitle(e.target.value)}
                placeholder="Task title..."
                className="flex-1 min-w-0 input-field text-sm py-3"
                autoFocus
              />
              <button
                type="submit"
                className="shrink-0 px-4 py-3 rounded-xl bg-foreground text-background text-xs font-medium"
              >
                Add
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.section>

      <motion.section variants={staggerItem} className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted">Tasks</h2>
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="text-[10px] font-mono text-muted flex items-center gap-1 touch-manipulation py-1"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <GlassCard className="!p-3 divide-y divide-border" hover={false}>
          {tasks.length === 0 ? (
            <p className="text-xs text-muted text-center py-8 font-sans">No tasks yet</p>
          ) : (
            tasks.slice(0, 6).map((task) => (
              <div key={task.id} className="flex items-start gap-3 py-3 first:pt-1 last:pb-1">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 shrink-0 rounded-md border flex items-center justify-center touch-manipulation ${
                    task.completed
                      ? 'bg-foreground border-foreground text-background'
                      : 'border-border bg-surface'
                  }`}
                >
                  {task.completed && <CheckSquare className="w-3.5 h-3.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium font-sans truncate ${
                      task.completed ? 'text-muted line-through' : 'text-foreground'
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-[10px] font-mono text-muted mt-0.5">{task.deadline}</p>
                </div>
                <span className="text-[9px] font-mono uppercase text-muted shrink-0 pt-0.5">
                  {task.priority === 'High' ? 'High' : ''}
                </span>
              </div>
            ))
          )}
        </GlassCard>
      </motion.section>

      <motion.section variants={staggerItem}>
        <GlassCard className="!p-5" glow={isFocusActive} hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-foreground font-sans uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Focus
            </h2>
            {isFocusActive && (
              <span className="text-[9px] font-mono text-foreground bg-elevated px-2 py-0.5 rounded-full border border-border">
                Live
              </span>
            )}
          </div>
          <p className="text-4xl font-bold font-mono text-foreground text-glow text-center tracking-wider tabular-nums">
            {formatTime(focusTimeLeft)}
          </p>
          <div className="mt-4 h-1 rounded-full bg-surface overflow-hidden">
            <motion.div
              className="h-full bg-foreground"
              animate={{ width: `${focusRatio * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex gap-2 mt-5">
            {isFocusActive ? (
              <button
                type="button"
                onClick={stopFocus}
                className="flex-1 py-3.5 rounded-xl bg-foreground text-background text-xs font-semibold uppercase tracking-wider touch-manipulation min-h-[48px] flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            ) : (
              <button
                type="button"
                onClick={() => startFocus(25)}
                className="flex-1 py-3.5 rounded-xl bg-foreground text-background text-xs font-semibold uppercase tracking-wider touch-manipulation min-h-[48px] flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start 25m
              </button>
            )}
            <button
              type="button"
              onClick={resetFocus}
              className="w-12 rounded-xl border border-border bg-surface flex items-center justify-center touch-manipulation"
              aria-label="Reset"
            >
              <RotateCcw className="w-4 h-4 text-muted" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate('/focus')}
            className="w-full mt-3 py-2.5 text-[10px] font-mono uppercase tracking-wider text-muted touch-manipulation"
          >
            Open focus chamber →
          </button>
        </GlassCard>
      </motion.section>
    </motion.div>
  );
};
