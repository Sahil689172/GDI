import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { Goal } from '../models/Goal.js';
import { FocusSession } from '../models/FocusSession.js';
import { Workspace } from '../models/Workspace.js';
import { User } from '../models/User.js';

const DATE_FMT = '%Y-%m-%d';

const toDate = (d) => new Date(d);

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const formatLabel = (date, granularity) => {
  if (granularity === 'month') {
    return date.toLocaleDateString('en-US', { month: 'short' });
  }
  if (granularity === 'week') {
    return `W${date.weekIndex}`;
  }
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const computeProductivityScore = ({ completionRate, goalCompletionPct, focusHours }) => {
  const focusFactor = focusHours > 0 ? Math.min(100, Math.round((focusHours / 48) * 100)) : 0;
  if (completionRate + goalCompletionPct + focusFactor === 0) return 0;
  return Math.round(completionRate * 0.4 + goalCompletionPct * 0.35 + focusFactor * 0.25);
};

const buildTimeRange = (days) => {
  const today = startOfDay(new Date());
  const from = addDays(today, -(days - 1));
  const to = addDays(today, 1); // exclusive upper bound
  return { from, to, today };
};

const mapSeries = (days, byDay, mapper) => {
  const { from } = buildTimeRange(days);
  const out = [];
  for (let i = 0; i < days; i++) {
    const d = addDays(from, i);
    const key = d.toISOString().slice(0, 10);
    out.push(mapper(d, byDay[key] ?? 0));
  }
  return out;
};

const aggregateCountsByDay = async ({ collection, match, dateField, valueField = null }) => {
  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: DATE_FMT, date: `$${dateField}` } },
        value: valueField ? { $sum: `$${valueField}` } : { $sum: 1 },
      },
    },
    { $project: { _id: 0, date: '$_id', value: 1 } },
    { $sort: { date: 1 } },
  ];
  return collection.aggregate(pipeline);
};

const listToMap = (rows) => {
  const m = {};
  rows.forEach((r) => {
    m[r.date] = r.value;
  });
  return m;
};

export const computeAnalytics = async (userId, period) => {
  const uid = new mongoose.Types.ObjectId(userId);

  const periodConfig =
    period === 'daily'
      ? { days: 7, kind: 'day' }
      : period === 'monthly'
        ? { days: 180, kind: 'month' }
        : { days: 56, kind: 'week' };

  const { from, to, today } = buildTimeRange(periodConfig.days);

  const [totalTasks, completedTasks, workspaceCount, goals, user, createdByDayRows, completedByDayRows, focusByDayRows, goalsCompletedByDayRows] =
    await Promise.all([
      Task.countDocuments({ user: uid }),
      Task.countDocuments({ user: uid, completed: true }),
      Workspace.countDocuments({ user: uid }),
      Goal.find({ user: uid, status: { $ne: 'archived' } }).select('progress status category targetDays daysCompleted streak title'),
      User.findById(uid).select('streak'),
      aggregateCountsByDay({
        collection: Task,
        match: { user: uid, createdAt: { $gte: from, $lt: to } },
        dateField: 'createdAt',
      }),
      aggregateCountsByDay({
        collection: Task,
        match: { user: uid, completed: true, completedAt: { $gte: from, $lt: to } },
        dateField: 'completedAt',
      }),
      aggregateCountsByDay({
        collection: FocusSession,
        match: { user: uid, phase: 'work', completedAt: { $gte: from, $lt: to } },
        dateField: 'completedAt',
        valueField: 'minutes',
      }),
      aggregateCountsByDay({
        collection: Goal,
        match: { user: uid, status: 'completed', completedAt: { $gte: from, $lt: to } },
        dateField: 'completedAt',
      }),
    ]);

  const createdByDay = listToMap(await createdByDayRows);
  const completedByDay = listToMap(await completedByDayRows);
  const focusMinutesByDay = listToMap(await focusByDayRows);
  const goalsCompletedByDay = listToMap(await goalsCompletedByDayRows);

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const goalCompletionPct =
    goals.length > 0
      ? Math.round(goals.reduce((a, g) => a + (g.progress ?? 0), 0) / goals.length)
      : 0;
  const focusMinutesTotal = Object.values(focusMinutesByDay).reduce((a, n) => a + n, 0);
  const focusHoursTotal = Number((focusMinutesTotal / 60).toFixed(1));
  const productivityScore = computeProductivityScore({
    completionRate,
    goalCompletionPct,
    focusHours: focusHoursTotal,
  });

  const hasData =
    totalTasks > 0 ||
    goals.length > 0 ||
    Object.keys(focusMinutesByDay).length > 0 ||
    Object.keys(goalsCompletedByDay).length > 0;

  // Daily series (7 days) for charts even when period is weekly/monthly (UI can still use)
  const dailyCompleted = mapSeries(7, completedByDay, (d, v) => ({
    label: d.toLocaleDateString('en-US', { weekday: 'short' }),
    completed: v,
  }));
  const dailyProductivity = mapSeries(7, completedByDay, (d, v) => ({
    label: d.toLocaleDateString('en-US', { weekday: 'short' }),
    value: v === 0 ? 0 : Math.min(100, Math.round((v / Math.max(1, completedTasks)) * 100)),
  }));
  const focusTrend = mapSeries(7, focusMinutesByDay, (d, v) => ({
    label: d.toLocaleDateString('en-US', { weekday: 'short' }),
    hours: Number((v / 60).toFixed(1)),
  }));

  const categoryWise = goals.reduce((acc, g) => {
    const cat = g.category || 'other';
    acc[cat] = acc[cat] || { total: 0, avgProgress: 0, completed: 0 };
    acc[cat].total += 1;
    acc[cat].avgProgress += g.progress ?? 0;
    if (g.status === 'completed') acc[cat].completed += 1;
    return acc;
  }, {});
  Object.keys(categoryWise).forEach((k) => {
    categoryWise[k].avgProgress = categoryWise[k].total
      ? Math.round(categoryWise[k].avgProgress / categoryWise[k].total)
      : 0;
  });

  // Heatmap cells (12 weeks)
  const heatmap = [];
  for (let w = 11; w >= 0; w--) {
    for (let dow = 0; dow < 7; dow++) {
      const d = new Date(today);
      d.setDate(d.getDate() - w * 7 - (6 - dow));
      const key = d.toISOString().slice(0, 10);
      const comp = completedByDay[key] || 0;
      const foc = focusMinutesByDay[key] || 0;
      const level = comp + foc === 0 ? 0 : Math.min(4, Math.ceil((comp + foc / 30) / 2));
      heatmap.push({ date: key, level, day: dow, week: 11 - w });
    }
  }

  const streak = user?.streak ?? 0;

  return {
    period,
    hasData,
    overview: {
      dateFrom: from.toISOString().slice(0, 10),
      dateTo: addDays(to, -1).toISOString().slice(0, 10),
      productivityScore,
      streak,
      totalTasks,
      completedTasks,
      createdTasks: Object.values(createdByDay).reduce((a, n) => a + n, 0),
      goalCompletionPct,
      completedGoals: Object.values(goalsCompletedByDay).reduce((a, n) => a + n, 0),
      focusMinutes: focusMinutesTotal,
      focusHours: focusHoursTotal,
      workspaceCount,
    },
    series: {
      dailyProductivity,
      dailyCompletion: dailyCompleted,
      focusTrend,
    },
    heatmap,
    categoryWise,
    taskHistory: {
      createdByDay,
      completedByDay,
    },
    goalHistory: {
      completedByDay: goalsCompletedByDay,
    },
  };
};

