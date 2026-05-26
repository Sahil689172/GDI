export const emptyAnalytics = {
  hasData: false,
  overview: {
    productivityScore: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    focusHours: 0,
    goalCompletionPct: 0,
    streak: 0,
  },
  dailyProductivity: [],
  dailyCompletion: [],
  focusTrend: [],
  heatmap: [],
  insights: [
    {
      id: 'empty',
      title: 'No analytics available',
      body: 'Complete tasks, goals, or focus sessions to see your metrics.',
      type: 'neutral',
    },
  ],
  goals: [],
  taskInsights: {
    completed: 0,
    pending: 0,
    highPriority: 0,
    workspaces: 0,
    completionRate: 0,
  },
  focusAnalytics: {
    totalHours: 0,
    avgPerDay: 0,
    streak: 0,
    sessionsEstimate: 0,
  },
};
