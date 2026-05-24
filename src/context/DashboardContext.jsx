import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useTasks } from './TasksContext';
import { useGoals } from './GoalsContext';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
  return context;
};

export const DashboardProvider = ({ children }) => {
  const {
    flatTasksForDashboard: tasks,
    stats,
    toggleTaskById,
    addTaskToFirstWorkspace,
    deleteTask: deleteTaskFromWorkspace,
  } = useTasks();

  const {
    flatGoalsForDashboard: goals,
    createGoal,
  } = useGoals();

  const [streak, setStreak] = useState(12);
  const [focusHours, setFocusHours] = useState(24.5);

  const [notes, setNotes] = useState([
    {
      id: 1,
      text: 'Remember to adjust the radial gradient mesh contrast before deploying.',
      time: '10 mins ago',
    },
    { id: 2, text: 'Linear-inspired subtext looks better with tracking-wider.', time: '2 hours ago' },
  ]);

  const [isFocusActive, setIsFocusActive] = useState(false);
  const [focusTimeLeft, setFocusTimeLeft] = useState(1500);
  const [focusSessionTotal, setFocusSessionTotal] = useState(1500);
  const timerRef = useRef(null);

  const tasksCompleted = stats.completed;
  const totalTasks = stats.total;
  const progressPercentage = stats.productivity;

  const addTask = (title, priority = 'Medium') => {
    const p = priority === 'High' ? 'high' : 'normal';
    addTaskToFirstWorkspace(title, p);
  };

  const toggleTask = (id) => toggleTaskById(id);

  const deleteTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task?.workspaceId) {
      deleteTaskFromWorkspace(task.workspaceId, id);
    }
  };

  const addGoal = (title, target = '30 Days') => {
    const days = parseInt(String(target).match(/\d+/)?.[0] || '30', 10);
    createGoal({
      title,
      description: '',
      targetDays: days,
      startDate: new Date().toISOString().split('T')[0],
      milestones: [],
    });
  };

  const updateGoalProgress = () => {
    /* legacy — goals managed on Goals page */
  };

  const addNote = (text) => {
    const newNote = { id: Date.now(), text, time: 'Just now' };
    setNotes((prev) => [newNote, ...prev]);
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

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
        setFocusTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsFocusActive(false);
            const sessionHours = Number((focusSessionTotal / 3600).toFixed(2));
            setFocusHours((prevHours) => Number((prevHours + sessionHours).toFixed(1)));
            setStreak((prevStreak) => prevStreak + 1);
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
    progressPercentage,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
