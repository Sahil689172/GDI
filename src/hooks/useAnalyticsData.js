import { useMemo } from 'react';
import { useTasks } from '../context/TasksContext';
import { useGoals } from '../context/GoalsContext';
import { useDashboard } from '../context/DashboardContext';

const hashDay = (seed) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return Math.abs(h);
};

const formatDate = (d) => d.toISOString().split('T')[0];

function buildHeatmap(today, productivityScore, tasksCompleted) {
  const weeks = 12;
  const cells = [];
  for (let w = weeks - 1; w >= 0; w--) {
    for (let dow = 0; dow < 7; dow++) {
      const d = new Date(today);
      d.setDate(d.getDate() - w * 7 - (6 - dow));
      const key = formatDate(d);
      const h = hashDay(key);
      const base = Math.floor((productivityScore / 100) * 3);
      const level = Math.min(4, Math.max(0, base + (h % 3) - 1 + (tasksCompleted > 0 ? 1 : 0)));
      cells.push({ date: key, level, day: dow, week: weeks - 1 - w });
    }
  }
  return cells;
}

function buildInsights({
  productivityScore,
  streak,
  goalCompletionPct,
  highPriorityPending,
  focusHours,
  progressPercentage,
  totalTasks,
  tasksCompleted,
}) {
  const items = [];
  if (productivityScore >= 75) {
    items.push({
      id: 'peak',
      title: 'Peak flow detected',
      body: `Productivity score at ${productivityScore}%. Maintain your current rhythm.`,
      type: 'positive',
    });
  } else if (productivityScore < 50) {
    items.push({
      id: 'boost',
      title: 'Room to accelerate',
      body: 'Complete 2–3 high-priority tasks today to lift your score.',
      type: 'neutral',
    });
  }
  if (streak >= 7) {
    items.push({
      id: 'streak',
      title: `${streak}-day consistency`,
      body: 'Your streak is reinforcing long-term habit formation.',
      type: 'positive',
    });
  }
  if (highPriorityPending > 0) {
    items.push({
      id: 'priority',
      title: `${highPriorityPending} high-priority open`,
      body: 'Clear critical tasks first for maximum impact.',
      type: 'alert',
    });
  }
  if (goalCompletionPct >= 60) {
    items.push({
      id: 'goals',
      title: 'Goals on trajectory',
      body: `Average goal progress is ${goalCompletionPct}% across active objectives.`,
      type: 'positive',
    });
  }
  if (focusHours >= 20) {
    items.push({
      id: 'focus',
      title: 'Deep work invested',
      body: `${focusHours}h logged in focus sessions — strong depth metric.`,
      type: 'neutral',
    });
  }
  if (totalTasks > 0 && tasksCompleted === totalTasks) {
    items.push({
      id: 'tasks-done',
      title: 'Task ledger clear',
      body: 'All tracked tasks completed. Time to set new commits.',
      type: 'positive',
    });
  }
  return items.slice(0, 4);
}

function aggregateSeries(raw, period) {
  if (period === 'daily') {
    return {
      productivity: raw.map((r) => ({ label: r.label, value: r.prod })),
      completion: raw.map((r) => ({ label: r.label, completed: r.comp })),
      focus: raw.map((r) => ({ label: r.label, hours: r.focus })),
    };
  }

  if (period === 'weekly') {
    const chunk = 7;
    const prod = [];
    const comp = [];
    const focus = [];
    for (let i = 0; i < raw.length; i += chunk) {
      const slice = raw.slice(i, i + chunk);
      if (!slice.length) continue;
      const w = Math.floor(i / chunk) + 1;
      prod.push({
        label: `W${w}`,
        value: Math.round(slice.reduce((s, r) => s + r.prod, 0) / slice.length),
      });
      comp.push({
        label: `W${w}`,
        completed: Math.round(slice.reduce((s, r) => s + r.comp, 0) / slice.length),
      });
      focus.push({
        label: `W${w}`,
        hours: Number((slice.reduce((s, r) => s + r.focus, 0) / slice.length).toFixed(1)),
      });
    }
    return { productivity: prod, completion: comp, focus };
  }

  const months = new Map();
  raw.forEach((r) => {
    const m = r.date.slice(0, 7);
    if (!months.has(m)) months.set(m, []);
    months.get(m).push(r);
  });
  const keys = [...months.keys()].slice(-6);
  return {
    productivity: keys.map((m) => ({
      label: new Date(m + '-01').toLocaleDateString([], { month: 'short' }),
      value: Math.round(
        months.get(m).reduce((s, r) => s + r.prod, 0) / months.get(m).length
      ),
    })),
    completion: keys.map((m) => ({
      label: new Date(m + '-01').toLocaleDateString([], { month: 'short' }),
      completed: Math.round(
        months.get(m).reduce((s, r) => s + r.comp, 0) / months.get(m).length
      ),
    })),
    focus: keys.map((m) => ({
      label: new Date(m + '-01').toLocaleDateString([], { month: 'short' }),
      hours: Number(
        (months.get(m).reduce((s, r) => s + r.focus, 0) / months.get(m).length).toFixed(1)
      ),
    })),
  };
}

