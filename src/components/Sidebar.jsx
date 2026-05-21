import React from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { 
  Home, 
  CheckSquare, 
  Target, 
  Calendar as CalendarIcon, 
  BarChart2, 
  Flame, 
  User, 
  Zap,
  LogOut
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'Home', label: 'Home', icon: Home },
  { id: 'Tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'Goals', label: 'Goals', icon: Target },
  { id: 'Calendar', label: 'Calendar', icon: CalendarIcon },
  { id: 'Analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'Focus', label: 'Focus', icon: Flame },
  { id: 'Profile', label: 'Profile', icon: User },
];

export const Sidebar = () => {
  const { activeTab, setActiveTab, streak } = useDashboard();

  return (
    <>
      {/* 1. Desktop Left Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 h-screen border-r border-blue-950/40 bg-black/60 backdrop-blur-xl p-6 justify-between select-none fixed left-0 top-0 z-30">
        
        {/* Header/Logo */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-900 via-black to-blue-600 border border-blue-900/40 flex items-center justify-center shadow-blue-glow">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold tracking-wider uppercase text-white font-sans text-glow">
                Gotta-do-it
              </h1>
              <span className="text-[9px] font-mono text-blue-500 uppercase tracking-widest leading-none">
                Focus OS
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Item Array */}
        <nav className="flex flex-col gap-1.5 py-8 my-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  relative 
                  flex 
                  items-center 
                  gap-3.5 
                  px-4 
                  py-3 
                  rounded-xl 
                  text-xs 
                  font-medium 
                  tracking-wide 
                  text-left 
                  transition-all 
                  duration-200 
                  group
                  ${isActive ? 'text-white' : 'text-blue-200/50 hover:text-white'}
                `}
              >
                {/* Active Backdrop Glide */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-950/60 to-blue-900/10 border border-blue-900/40 shadow-glass-glow z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                {/* Icon wrapper */}
                <Icon className={`
                  relative 
                  z-10 
                  w-4 h-4 
                  transition-transform 
                  duration-300 
                  group-hover:scale-110 
                  ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'text-blue-200/40 group-hover:text-blue-300'}
                `} />
                
                <span className="relative z-10">{item.label}</span>

                {/* Micro indicators */}
                {item.id === 'Focus' && (
                  <span className="relative z-10 ml-auto flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-blue-950/40 pt-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-blue-950 via-blue-900 to-white/20 border border-blue-900/30 flex items-center justify-center overflow-hidden">
              {/* Profile icon/initial */}
              <span className="text-xs font-semibold text-white font-mono">S</span>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-blue-500 border border-black" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white font-sans leading-snug">
                Sahil
              </span>
              <span className="text-[10px] font-mono text-blue-500/70 leading-none">
                Streak: {streak}d 🔥
              </span>
            </div>
          </div>

          <button 
            className="flex items-center gap-2.5 px-3 py-2 text-[10px] font-mono tracking-wider uppercase text-blue-500/50 hover:text-white transition-colors duration-200"
            onClick={() => alert("Exiting dashboard session...")}
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* 2. Mobile bottom navigation bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-2xl border-t border-blue-950/50 z-30 px-3 py-1 flex items-center justify-around select-none">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                relative
                flex 
                flex-col 
                items-center 
                gap-1 
                px-2.5 
                py-2 
                rounded-xl 
                text-[9px] 
                font-medium 
                tracking-wider 
                transition-all 
                duration-150
                ${isActive ? 'text-white' : 'text-blue-200/40'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator-mobile"
                  className="absolute inset-x-1.5 inset-y-1 rounded-xl bg-blue-950/60 border border-blue-900/30 z-0"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              
              <Icon className={`
                relative 
                z-10 
                w-4 h-4 
                ${isActive ? 'text-white' : 'text-blue-200/40'}
              `} />
              
              <span className="relative z-10 font-sans">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
