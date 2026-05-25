import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { useTasks } from './TasksContext';
import { useGoals } from './GoalsContext';

const DashboardContext = createContext(null);

const focusTickStore = {
  focusTimeLeft: 1500,
  focusSessionTotal: 1500,
  listeners: new Set(),
};

const subscribeFocusTick = (listener) => {
  focusTickStore.listeners.add(listener);
  return () => focusTickStore.listeners.delete(listener);
};

const getFocusTimeLeft = () => focusTickStore.focusTimeLeft;
const getFocusSessionTotal = () => focusTickStore.focusSessionTotal;

const emitFocusTick = () => {
  focusTickStore.listeners.forEach((l) => l());
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
  return context;
};

/** Subscribe to per-second focus timer ticks without re-rendering the whole app. */
export const useDashboardFocusTick = () => {
  const focusTimeLeft = useSyncExternalStore(
    subscribeFocusTick,
    getFocusTimeLeft,
    getFocusTimeLeft
  );
  const focusSessionTotal = useSyncExternalStore(
    subscribeFocusTick,
    getFocusSessionTotal,
    getFocusSessionTotal
  );
  return { focusTimeLeft, focusSessionTotal };
};

export const DashboardProvider = ({ children }) => {
  const {
    flatTasksForDashboard: tasks,
    stats,
    toggleTaskById,
    addTaskToFirstWorkspace,
    deleteTask: deleteTaskFromWorkspace,
  } = useTasks();

  const { flatGoalsForDashboard: goals, createGoal } = useGoals();

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
  const timerRef = useRef(null);
  const focusSessionTotalRef = useRef(1500);

  const tasksCompleted = stats.completed;
  const totalTasks = stats.total;
  const progressPercentage = stats.productivity;

  const addTask = useCallback(
    (title, priority = 'Medium') => {
      const p = priority === 'High' ? 'high' : 'normal';
      addTaskToFirstWorkspace(title, p);
    },
    [addTaskToFirstWorkspace]
  );

  const toggleTask = useCallback((id) => toggleTaskById(id), [toggleTaskById]);

  const deleteTask = useCallback(
    (id) => {
      const task = tasks.find((t) => t.id === id);
      if (task?.workspaceId) {
        deleteTaskFromWorkspace(task.workspaceId, id);
      }
    },
    [tasks, deleteTaskFromWorkspace]
  );

  const addGoal = useCallback(
    (title, target = '30 Days') => {
      const days = parseInt(String(target).match(/\d+/)?.[0] || '30', 10);
      createGoal({
        title,
        description: '',
        targetDays: days,
        startDate: new Date().toISOString().split('T')[0],
        milestones: [],
      });
    },
    [createGoal]
  );

  const updateGoalProgress = useCallback(() => {}, []);

  const addNote = useCallback((text) => {
    const newNote = { id: Date.now(), text, time: 'Just now' };
    setNotes((prev) => [newNote, ...prev]);
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const startFocus = useCallback((minutes = 25) => {
    clearInterval(timerRef.current);
    const secs = minutes * 60;
    focusTickStore.focusTimeLeft = secs;
    focusTickStore.focusSessionTotal = secs;
    focusSessionTotalRef.current = secs;
    emitFocusTick();
    setIsFocusActive(true);
  }, []);

  const stopFocus = useCallback(() => {
    clearInterval(timerRef.current);
    setIsFocusActive(false);
  }, []);

  const resetFocus = useCallback(() => {
    clearInterval(timerRef.current);
    setIsFocusActive(false);
    focusTickStore.focusTimeLeft = 1500;
    focusTickStore.focusSessionTotal = 1500;
    focusSessionTotalRef.current = 1500;
    emitFocusTick();
  }, []);

  useEffect(() => {
    if (!isFocusActive) {
      clearInterval(timerRef.current);
      return undefined;
    }

    timerRef.current = setInterval(() => {
      const next = focusTickStore.focusTimeLeft - 1;
      if (next <= 0) {
        clearInterval(timerRef.current);
        setIsFocusActive(false);
        const sessionHours = Number((focusSessionTotalRef.current / 3600).toFixed(2));
        setFocusHours((prevHours) => Number((prevHours + sessionHours).toFixed(1)));
        setStreak((prevStreak) => prevStreak + 1);
        focusTickStore.focusTimeLeft = 0;
        emitFocusTick();
        return;
      }
      focusTickStore.focusTimeLeft = next;
      emitFocusTick();
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isFocusActive]);

  const value = useMemo(
    () => ({
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
      startFocus,
      stopFocus,
      resetFocus,
      tasksCompleted,
      totalTasks,
      progressPercentage,
    }),
    [
      streak,
      focusHours,
      tasks,
      goals,
      notes,
      isFocusActive,
      addTask,
      toggleTask,
      deleteTask,
      addGoal,
      updateGoalProgress,
      addNote,
      deleteNote,
      startFocus,
      stopFocus,
      resetFocus,
      tasksCompleted,
      totalTasks,
      progressPercentage,
    ]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
