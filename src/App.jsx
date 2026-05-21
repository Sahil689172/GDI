import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { LoadingScreen } from './components/LoadingScreen';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FloatingActionMenu } from './components/FloatingActionMenu';
import { GlassCard } from './components/GlassCard';
import { 
  CheckSquare, 
  Target, 
  Calendar as CalendarIcon, 
  BarChart2, 
  Flame, 
  User, 
  Sparkles, 
  Check, 
  Plus,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

const ViewContainer = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="flex-1 min-h-screen px-4 md:px-8 py-8 md:pl-72 pb-24 md:pb-8 overflow-y-auto select-none"
  >
    {children}
  </motion.div>
);

// Modular Sub-view renders to make the App fully complete
const MainContent = () => {
  const { 
    activeTab, 
    tasks, 
    toggleTask, 
    addTask, 
    goals, 
    updateGoalProgress, 
    streak, 
    focusHours,
    isFocusActive,
    focusTimeLeft,
    focusSessionTotal,
    startFocus,
    stopFocus,
    resetFocus
  } = useDashboard();

  // Tasks Form state
  const [taskInput, setTaskInput] = useState('');
  
  // Format focus time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  switch (activeTab) {
    case 'Home':
      return <Dashboard />;
      
    case 'Tasks':
      return (
        <ViewContainer>
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans text-glow">
              Focus Tasks Ledger
            </h1>
            <p className="text-xs text-blue-200/50 mt-1 font-sans">
              Review and manage your commits. Completing tasks feeds today's global progress.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-4 font-sans">
                  Active Backlog
                </h2>
                <div className="flex flex-col gap-3">
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        task.completed ? 'bg-blue-950/5 border-blue-950/30 opacity-40' : 'bg-black/60 border-blue-900/15'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleTask(task.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                            task.completed ? 'bg-blue-950 border-blue-500/60 text-white' : 'bg-black border-blue-900/30'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <span className={`text-xs font-medium text-white ${task.completed ? 'line-through text-blue-200/30' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-blue-500 bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-900/20">
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-1">
              <GlassCard>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-3 font-sans">
                  Commit Rapid Task
                </h2>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!taskInput.trim()) return;
                    addTask(taskInput, 'High', 'Today, 9:00 PM');
                    setTaskInput('');
                  }}
                  className="flex flex-col gap-3"
                >
                  <input
                    type="text"
                    required
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Enter task heading..."
                    className="bg-black/60 border border-blue-900/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-blue-900/40 focus:outline-none focus:border-blue-500/40 font-sans w-full"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-tr from-blue-950 via-blue-900 to-white/10 hover:shadow-blue-glow hover:border-blue-500/40 border border-blue-900/30 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Commit Task
                  </button>
                </form>
              </GlassCard>
            </div>
          </div>
        </ViewContainer>
      );
      
    case 'Goals':
      return (
        <ViewContainer>
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans text-glow">
              Flow Objectives
            </h1>
            <p className="text-xs text-blue-200/50 mt-1 font-sans">
              Set large milestones and track your target boundaries.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {goals.map(goal => (
              <GlassCard key={goal.id} className="flex flex-col justify-between min-h-[160px]">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-white font-sans truncate">{goal.title}</h3>
                  <span className="text-[9px] font-mono text-blue-500 uppercase tracking-widest">
                    Target: {goal.target}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2 mt-6">
                  <div className="flex justify-between items-center text-[10px] font-mono text-blue-200/60">
                    <span>Progress Matrix</span>
                    <span className="text-white font-bold">{goal.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-navy-950 rounded-full overflow-hidden border border-blue-900/10">
                    <div style={{ width: `${goal.progress}%` }} className="h-full bg-blue-500 shadow-blue-glow transition-all duration-300" />
                  </div>
                  
                  {/* Interactive progress increments */}
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => updateGoalProgress(goal.id, -10)} 
                      className="flex-1 py-1 text-[9px] font-mono bg-black hover:bg-blue-950/20 border border-blue-900/30 text-blue-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      -10%
                    </button>
                    <button 
                      onClick={() => updateGoalProgress(goal.id, 10)} 
                      className="flex-1 py-1 text-[9px] font-mono bg-black hover:bg-blue-950/20 border border-blue-900/30 text-blue-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      +10%
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </ViewContainer>
      );

    case 'Calendar':
      return (
        <ViewContainer>
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans text-glow">
              Flow Calendar
            </h1>
            <p className="text-xs text-blue-200/50 mt-1 font-sans">
              Track historic streak accomplishments and upcoming focus deadlines.
            </p>
          </header>

          <GlassCard className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-semibold text-white tracking-widest font-mono uppercase">May 2026</span>
              <span className="text-[10px] font-mono text-blue-500 uppercase tracking-widest">Global commits synchronized</span>
            </div>

            {/* Grid calendar mockup */}
            <div className="grid grid-cols-7 gap-2.5 text-center">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                <span key={i} className="text-[9px] font-mono text-blue-500 uppercase tracking-wider pb-2">
                  {d}
                </span>
              ))}
              {Array.from({ length: 31 }).map((_, idx) => {
                const day = idx + 1;
                // Highlight mock streak days in elegant dark blue glow
                const isStreak = day >= 10 && day <= 22; 
                return (
                  <div 
                    key={idx}
                    className={`
                      aspect-square 
                      flex 
                      items-center 
                      justify-center 
                      rounded-xl 
                      text-xs 
                      font-mono 
                      border
                      transition-all
                      ${isStreak 
                        ? 'bg-blue-950/60 border-blue-500/40 text-white shadow-glass-glow' 
                        : 'bg-black border-blue-900/10 text-blue-200/30 hover:border-blue-900/30'
                      }
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </ViewContainer>
      );

    case 'Analytics':
      return (
        <ViewContainer>
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans text-glow">
              Diagnostic Insights
            </h1>
            <p className="text-xs text-blue-200/50 mt-1 font-sans">
              Scientific review of your flow state duration and completed loops.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-4 font-sans">
                Flow Score Diagnostics
              </h3>
              <div className="flex items-center justify-between border-b border-blue-950/45 pb-3.5 mb-3.5">
                <span className="text-xs font-sans text-blue-200/60">Average Focus Duration</span>
                <span className="text-sm font-mono font-bold text-white">42.8 mins</span>
              </div>
              <div className="flex items-center justify-between border-b border-blue-950/45 pb-3.5 mb-3.5">
                <span className="text-xs font-sans text-blue-200/60">Task Efficiency Index</span>
                <span className="text-sm font-mono font-bold text-white">92.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-blue-200/60">Streak Integrity Rate</span>
                <span className="text-sm font-mono font-bold text-white">100%</span>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-4 font-sans">
                Visual Analytics Stream
              </h3>
              <div className="h-32 w-full flex items-end gap-2.5 mt-2">
                {/* Visual bar graph representation */}
                {[30, 45, 60, 25, 80, 50, 95].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 1, delay: idx * 0.05 }}
                      className="w-full bg-gradient-to-t from-blue-950 via-blue-900 to-white/70 rounded-lg border border-blue-900/20 shadow-glass-glow" 
                    />
                    <span className="text-[8px] font-mono text-blue-500/50">M{idx + 1}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </ViewContainer>
      );

    case 'Focus':
      const focusRatio = focusTimeLeft / focusSessionTotal;
      return (
        <ViewContainer>
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans text-glow">
              Immersive Focus Chamber
            </h1>
            <p className="text-xs text-blue-200/50 mt-1 font-sans">
              Enter absolute silence. Sandglass draining syncs focus stats on completion.
            </p>
          </header>

          <GlassCard className="max-w-xl mx-auto flex flex-col items-center justify-center p-8 border-blue-500/20 shadow-blue-glow" glow={isFocusActive}>
            <div className="relative w-40 h-40 mb-6">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-blue-950 fill-none stroke-current"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M25,15 L75,15 C75,15 70,45 50,50 C30,45 25,15 25,15 Z" className="stroke-blue-900/30 fill-black/60" />
                <path d="M25,85 L75,85 C75,85 70,55 50,50 C30,55 25,85 25,85 Z" className="stroke-blue-900/30 fill-black/60" />
                <line x1="20" y1="15" x2="80" y2="15" className="stroke-white/80" />
                <line x1="20" y1="85" x2="80" y2="85" className="stroke-white/80" />
              </svg>

              {isFocusActive && (
                <>
                  <div className="absolute top-[60px] bottom-[28px] left-[78px] w-[1px] overflow-hidden pointer-events-none">
                    <motion.div animate={{ y: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-full h-8 bg-white/70" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div animate={{ y: [0, 16], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }} className="w-[1.5px] h-[1.5px] bg-white rounded-full translate-y-6" />
                  </div>
                </>
              )}

              {/* Draining topside */}
              <div className="absolute inset-0 flex justify-center items-start pt-[28px]">
                <div style={{ transform: `scaleY(${focusRatio})`, transformOrigin: 'bottom', clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} className="w-[48px] h-[35px] bg-gradient-to-b from-blue-950 to-white/60" />
              </div>

              {/* Accumulating bottomside */}
              <div className="absolute inset-0 flex justify-center items-end pb-[28px]">
                <div style={{ transform: `scaleY(${1 - focusRatio})`, transformOrigin: 'bottom', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} className="w-[48px] h-[35px] bg-gradient-to-t from-blue-950 to-white" />
              </div>
            </div>

            <div className="text-5xl font-bold font-mono tracking-widest text-white text-glow mb-2">
              {formatTime(focusTimeLeft)}
            </div>
            <span className="text-[10px] font-mono text-blue-500 uppercase tracking-widest mb-8">
              Micro Hourglass Calibrated
            </span>

            <div className="flex gap-4 w-full">
              {isFocusActive ? (
                <button
                  onClick={stopFocus}
                  className="flex-1 py-3.5 bg-white hover:bg-white/90 text-black rounded-2xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-glass-glow"
                >
                  <Pause className="w-4 h-4" />
                  Hold Stream
                </button>
              ) : (
                <button
                  onClick={() => startFocus(25)}
                  className="flex-1 py-3.5 bg-gradient-to-tr from-blue-950 via-blue-900 to-white/10 hover:shadow-blue-glow hover:border-blue-500/40 border border-blue-900/35 text-white rounded-2xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 text-blue-400" />
                  Initiate Stream
                </button>
              )}

              <button
                onClick={resetFocus}
                className="px-5 bg-black border border-blue-900/30 hover:border-blue-900/50 text-blue-500/70 hover:text-white rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </ViewContainer>
      );

    case 'Profile':
      return (
        <ViewContainer>
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans text-glow">
              Focus Credentials
            </h1>
            <p className="text-xs text-blue-200/50 mt-1 font-sans">
              System access parameters and historic benchmarks.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <GlassCard className="md:col-span-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-950 via-blue-900 to-white/15 border border-blue-900/40 flex items-center justify-center shadow-blue-glow mb-4">
                <span className="text-2xl font-bold font-mono text-white text-glow">S</span>
              </div>
              <h2 className="text-base font-semibold text-white font-sans">Sahil</h2>
              <span className="text-[10px] font-mono text-blue-500 uppercase tracking-widest mt-1">Focus Operator</span>
            </GlassCard>

            <GlassCard className="md:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-4 font-sans">
                Security Profile Logs
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-blue-950/45 pb-3">
                  <span className="text-xs text-blue-200/60 font-sans">Current Streak Core</span>
                  <span className="text-xs font-mono text-white font-bold">{streak} Days 🔥</span>
                </div>
                <div className="flex items-center justify-between border-b border-blue-950/45 pb-3">
                  <span className="text-xs text-blue-200/60 font-sans">Accumulated Focus Logs</span>
                  <span className="text-xs font-mono text-white font-bold">{focusHours} Hours ⏳</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-200/60 font-sans">Focus Engine Security Key</span>
                  <span className="text-[9px] font-mono text-blue-500 bg-blue-950/30 px-3 py-1 rounded border border-blue-900/20">
                    GDID-8892-FCS
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </ViewContainer>
      );

    default:
      return <Dashboard />;
  }
};

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden text-white bg-black">
      
      {/* 1. Master Sandglass Loading Gateway */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onFinished={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row relative z-10 w-full min-h-screen"
        >
          {/* 2. Interactive Background Layering */}
          <AnimatedBackground />

          {/* 3. Sleek Responsive Apple/Notion Left Navigation */}
          <Sidebar />

          {/* 4. Active Main Content Decider */}
          <MainContent />

          {/* 5. Expanding Floating Action Menu (Bottom-Right FAB) */}
          <FloatingActionMenu />
        </motion.div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <DashboardProvider>
      <AppContent />
    </DashboardProvider>
  );
}
