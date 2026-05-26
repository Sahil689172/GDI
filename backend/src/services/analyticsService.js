import { Task } from '../models/Task.js';
import { Goal } from '../models/Goal.js';
import { FocusSession } from '../models/FocusSession.js';
import { Workspace } from '../models/Workspace.js';
import { User } from '../models/User.js';
import { toPublicGoal } from '../utils/goalMapper.js';

const formatDate = (d) => d.toISOString().split('T')[0];

const emptySeries = (period) => {
  if (period === 'daily') {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        value: 0,
        completed: 0,
        hours: 0,
        date: formatDate(d),
      };
    });
  }
  if (period === 'monthly') {
    return [];
  }
  return Array.from({ length: 8 }, (_, i) => ({
    label: `W${i + 1}`,
    value: 0,
    completed: 0,
    hours: 0,
  }));
};

export const getAnalytics = async (userId, period = 'weekly') => {
  const [tasks, goalsRaw, focusSessions, user, workspaceCount] = await Promise.all([
    Task.find({ user: userId }),
    Goal.find({ user: userId }),
    FocusSession.find({ user: userId, phase: 'work' }),
    User.findById(userId).select('streak'),
    Workspace.countDocuments({ user: userId }),
  ]);

  const goals = goalsRaw.map(toPublicGoal).filter((g) => g.status !== 'archived');
  const totalTasks = tasks.length;
  const tasksCompleted = tasks.filter((t) => t.completed).length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

  const goalCompletionPct =
    goals.length > 0
      ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)
      : 0;

  const focusMinutes = focusSessions.reduce((a, s) => a + s.minutes, 0);
  const focusHours = Number((focusMinutes / 60).toFixed(1));
  const focusFactor = focusHours > 0 ? Math.min(100, Math.round((focusHours / 48) * 100)) : 0;

  const productivityScore =
    totalTasks + goals.length + focusSessions.length === 0
      ? 0
      : Math.round(
          progressPercentage * 0.4 + goalCompletionPct * 0.35 + focusFactor * 0.25
        );

  const highPriorityPending = tasks.filter(
    (t) => !t.completed && t.priority === 'high'
  ).length;

  const streak = user?.streak ?? 0;
  const dayCount = period === 'daily' ? 7 : period === 'monthly' ? 90 : 56;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasksByDay = {};
  tasks.forEach((t) => {
    if (!t.completed || !t.completedAt) return;
    const key = formatDate(t.completedAt);
    tasksByDay[key] = (tasksByDay[key] || 0) + 1;
  });

  const focusByDay = {};
  focusSessions.forEach((s) => {
    const key = formatDate(s.completedAt);
    focusByDay[key] = (focusByDay[key] || 0) + s.minutes;
  });

  const raw = [];
  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = formatDate(d);
    const completedThatDay = tasksByDay[key] || 0;
    const focusMin = focusByDay[key] || 0;
    const hasActivity = completedThatDay > 0 || focusMin > 0;
    raw.push({
      date: key,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      prod: hasActivity
        ? Math.min(100, Math.round(progressPercentage * (completedThatDay / Math.max(tasksCompleted, 1)) + focusMin / 6))
        : 0,
      comp: completedThatDay,
      focus: Number((focusMin / 60).toFixed(1)),
    });
  }

  const hasAnyData = totalTasks > 0 || goals.length > 0 || focusSessions.length > 0;

  const aggregateSeries = (rows, p) => {
    if (!rows.length) return emptySeries(p);
    if (p === 'daily') {
      return {
        productivity: rows.map((r) => ({ label: r.label, value: r.prod })),
        completion: rows.map((r) => ({ label: r.label, completed: r.comp })),
        focus: rows.map((r) => ({ label: r.label, hours: r.focus })),
      };
    }
    if (p === 'weekly') {
      const chunk = 7;
      const prod = [];
      const comp = [];
      const focus = [];
      for (let i = 0; i < rows.length; i += chunk) {
        const slice = rows.slice(i, i + chunk);
        if (!slice.length) continue;
        const w = Math.floor(i / chunk) + 1;
        prod.push({
          label: `W${w}`,
          value: Math.round(slice.reduce((s, r) => s + r.prod, 0) / slice.length),
        });
        comp.push({
          label: `W${w}`,
          completed: slice.reduce((s, r) => s + r.comp, 0),
        });
        focus.push({
          label: `W${w}`,
          hours: Number((slice.reduce((s, r) => s + r.focus, 0)).toFixed(1)),
        });
      }
      return { productivity: prod, completion: comp, focus };
    }
    const months = new Map();
    rows.forEach((r) => {
      const m = r.date.slice(0, 7);
      if (!months.has(m)) months.set(m, []);
      months.get(m).push(r);
    });
    const keys = [...months.keys()].slice(-6);
    return {
      productivity: keys.map((m) => ({
        label: new Date(`${m}-01`).toLocaleDateString('en-US', { month: 'short' }),
        value: Math.round(
          months.get(m).reduce((s, r) => s + r.prod, 0) / months.get(m).length
        ),
      })),
      completion: keys.map((m) => ({
        label: new Date(`${m}-01`).toLocaleDateString('en-US', { month: 'short' }),
        completed: months.get(m).reduce((s, r) => s + r.comp, 0),
      })),
      focus: keys.map((m) => ({
        label: new Date(`${m}-01`).toLocaleDateString('en-US', { month: 'short' }),
        hours: Number(months.get(m).reduce((s, r) => s + r.focus, 0).toFixed(1)),
      })),
    };
  };

  const series = aggregateSeries(raw, period);

  const heatmapCells = [];
  for (let w = 11; w >= 0; w--) {
    for (let dow = 0; dow < 7; dow++) {
      const d = new Date(today);
      d.setDate(d.getDate() - w * 7 - (6 - dow));
      const key = formatDate(d);
      const comp = tasksByDay[key] || 0;
      const foc = focusByDay[key] || 0;
      const level =
        comp + foc === 0 ? 0 : Math.min(4, Math.ceil((comp + foc / 30) / 2));
      heatmapCells.push({ date: key, level, day: dow, week: 11 - w });
    }
  }

  const insights = [];
  if (!hasAnyData) {
    insights.push({
      id: 'empty',
      title: 'No analytics yet',
      body: 'Complete tasks, log goals, or finish a focus session to see insights.',
      type: 'neutral',
    });
  } else {
    if (productivityScore >= 75) {
      insights.push({
        id: 'peak',
        title: 'Strong productivity',
        body: `Score at ${productivityScore}% from your real activity.`,
        type: 'positive',
      });
    }
    if (highPriorityPending > 0) {
      insights.push({
        id: 'priority',
        title: `${highPriorityPending} high-priority open`,
        body: 'Clear critical tasks first.',
        type: 'alert',
      });
    }
    if (streak >= 7) {
      insights.push({
        id: 'streak',
        title: `${streak}-day streak`,
        body: 'Consistency is building.',
        type: 'positive',
      });
    }
  }

  return {
    hasData: hasAnyData,
    overview: {
      productivityScore,
      tasksCompleted,
      totalTasks,
      focusHours,
      goalCompletionPct,
      streak,
    },
    dailyProductivity: series.productivity,
    dailyCompletion: series.completion,
    focusTrend: series.focus,
    heatmap: heatmapCells,
    insights: insights.slice(0, 4),
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
      workspaces: workspaceCount,
      completionRate: progressPercentage,
    },
    focusAnalytics: {
      totalHours: focusHours,
      avgPerDay: focusSessions.length
        ? Number((focusHours / Math.max(1, new Set(focusSessions.map((s) => formatDate(s.completedAt))).size)).toFixed(1))
        : 0,
      streak,
      sessionsEstimate: focusSessions.length,
    },
  };
};
