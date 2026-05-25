import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { GlassCard } from '../ui/GlassCard';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Flame, 
  Clock, 
  CheckSquare, 
  Calendar as CalendarIcon,
  Zap,
  TrendingUp,
  Sliders,
  Sparkles,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

export const Dashboard = () => {
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
    progressPercentage
  } = useDashboard();

  const navigate = useNavigate();

  // Dynamic greeting based on time of day
  const [greeting, setGreeting] = useState("Good Morning");
  const [userName, setUserName] = useState("Sahil");

  // Inline Quick Task Add State
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 18) setGreeting("Good Afternoon");
    else if (hours < 22) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  // Format timer text (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Focus Timer active ratio
  const focusRatio = focusTimeLeft / focusSessionTotal;

  // Render mini line graph for Focus Hours card
  const renderFocusGraph = () => {
    // Generate mini coordinates for a premium aesthetic line graph
    const points = "10,38 25,30 40,32 55,20 70,25 85,10 100,5";
    return (
      <svg className="w-16 h-8 text-foreground mt-1.5" viewBox="0 0 100 40" fill="none">
        <path
          d="M 10 38 Q 25 30 40 32 T 70 25 T 100 5"
          fill="none"
          stroke="url(#monoGlowGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 10 38 Q 25 30 40 32 T 70 25 T 100 5 L 100 40 L 10 40 Z"
          fill="url(#monoFillGrad)"
          opacity="0.12"
        />
        <defs>
          <linearGradient id="monoGlowGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#525252" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#a3a3a3" />
          </linearGradient>
          <linearGradient id="monoFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#737373" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  // Render concentric progress rings SVG
  const renderConcentricRings = () => {
    // Ring parameters
    const size = 180;
    const center = size / 2;
    
    // Outer Ring: Today's Tasks (Radius 70)
    const r1 = 70;
    const c1 = 2 * Math.PI * r1;
    const offset1 = c1 - (progressPercentage / 100) * c1;

    // Middle Ring: Goal Completion (Radius 50)
    const averageGoalProgress = goals.length > 0 
      ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) 
      : 0;
    const r2 = 50;
    const c2 = 2 * Math.PI * r2;
    const offset2 = c2 - (averageGoalProgress / 100) * c2;

    // Inner Ring: Weekly Streak vs Month target (Radius 30, e.g. 12 days out of 30)
    const streakTarget = 30;
    const streakRatio = Math.min(100, Math.round((streak / streakTarget) * 100));
    const r3 = 30;
    const c3 = 2 * Math.PI * r3;
    const offset3 = c3 - (streakRatio / 100) * c3;

    return (
      <div className="relative flex items-center justify-center py-4">
        <svg width={size} height={size} className="-rotate-90">
          {/* Ring 1 Tracks & Progress (Today's tasks) */}
          <circle cx={center} cy={center} r={r1} className="stroke-gray-800 fill-none" strokeWidth="6" />
          <motion.circle
            cx={center}
            cy={center}
            r={r1}
            className="stroke-foreground fill-none"
            strokeWidth="6"
            strokeDasharray={c1}
            initial={{ strokeDashoffset: c1 }}
            animate={{ strokeDashoffset: offset1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />

          {/* Ring 2 Tracks & Progress (Goals average) */}
          <circle cx={center} cy={center} r={r2} className="stroke-gray-800 fill-none" strokeWidth="6" />
          <motion.circle
            cx={center}
            cy={center}
            r={r2}
            className="stroke-muted fill-none"
            strokeWidth="6"
            strokeDasharray={c2}
            initial={{ strokeDashoffset: c2 }}
            animate={{ strokeDashoffset: offset2 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
            strokeLinecap="round"
          />

          {/* Ring 3 Tracks & Progress (Streak target) */}
          <circle cx={center} cy={center} r={r3} className="stroke-gray-800 fill-none" strokeWidth="6" />
          <motion.circle
            cx={center}
            cy={center}
            r={r3}
            className="stroke-foreground fill-none"
            strokeWidth="6"
            strokeDasharray={c3}
            initial={{ strokeDashoffset: c3 }}
            animate={{ strokeDashoffset: offset3 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            strokeLinecap="round"
          />
        </svg>

        {/* Floating Legends */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold font-mono text-foreground text-glow">
            {progressPercentage}%
          </span>
          <span className="text-[8px] font-mono text-muted uppercase tracking-wider">
            Flow Ratio
          </span>
        </div>
      </div>
    );
  };

  const handleQuickTaskAdd = (e) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    addTask(quickTaskTitle, 'Medium', 'Today, 8:00 PM');
    setQuickTaskTitle('');
    setShowQuickAdd(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {/* 1. Header Greeting Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex flex-col">
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-sans flex items-center gap-2"
          >
            {greeting}, <span className="text-glow text-foreground">{userName}</span>
            <motion.span 
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, repeatDelay: 3 }}
              className="origin-bottom-right"
            >
              ⏳
            </motion.span>
          </motion.h1>
          <p className="text-xs text-muted tracking-wide font-sans mt-1">
            Welcome to your premium focus portal. You have <span className="text-foreground font-medium">{tasks.filter(t => !t.completed).length} incomplete tasks</span> today.
          </p>
        </div>

        {/* Dynamic focus alert */}
        <div className="flex items-center gap-2.5 bg-elevated border border-border rounded-xl px-4 py-2.5 shadow-glass-inner">
          <div className="w-2 h-2 rounded-full bg-foreground animate-pulse shadow-glass-glow" />
          <span className="text-[10px] font-mono tracking-widest text-muted uppercase">
            System Synchronized
          </span>
        </div>
      </header>

      {/* 2. Productivity Overview Cards (Liquid Glass Grid) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8 min-w-0">
        
        {/* Metric 1: Today's Progress */}
        <GlassCard className="flex flex-col justify-between min-h-[110px]" glow={progressPercentage > 75}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-muted uppercase tracking-widest">
              Today's Progress
            </span>
            <CheckSquare className="w-3.5 h-3.5 text-muted" />
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-foreground text-glow">
              {progressPercentage}%
            </span>
          </div>
          {/* Micro Progress Line track */}
          <div className="w-full h-1 bg-gray-900 rounded-full mt-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-foreground shadow-glass-glow" 
            />
          </div>
        </GlassCard>

        {/* Metric 2: Tasks Completed */}
        <GlassCard className="flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-muted uppercase tracking-widest">
              Tasks Completed
            </span>
            <Zap className="w-3.5 h-3.5 text-foreground" />
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-foreground">
              {tasksCompleted}
            </span>
            <span className="text-xs font-mono text-muted">/ {totalTasks}</span>
          </div>
          <p className="text-[9px] font-sans text-muted mt-3 truncate">
            {progressPercentage === 100 ? "All tasks archived!" : "Focus on outstanding loops"}
          </p>
        </GlassCard>

        {/* Metric 3: Current Streak */}
        <GlassCard className="flex flex-col justify-between min-h-[110px]" glow={true}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-muted uppercase tracking-widest">
              Current Streak
            </span>
            <Flame className="w-3.5 h-3.5 text-foreground" />
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-foreground text-glow-strong">
              {streak}d
            </span>
          </div>
          <span className="text-[9px] font-sans text-muted mt-3 flex items-center gap-1.5">
            <Sparkles className="w-2.5 h-2.5 text-muted" />
              Keep focus chain active
          </span>
        </GlassCard>

        {/* Metric 4: Focus Hours */}
        <GlassCard className="flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-muted uppercase tracking-widest">
              Focus Hours
            </span>
            <Clock className="w-3.5 h-3.5 text-muted" />
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-foreground">
              {focusHours}h
            </span>
            {renderFocusGraph()}
          </div>
        </GlassCard>
      </section>

      {/* 3. Main Dashboard Workspace Layout (Split Layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 min-w-0">
        
        {/* Left Column: Deadlines, Quick Actions (Span 2) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Quick Actions Panel */}
          <GlassCard className="border border-border">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-muted font-sans mb-4 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" />
              Quick Action Hub
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Action 1: Add Task Inline toggle */}
              <motion.button
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 bg-surface hover:bg-elevated border border-border hover:border-border-strong rounded-xl p-3.5 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-elevated border border-border text-muted flex items-center justify-center group-hover:bg-elevated transition-colors">
                  <Plus className="w-4 h-4 text-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground font-sans">Add Task</span>
                  <span className="text-[9px] font-mono text-muted">Insert rapid goal</span>
                </div>
              </motion.button>

              {/* Action 2: Start Focus Timer section trigger */}
              <motion.button
                onClick={() => {
                  navigate('/focus');
                  startFocus(25);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 bg-surface hover:bg-elevated border border-border hover:border-border-strong rounded-xl p-3.5 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-elevated border border-border text-muted flex items-center justify-center group-hover:bg-elevated transition-colors">
                  <Play className="w-3.5 h-3.5 text-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground font-sans">Start Focus</span>
                  <span className="text-[9px] font-mono text-muted">Launch Pomodoro</span>
                </div>
              </motion.button>

              {/* Action 3: View Goals tab switch */}
              <motion.button
                onClick={() => navigate('/goals')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 bg-surface hover:bg-elevated border border-border hover:border-border-strong rounded-xl p-3.5 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-elevated border border-border text-muted flex items-center justify-center group-hover:bg-elevated transition-colors">
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground font-sans">View Goals</span>
                  <span className="text-[9px] font-mono text-muted">Review milestones</span>
                </div>
              </motion.button>
            </div>

            {/* Quick Task Add Expandable Form */}
            <AnimatePresence>
              {showQuickAdd && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleQuickTaskAdd}
                  className="mt-4 pt-4 border-t border-border flex gap-2.5"
                >
                  <input
                    type="text"
                    required
                    value={quickTaskTitle}
                    onChange={(e) => setQuickTaskTitle(e.target.value)}
                    placeholder="Enter short task objective..."
                    className="bg-surface border border-border rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-subtle focus:outline-none focus:border-border-strong transition-colors font-sans flex-1"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-elevated hover:bg-elevated border border-border text-foreground rounded-xl px-4 py-2 text-xs font-semibold tracking-wider uppercase flex items-center justify-center transition-all cursor-pointer hover:shadow-glass-glow"
                  >
                    Commit
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </GlassCard>

          {/* Upcoming Deadlines Section */}
          <GlassCard className="border border-border">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-muted font-sans flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5" />
                Upcoming Deadlines & Commits
              </h3>
              <span className="text-[9px] font-mono text-muted">
                Sorted by priority
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {tasks.length === 0 ? (
                <p className="text-xs text-subtle text-center font-mono py-8 border border-dashed border-border rounded-2xl">
                  Clear radar. No pending tasks!
                </p>
              ) : (
                tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layoutId={`task-card-${task.id}`}
                    className={`
                      relative 
                      flex 
                      items-center 
                      justify-between 
                      p-4 
                      rounded-xl 
                      border 
                      transition-all 
                      duration-200 
                      ${task.completed 
                        ? 'bg-surface border-border opacity-45' 
                        : 'bg-surface border-border hover:border-border'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Checkbox Trigger */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`
                          w-5 h-5 
                          rounded-md 
                          border 
                          flex 
                          items-center 
                          justify-center 
                          transition-all 
                          duration-200 
                          cursor-pointer
                          ${task.completed 
                            ? 'bg-elevated border-border-strong text-foreground shadow-glass-glow' 
                            : 'bg-surface border-border hover:border-border-strong text-transparent'
                          }
                        `}
                      >
                        <Zap className="w-3 h-3 text-foreground fill-current" />
                      </button>

                      <div className="flex flex-col">
                        <span className={`text-xs font-medium text-foreground font-sans ${task.completed ? 'line-through text-subtle' : ''}`}>
                          {task.title}
                        </span>
                        <span className="text-[9px] font-mono text-muted mt-1">
                          Deadline: {task.deadline}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Priority Tag (Strictly Dark Blue/White) */}
                      <span className={`
                        text-[8px] 
                        font-mono 
                        tracking-widest 
                        uppercase 
                        px-2.5 
                        py-1 
                        rounded-full 
                        border
                        ${task.priority === 'High' 
                          ? 'border-white text-foreground bg-white/5' 
                          : task.priority === 'Medium'
                          ? 'border-border text-muted bg-elevated'
                          : 'border-border text-subtle'
                        }
                      `}>
                        {task.priority}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Progress Rings and Interactive Focus Timer (Span 1) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Concentric Progress Rings Section */}
          <GlassCard className="border border-border flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold tracking-wider uppercase text-muted font-sans mb-2 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                Concentric Progress Rings
              </h3>
              <p className="text-[9px] font-sans text-muted leading-relaxed mb-4">
                Global metrics tracking Tasks (outer), Goals (mid), and Streak (inner).
              </p>
            </div>

            {renderConcentricRings()}

            {/* Legend Map */}
            <div className="grid grid-cols-3 gap-2 border-t border-border pt-4 mt-2">
              <div className="flex flex-col items-center text-center">
                <span className="w-2.5 h-2.5 rounded-full bg-foreground mb-1" />
                <span className="text-[8px] font-sans text-foreground font-semibold">Today's Progress</span>
                <span className="text-[8px] font-mono text-muted mt-0.5">{progressPercentage}%</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="w-2.5 h-2.5 rounded-full bg-elevated mb-1" />
                <span className="text-[8px] font-sans text-foreground font-semibold">Goal Status</span>
                <span className="text-[8px] font-mono text-muted mt-0.5">
                  {goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0}%
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="w-2.5 h-2.5 rounded-full bg-white mb-1" />
                <span className="text-[8px] font-sans text-foreground font-semibold">Active Streak</span>
                <span className="text-[8px] font-mono text-muted mt-0.5">{streak}d</span>
              </div>
            </div>
          </GlassCard>

          {/* Sandglass Style Focus Timer Section */}
          <GlassCard className="border border-border flex flex-col justify-between" glow={isFocusActive}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold tracking-wider uppercase text-muted font-sans flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5" />
                  Focus Matrix Timer
                </h3>
                {isFocusActive && (
                  <span className="text-[8px] font-mono text-muted bg-elevated border border-border px-2 py-0.5 rounded-full animate-pulse">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[9px] font-sans text-muted leading-relaxed">
                Enter deep focus state. Calibrates streak metrics.
              </p>
            </div>

            {/* Interactive hourglass countdown */}
            <div className="flex flex-col items-center justify-center py-6 relative">
              {/* Hourglass Vector Graphic */}
              <div className="relative w-20 h-20 mb-4">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-subtle fill-none stroke-current"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M25,15 L75,15 C75,15 70,45 50,50 C30,45 25,15 25,15 Z" className="stroke-border fill-black/60" />
                  <path d="M25,85 L75,85 C75,85 70,55 50,50 C30,55 25,85 25,85 Z" className="stroke-border fill-black/60" />
                  <line x1="20" y1="15" x2="80" y2="15" className="stroke-foreground/80" />
                  <line x1="20" y1="85" x2="80" y2="85" className="stroke-foreground/80" />
                </svg>

                {/* Animated Sand flowing if active */}
                {isFocusActive && (
                  <>
                    {/* Sand stream */}
                    <div className="absolute top-[37px] bottom-[17px] left-[39px] w-[1px] overflow-hidden pointer-events-none">
                      <motion.div
                        animate={{ y: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-full h-6 bg-white/70"
                      />
                    </div>
                    {/* Falling particle bursts */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        animate={{ y: [0, 10], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                        className="w-[1.5px] h-[1.5px] bg-white rounded-full translate-y-3"
                      />
                    </div>
                  </>
                )}

                {/* Top draining sand body */}
                <div className="absolute inset-0 flex justify-center items-start pt-[17.5px]">
                  <div 
                    style={{
                      transform: `scaleY(${focusRatio})`,
                      transformOrigin: 'bottom',
                      clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'
                    }}
                    className="w-[30px] h-[22px] bg-gradient-to-b from-gray-900 to-white/60 transition-all duration-1000"
                  />
                </div>

                {/* Bottom rising sand body */}
                <div className="absolute inset-0 flex justify-center items-end pb-[17.5px]">
                  <div 
                    style={{
                      transform: `scaleY(${1 - focusRatio})`,
                      transformOrigin: 'bottom',
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                    }}
                    className="w-[30px] h-[22px] bg-gradient-to-t from-gray-900 to-white transition-all duration-1000"
                  />
                </div>
              </div>

              {/* Technical glowing digital clock */}
              <div className="text-3xl font-bold font-mono tracking-wider text-foreground text-glow">
                {formatTime(focusTimeLeft)}
              </div>
              <span className="text-[8px] font-mono text-muted uppercase tracking-widest mt-1">
                Calibrating State
              </span>
            </div>

            {/* Timer Controls */}
            <div className="flex gap-2">
              {isFocusActive ? (
                <button
                  onClick={stopFocus}
                  className="flex-1 py-3 btn-primary hover:opacity-90 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5" />
                  Hold Frame
                </button>
              ) : (
                <button
                  onClick={() => startFocus(25)}
                  className="flex-1 py-3 bg-elevated border border-border hover:shadow-glass-glow hover:border-border-strong border border-border text-foreground rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-muted" />
                  Initiate Flow
                </button>
              )}

              <button
                onClick={resetFocus}
                className="px-4 bg-surface border border-border hover:border-border-strong text-muted hover:text-foreground rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};
