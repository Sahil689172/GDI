const computeProgress = (goal) => {
  if (!goal.targetDays) return 0;
  return Math.min(100, Math.round((goal.daysCompleted / goal.targetDays) * 100));
};

export const toPublicGoal = (goal) => {
  const progress = computeProgress(goal);
  const start = new Date(goal.startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + goal.targetDays);

  return {
    id: goal._id,
    title: goal.title,
    description: goal.description ?? '',
    targetDays: goal.targetDays,
    daysCompleted: goal.daysCompleted,
    startDate: goal.startDate,
    streak: goal.streak ?? 0,
    streakHistory: goal.streakHistory ?? [0, 0, 0, 0, 0, 0, 0],
    milestones: (goal.milestones ?? []).map((m) => ({
      id: m._id,
      title: m.title,
      completed: m.completed,
      targetDay: m.targetDay,
    })),
    progress,
    isCompleted: goal.daysCompleted >= goal.targetDays,
    endDate: end.toISOString().split('T')[0],
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
  };
};
