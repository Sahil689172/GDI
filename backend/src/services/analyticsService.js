import { computeAnalytics } from '../utils/analyticsEngine.js';

export const getAnalytics = async (userId, period = 'weekly') => {
  // Backwards-compatible payload used by the current frontend Analytics page.
  const result = await computeAnalytics(userId, period);
  return {
    hasData: result.hasData,
    overview: {
      productivityScore: result.overview.productivityScore,
      tasksCompleted: result.overview.completedTasks,
      totalTasks: result.overview.totalTasks,
      focusHours: result.overview.focusHours,
      goalCompletionPct: result.overview.goalCompletionPct,
      streak: result.overview.streak,
    },
    dailyProductivity: result.series.dailyProductivity,
    dailyCompletion: result.series.dailyCompletion,
    focusTrend: result.series.focusTrend,
    heatmap: result.heatmap,
    insights: result.hasData
      ? []
      : [
          {
            id: 'empty',
            title: 'No analytics available',
            body: 'Complete tasks, goals, or focus sessions to see your metrics.',
            type: 'neutral',
          },
        ],
    goals: [],
    taskInsights: {
      completed: result.overview.completedTasks,
      pending: result.overview.totalTasks - result.overview.completedTasks,
      highPriority: 0,
      workspaces: result.overview.workspaceCount,
      completionRate:
        result.overview.totalTasks > 0
          ? Math.round((result.overview.completedTasks / result.overview.totalTasks) * 100)
          : 0,
    },
    focusAnalytics: {
      totalHours: result.overview.focusHours,
      avgPerDay: result.overview.focusHours, // UI uses this lightly; detailed stats are on /api/focus/stats
      streak: result.overview.streak,
      sessionsEstimate: 0,
    },
  };
};

// Endpoints should return the same shape as getAnalytics() (frontend expects it)
export const getDailyAnalytics = (userId) => getAnalytics(userId, 'daily');
export const getWeeklyAnalytics = (userId) => getAnalytics(userId, 'weekly');
export const getMonthlyAnalytics = (userId) => getAnalytics(userId, 'monthly');

export const getHeatmap = async (userId) => {
  const result = await computeAnalytics(userId, 'weekly');
  return result.heatmap;
};
