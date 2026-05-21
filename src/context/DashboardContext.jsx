import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
  return context;
};

export const DashboardProvider = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState('Home');
  
  // Dashboard Metrics & Stats
  const [streak, setStreak] = useState(12);
  const [focusHours, setFocusHours] = useState(24.5);
  
  // Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Release Vite Core Architecture', deadline: 'Today, 5:00 PM', completed: false, priority: 'High' },
    { id: 2, title: 'Refactor Goal State Manager', deadline: 'Tomorrow, 10:00 AM', completed: false, priority: 'Medium' },
    { id: 3, title: 'Optimize Glassmorphism Shaders', deadline: 'May 25, 2:00 PM', completed: true, priority: 'Low' },
    { id: 4, title: 'Review Apple-inspired Typography UI', deadline: 'May 28, 4:00 PM', completed: false, priority: 'High' },
  ]);

  // Goals State
  const [goals, setGoals] = useState([
    { id: 1, title: 'Master Framer Motion Physics', progress: 85, target: '100%' },
    { id: 2, title: 'Complete Gotta-do-it MVP UI', progress: 60, target: '100%' },
    { id: 3, title: 'Perfect Focus Streak', progress: 90, target: '30 Days' },
  ]);

  // Quick Notes State
  const [notes, setNotes] = useState([
    { id: 1, text: 'Remember to adjust the radial gradient mesh contrast before deploying.', time: '10 mins ago' },
    { id: 2, text: 'Linear-inspired subtext looks better with tracking-wider.', time: '2 hours ago' }
  ]);

  // Focus Session (Pomodoro Timer) State
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [focusTimeLeft, setFocusTimeLeft] = useState(1500); // 25 mins default
  const [focusSessionTotal, setFocusSessionTotal] = useState(1500);
  const timerRef = useRef(null);

  // Stats derivation
  const tasksCompleted = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

  // Actions
  const addTask = (title, priority = 'Medium', deadline = 'Today, 6:00 PM') => {
    const newTask = {
      id: Date.now(),
      title,
      deadline,
      completed: false,
      priority
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addGoal = (title, target = '100%') => {
    const newGoal = {
      id: Date.now(),
      title,
      progress: 0,
      target
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoalProgress = (id, progressAmount) => {
    setGoals(prev =>
      prev.map(g =>
        g.id === id ? { ...g, progress: Math.min(100, Math.max(0, g.progress + progressAmount)) } : g
      )
    );
  };

  const addNote = (text) => {
    const newNote = {
      id: Date.now(),
      text,
      time: 'Just now'
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Timer Management
  const startFocus = (minutes = 25) => {
    clearInterval(timerRef.current);
    const secs = minutes * 60;
    setFocusTimeLeft(secs);
    setFocusSessionTotal(secs);
    setIsFocusActive(true);
  };

  const stopFocus = () => {
    clearInterval(timerRef.current);
    setIsFocusActive(false);
  };

  const resetFocus = () => {
    clearInterval(timerRef.current);
    setIsFocusActive(false);
    setFocusTimeLeft(1500);
    setFocusSessionTotal(1500);
  };

  useEffect(() => {
    if (isFocusActive) {
      timerRef.current = setInterval(() => {
        setFocusTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsFocusActive(false);
            // Increment focus hours by the session length in hours
            const sessionHours = Number((focusSessionTotal / 3600).toFixed(2));
            setFocusHours(prevHours => Number((prevHours + sessionHours).toFixed(1)));
            setStreak(prevStreak => prevStreak + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isFocusActive, focusSessionTotal]);

  const value = {
    activeTab,
    setActiveTab,
    streak,
    setStreak,
    focusHours,
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    goals,
    addGoal,
    updateGoalProgress,
    notes,
    addNote,
    deleteNote,
    isFocusActive,
    focusTimeLeft,
    focusSessionTotal,
    startFocus,
    stopFocus,
    resetFocus,
    tasksCompleted,
    totalTasks,
    progressPercentage
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
