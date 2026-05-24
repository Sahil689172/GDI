import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

const STORAGE_KEY = 'gdi-goals-v1';

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

const DEFAULT_GOALS = [
  {
    id: 'goal-ml',
    title: 'Learn Machine Learning',
    description: 'Complete structured ML curriculum with daily practice and projects.',
    targetDays: 90,
    daysCompleted: 32,
    startDate: daysAgo(32),
    streak: 14,
    streakHistory: [1, 1, 1, 1, 0, 1, 1],
    milestones: [
      { id: 'm1', title: 'Linear algebra foundations', completed: true, targetDay: 14 },
      { id: 'm2', title: 'Supervised learning module', completed: true, targetDay: 30 },
      { id: 'm3', title: 'Neural networks deep dive', completed: false, targetDay: 60 },
      { id: 'm4', title: 'Capstone project', completed: false, targetDay: 90 },
    ],
  },
  {
    id: 'goal-academic',
    title: 'Academic Goals',
    description: 'Maintain excellence across coursework and exam preparation.',
    targetDays: 120,
    daysCompleted: 82,
    startDate: daysAgo(82),
    streak: 30,
    streakHistory: [1, 1, 1, 1, 1, 1, 1],
    milestones: [
      { id: 'm1', title: 'Midterm preparation', completed: true, targetDay: 40 },
      { id: 'm2', title: 'Research paper draft', completed: true, targetDay: 70 },
      { id: 'm3', title: 'Final review sprint', completed: false, targetDay: 110 },
    ],
  },
  {
    id: 'goal-react',
    title: 'React Learning',
    description: 'Master modern React patterns, hooks, and performance optimization.',
    targetDays: 60,
    daysCompleted: 27,
    startDate: daysAgo(27),
    streak: 9,
    streakHistory: [1, 0, 1, 1, 1, 0, 1],
    milestones: [
      { id: 'm1', title: 'Hooks mastery', completed: true, targetDay: 15 },
      { id: 'm2', title: 'State architecture', completed: false, targetDay: 35 },
      { id: 'm3', title: 'Production deployment', completed: false, targetDay: 60 },
    ],
  },
  {
    id: 'goal-fitness',
    title: 'Fitness Goals',
    description: 'Build consistent training habit and track weekly milestones.',
    targetDays: 90,
    daysCompleted: 74,
    startDate: daysAgo(74),
    streak: 21,
    streakHistory: [1, 1, 1, 1, 1, 0, 1],
    milestones: [
      { id: 'm1', title: '5K baseline', completed: true, targetDay: 21 },
      { id: 'm2', title: 'Strength block', completed: true, targetDay: 45 },
      { id: 'm3', title: '10K challenge', completed: false, targetDay: 90 },
    ],
  },
];

const computeProgress = (goal) => {
  if (!goal.targetDays) return 0;
  return Math.min(100, Math.round((goal.daysCompleted / goal.targetDays) * 100));
};

const enrichGoal = (goal) => ({
  ...goal,
  progress: computeProgress(goal),
  isCompleted: goal.daysCompleted >= goal.targetDays,
  endDate: (() => {
    const start = new Date(goal.startDate);
    start.setDate(start.getDate() + goal.targetDays);
    return start.toISOString().split('T')[0];
  })(),
});

const loadGoals = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored).map(enrichGoal);
  } catch {
    /* defaults */
  }
  return DEFAULT_GOALS.map(enrichGoal);
};

const GoalsContext = createContext();

export const useGoals = () => {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error('useGoals must be used within GoalsProvider');
  return ctx;
};

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState(loadGoals);

  useEffect(() => {
    const raw = goals.map(({ progress, isCompleted, endDate, ...g }) => g);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
  }, [goals]);

  const setGoalsEnriched = useCallback((updater) => {
    setGoals((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next.map(enrichGoal);
    });
  }, []);

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
    return days.map((day, i) => ({
      day,
      consistency: Math.round(
        goals.reduce((sum, g) => sum + (g.streakHistory[i] || 0), 0) / Math.max(goals.length, 1) * 100
      ),
      logged: goals.reduce((sum, g) => sum + (g.streakHistory[i] ? 1 : 0), 0),
    }));
  }, [goals]);

  const createGoal = useCallback((data) => {
    const newGoal = enrichGoal({
      id: generateId(),
      title: data.title.trim(),
      description: data.description?.trim() || '',
      targetDays: Number(data.targetDays) || 30,
      daysCompleted: 0,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      streak: 0,
      streakHistory: [0, 0, 0, 0, 0, 0, 0],
      milestones: (data.milestones || [])
        .filter((m) => m.title?.trim())
        .map((m) => ({
          id: generateId(),
          title: m.title.trim(),
          completed: false,
          targetDay: Number(m.targetDay) || undefined,
        })),
    });
    setGoalsEnriched((prev) => [...prev, newGoal]);
    return newGoal.id;
  }, [setGoalsEnriched]);

  const updateGoal = useCallback(
    (id, updates) => {
      setGoalsEnriched((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
      );
    },
    [setGoalsEnriched]
  );

  const deleteGoal = useCallback(
    (id) => {
      setGoalsEnriched((prev) => prev.filter((g) => g.id !== id));
    },
    [setGoalsEnriched]
  );

  const logProgressDay = useCallback(
    (id) => {
      setGoalsEnriched((prev) =>
        prev.map((g) => {
          if (g.id !== id || g.daysCompleted >= g.targetDays) return g;
          const history = [...g.streakHistory.slice(1), 1];
          return {
            ...g,
            daysCompleted: g.daysCompleted + 1,
            streak: g.streak + 1,
            streakHistory: history,
          };
        })
      );
    },
    [setGoalsEnriched]
  );

  const toggleMilestone = useCallback(
    (goalId, milestoneId) => {
      setGoalsEnriched((prev) =>
        prev.map((g) => {
          if (g.id !== goalId) return g;
          return {
            ...g,
            milestones: g.milestones.map((m) =>
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            ),
          };
        })
      );
    },
    [setGoalsEnriched]
  );

  const addMilestone = useCallback(
    (goalId, title, targetDay) => {
      setGoalsEnriched((prev) =>
        prev.map((g) => {
          if (g.id !== goalId) return g;
          return {
            ...g,
            milestones: [
              ...g.milestones,
              { id: generateId(), title: title.trim(), completed: false, targetDay },
            ],
          };
        })
      );
    },
    [setGoalsEnriched]
  );

  const value = {
    goals,
    stats,
    weeklyTrend,
    flatGoalsForDashboard,
    createGoal,
    updateGoal,
    deleteGoal,
    logProgressDay,
    toggleMilestone,
    addMilestone,
  };

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
};
