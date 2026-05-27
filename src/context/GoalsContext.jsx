import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { useSync } from './SyncContext';
import * as goalsApi from '../services/goalsApi.js';
import { clearLegacyGoalStorage } from '../utils/clearLegacyStorage.js';
import { cacheGet, cacheSet } from '../utils/offlineCache.js';
const GoalsContext = createContext(null);

export const useGoals = () => {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error('useGoals must be used within GoalsProvider');
  return ctx;
};

export const GoalsProvider = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isOnline, enqueue, registerIdMapHandler } = useSync();
  const [goals, setGoals] = useState([]);
  const [goalAnalytics, setGoalAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const CACHE_KEY = 'gdi_cache_goals_v1';

  useEffect(() => {
    return registerIdMapHandler((idMap) => {
      setGoals((prev) => prev.map((g) => ({ ...g, id: idMap[g.id] || g.id })));
    });
  }, [registerIdMapHandler]);

  const refreshGoals = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const { goals: data, analytics } = await goalsApi.fetchGoals({
        includeArchived: 'true',
      });
      setGoals(data);
      setGoalAnalytics(analytics);
      cacheSet(CACHE_KEY, { goals: data, analytics });
    } catch (err) {
      setError(err.parsed?.message || 'Failed to load goals');
      const cached = cacheGet(CACHE_KEY, null);
      setGoals(cached?.goals ?? []);
      setGoalAnalytics(cached?.analytics ?? null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, CACHE_KEY]);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      clearLegacyGoalStorage();
      refreshGoals();
    } else {
      setGoals([]);
      setGoalAnalytics(null);
      setError(null);
      clearLegacyGoalStorage();
    }
  }, [isAuthenticated, authLoading, refreshGoals]);

  useEffect(() => {
    const onPulled = () => refreshGoals();
    window.addEventListener('gdi:sync:pulled', onPulled);
    return () => window.removeEventListener('gdi:sync:pulled', onPulled);
  }, [refreshGoals]);

  const stats = useMemo(() => {
    if (goalAnalytics) {
      return {
        active: goalAnalytics.active,
        completed: goalAnalytics.completed,
        archived: goalAnalytics.archived,
        total: goalAnalytics.total,
        avgProgress: goalAnalytics.avgProgress,
        maxStreak: goalAnalytics.maxStreak,
        totalDaysLogged: goalAnalytics.totalDaysLogged ?? 0,
      };
    }
    const active = goals.filter((g) => g.status === 'active').length;
    const completed = goals.filter((g) => g.status === 'completed').length;
    const archived = goals.filter((g) => g.status === 'archived').length;
    const avgProgress =
      goals.length > 0
        ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)
        : 0;
    return {
      active,
      completed,
      archived,
      total: goals.length,
      avgProgress,
      maxStreak: goals.length ? Math.max(...goals.map((g) => g.streak)) : 0,
      totalDaysLogged: goals.reduce((a, g) => a + g.daysCompleted, 0),
    };
  }, [goals, goalAnalytics]);

  const flatGoalsForDashboard = useMemo(
    () =>
      goals
        .filter((g) => g.status !== 'archived')
        .map((g) => ({
          id: g.id,
          title: g.title,
          progress: g.progress,
          target: `${g.targetDays} Days`,
        })),
    [goals]
  );

  const weeklyTrend = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activeGoals = goals.filter((g) => g.status !== 'archived');
    if (!activeGoals.length) {
      return days.map((day) => ({ day, consistency: 0, logged: 0 }));
    }
    return days.map((day, i) => ({
      day,
      consistency: Math.round(
        activeGoals.reduce((sum, g) => sum + (g.streakHistory?.[i] || 0), 0) /
          activeGoals.length *
          100
      ),
      logged: activeGoals.reduce((sum, g) => sum + (g.streakHistory?.[i] ? 1 : 0), 0),
    }));
  }, [goals]);

  const createGoal = useCallback(
    async (data) => {
      if (!isAuthenticated) return null;
      if (!isOnline) {
        const clientId = `tmp_goal_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        const optimistic = {
          id: clientId,
          title: data.title,
          description: data.description ?? '',
          category: data.category || 'personal',
          targetDays: Number(data.targetDays) || 30,
          daysCompleted: 0,
          startDate: data.startDate || new Date().toISOString().split('T')[0],
          status: 'active',
          progress: 0,
          isCompleted: false,
          streak: 0,
          streakHistory: [0, 0, 0, 0, 0, 0, 0],
          milestones: (data.milestones || [])
            .filter((m) => m.title?.trim())
            .map((m) => ({
              id: `tmp_ms_${Date.now()}_${Math.random().toString(16).slice(2)}`,
              title: m.title.trim(),
              completed: false,
              targetDay: m.targetDay ? Number(m.targetDay) : null,
            })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setGoals((prev) => [optimistic, ...prev]);
        enqueue({
          entity: 'goal',
          op: 'upsert',
          clientId,
          data: {
            title: optimistic.title,
            description: optimistic.description,
            category: optimistic.category,
            targetDays: optimistic.targetDays,
            startDate: optimistic.startDate,
            milestones: optimistic.milestones.map((m) => ({
              title: m.title,
              completed: m.completed,
              targetDay: m.targetDay,
            })),
          },
        });
        return clientId;
      }
      try {
        const goal = await goalsApi.createGoal({
          title: data.title,
          description: data.description,
          category: data.category || 'personal',
          targetDays: Number(data.targetDays) || 30,
          startDate: data.startDate || new Date().toISOString().split('T')[0],
          milestones: (data.milestones || [])
            .filter((m) => m.title?.trim())
            .map((m) => ({
              title: m.title.trim(),
              targetDay: m.targetDay ? Number(m.targetDay) : undefined,
            })),
        });
        setGoals((prev) => [goal, ...prev]);
        await refreshGoals();
        return goal.id;
      } catch (err) {
        setError(err.parsed?.message || 'Failed to create goal');
        return null;
      }
    },
    [isAuthenticated, refreshGoals, isOnline, enqueue]
  );

  const updateGoal = useCallback(
    async (id, updates) => {
      if (!isAuthenticated) return;
      if (!isOnline) {
        setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g)));
        enqueue({ entity: 'goal', op: 'upsert', id, data: updates });
        return;
      }
      try {
        const goal = await goalsApi.updateGoal(id, updates);
        setGoals((prev) => prev.map((g) => (g.id === id ? goal : g)));
        await refreshGoals();
      } catch (err) {
        setError(err.parsed?.message || 'Failed to update goal');
        refreshGoals();
      }
    },
    [isAuthenticated, refreshGoals, isOnline, enqueue]
  );

  const deleteGoal = useCallback(
    async (id) => {
      if (!isAuthenticated) return;
      if (!isOnline) {
        setGoals((prev) => prev.filter((g) => g.id !== id));
        enqueue({ entity: 'goal', op: 'delete', id });
        return;
      }
      try {
        await goalsApi.deleteGoal(id);
        setGoals((prev) => prev.filter((g) => g.id !== id));
        await refreshGoals();
      } catch (err) {
        setError(err.parsed?.message || 'Failed to delete goal');
      }
    },
    [isAuthenticated, refreshGoals, isOnline, enqueue]
  );

  const archiveGoal = useCallback(
    async (id) => {
      if (!isAuthenticated) return;
      try {
        const goal = await goalsApi.archiveGoal(id);
        setGoals((prev) => prev.map((g) => (g.id === id ? goal : g)));
        await refreshGoals();
      } catch (err) {
        setError(err.parsed?.message || 'Failed to archive goal');
      }
    },
    [isAuthenticated, refreshGoals]
  );

  const logProgressDay = useCallback(
    async (id) => {
      if (!isAuthenticated) return;
      if (!isOnline) {
        setGoals((prev) =>
          prev.map((g) =>
            g.id === id
              ? { ...g, daysCompleted: (g.daysCompleted ?? 0) + 1, updatedAt: new Date().toISOString() }
              : g
          )
        );
        enqueue({ entity: 'goal', op: 'upsert', id, data: { $op: 'logDay' } });
        return;
      }
      try {
        const goal = await goalsApi.logGoalDay(id);
        setGoals((prev) => prev.map((g) => (g.id === id ? goal : g)));
        await refreshGoals();
      } catch (err) {
        setError(err.parsed?.message || 'Failed to log progress');
      }
    },
    [isAuthenticated, refreshGoals, isOnline, enqueue]
  );

  const toggleMilestone = useCallback(
    async (goalId, milestoneId) => {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal || !isAuthenticated) return;
      const milestones = goal.milestones.map((m) =>
        m.id === milestoneId
          ? { id: m.id, title: m.title, completed: !m.completed, targetDay: m.targetDay }
          : { id: m.id, title: m.title, completed: m.completed, targetDay: m.targetDay }
      );
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
      goalAnalytics,
      loading,
      error,
      refreshGoals,
      createGoal,
      updateGoal,
      deleteGoal,
      archiveGoal,
      logProgressDay,
      toggleMilestone,
    }),
    [
      goals,
      stats,
      weeklyTrend,
      flatGoalsForDashboard,
      goalAnalytics,
      loading,
      error,
      refreshGoals,
      createGoal,
      updateGoal,
      deleteGoal,
      archiveGoal,
      logProgressDay,
      toggleMilestone,
    ]
  );

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
};
