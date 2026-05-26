import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import * as goalsApi from '../services/goalsApi.js';
import { clearLegacyGoalStorage } from '../utils/clearLegacyStorage.js';

const GoalsContext = createContext(null);

export const useGoals = () => {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error('useGoals must be used within GoalsProvider');
  return ctx;
};

export const GoalsProvider = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshGoals = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await goalsApi.fetchGoals();
      setGoals(data);
    } catch (err) {
      setError(err.parsed?.message || 'Failed to load goals');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      clearLegacyGoalStorage();
      refreshGoals();
    } else {
      setGoals([]);
      setError(null);
      clearLegacyGoalStorage();
    }
  }, [isAuthenticated, authLoading, refreshGoals]);

  const stats = useMemo(() => {
    const active = goals.filter((g) => !g.isCompleted).length;
    const completed = goals.filter((g) => g.isCompleted).length;
    const avgProgress =
      goals.length > 0
        ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)
        : 0;
    const maxStreak = goals.length > 0 ? Math.max(...goals.map((g) => g.streak)) : 0;
    const totalDaysLogged = goals.reduce((a, g) => a + g.daysCompleted, 0);
    return { active, completed, total: goals.length, avgProgress, maxStreak, totalDaysLogged };
  }, [goals]);

  const flatGoalsForDashboard = useMemo(
    () =>
      goals.map((g) => ({
        id: g.id,
        title: g.title,
        progress: g.progress,
        target: `${g.targetDays} Days`,
      })),
    [goals]
  );

  const weeklyTrend = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    if (!goals.length) {
      return days.map((day) => ({ day, consistency: 0, logged: 0 }));
    }
    return days.map((day, i) => ({
      day,
      consistency: Math.round(
        goals.reduce((sum, g) => sum + (g.streakHistory?.[i] || 0), 0) /
          Math.max(goals.length, 1) *
          100
      ),
      logged: goals.reduce((sum, g) => sum + (g.streakHistory?.[i] ? 1 : 0), 0),
    }));
  }, [goals]);

  const createGoal = useCallback(
    async (data) => {
      if (!isAuthenticated) return null;
      try {
        const goal = await goalsApi.createGoal({
          title: data.title,
          description: data.description,
          targetDays: Number(data.targetDays) || 30,
          startDate: data.startDate || new Date().toISOString().split('T')[0],
          milestones: (data.milestones || [])
            .filter((m) => m.title?.trim())
            .map((m) => ({
              title: m.title.trim(),
              targetDay: Number(m.targetDay) || undefined,
            })),
        });
        setGoals((prev) => [goal, ...prev]);
        return goal.id;
      } catch (err) {
        setError(err.parsed?.message || 'Failed to create goal');
        return null;
      }
    },
    [isAuthenticated]
  );

  const updateGoal = useCallback(
    async (id, updates) => {
      if (!isAuthenticated) return;
      try {
        const goal = await goalsApi.updateGoal(id, updates);
        setGoals((prev) => prev.map((g) => (g.id === id ? goal : g)));
      } catch (err) {
        setError(err.parsed?.message || 'Failed to update goal');
        refreshGoals();
      }
    },
    [isAuthenticated, refreshGoals]
  );

  const deleteGoal = useCallback(
    async (id) => {
      if (!isAuthenticated) return;
      try {
        await goalsApi.deleteGoal(id);
        setGoals((prev) => prev.filter((g) => g.id !== id));
      } catch (err) {
        setError(err.parsed?.message || 'Failed to delete goal');
      }
    },
    [isAuthenticated]
  );

  const logProgressDay = useCallback(
    async (id) => {
      if (!isAuthenticated) return;
      try {
        const goal = await goalsApi.logGoalDay(id);
        setGoals((prev) => prev.map((g) => (g.id === id ? goal : g)));
      } catch (err) {
        setError(err.parsed?.message || 'Failed to log progress');
      }
    },
    [isAuthenticated]
  );

  const toggleMilestone = useCallback(
    async (goalId, milestoneId) => {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal || !isAuthenticated) return;
      const milestones = goal.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      await updateGoal(goalId, { milestones });
    },
    [goals, isAuthenticated, updateGoal]
  );

  const addMilestone = useCallback(
    async (goalId, title, targetDay) => {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal || !isAuthenticated) return;
      const milestones = [
        ...goal.milestones,
        { title: title.trim(), completed: false, targetDay },
      ];
      await updateGoal(goalId, { milestones });
    },
    [goals, isAuthenticated, updateGoal]
  );

  const value = useMemo(
    () => ({
      goals,
      stats,
      weeklyTrend,
      flatGoalsForDashboard,
      loading,
      error,
      refreshGoals,
      createGoal,
      updateGoal,
      deleteGoal,
      logProgressDay,
      toggleMilestone,
      addMilestone,
    }),
    [
      goals,
      stats,
      weeklyTrend,
      flatGoalsForDashboard,
      loading,
      error,
      refreshGoals,
      createGoal,
      updateGoal,
      deleteGoal,
      logProgressDay,
      toggleMilestone,
      addMilestone,
    ]
  );

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
};