export const useAnalyticsData = (period = 'weekly') => {
  const { stats: taskStats, allTasks, workspaces } = useTasks();
  const { goals, stats: goalStats } = useGoals();
  const {
    focusHours,
    streak,
    progressPercentage,
    tasksCompleted,
    totalTasks,
  } = useDashboard();

  return useMemo(() => {
    const dayCount = period === 'daily' ? 7 : period === 'monthly' ? 180 : 56;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const goalCompletionPct = goalStats.avgProgress;
    const focusFactor = Math.min(100, Math.round((focusHours / 48) * 100));
    const productivityScore = Math.round(
      progressPercentage * 0.4 + goalCompletionPct * 0.35 + focusFactor * 0.25
    );

    const highPriorityPending = allTasks.filter(
      (t) => !t.completed && t.priority === 'high'
    ).length;

    const raw = [];
    for (let i = dayCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = formatDate(d);
      const noise = (hashDay(key) % 25) - 12;
      raw.push({
        date: key,
        label: d.toLocaleDateString([], { weekday: 'short' }),
        prod: Math.min(100, Math.max(8, productivityScore + noise)),
        comp: Math.max(
          0,
          Math.round(
            (tasksCompleted / Math.max(dayCount, 1)) *
              (0.5 + (hashDay(key + 'c') % 100) / 150)
          )
        ),
        focus: Math.max(0.1, focusHours / dayCount + ((hashDay(key + 'f') % 10) / 10) * 1.5),
      });
    }

    const series = aggregateSeries(raw, period);

    return {
      overview: {
        productivityScore,
        tasksCompleted,
        totalTasks,
        focusHours: Number(focusHours.toFixed(1)),
        goalCompletionPct,
        streak,
      },
      dailyProductivity: series.productivity,
      dailyCompletion: series.completion,
      focusTrend: series.focus,
      heatmap: buildHeatmap(today, productivityScore, tasksCompleted),
      insights: buildInsights({
        productivityScore,
        streak,
        goalCompletionPct,
        highPriorityPending,
        focusHours,
        progressPercentage,
        totalTasks,
        tasksCompleted,
      }),
      goals: goals.map((g) => ({
        id: g.id,
        title: g.title,
        progress: g.progress,
        streak: g.streak,
        daysCompleted: g.daysCompleted,
        targetDays: g.targetDays,
      })),
      taskInsights: {
        completed: tasksCompleted,
        pending: totalTasks - tasksCompleted,
        highPriority: highPriorityPending,
        workspaces: workspaces.length,
        completionRate: progressPercentage,
      },
      focusAnalytics: {
        totalHours: Number(focusHours.toFixed(1)),
        avgPerDay: Number((focusHours / 7).toFixed(1)),
        streak,
        sessionsEstimate: Math.max(1, Math.round(focusHours / 0.42)),
      },
    };
  }, [
    period,
    taskStats,
    allTasks,
    workspaces,
    goals,
    goalStats,
    focusHours,
    streak,
    progressPercentage,
    tasksCompleted,
    totalTasks,
  ]);
};
