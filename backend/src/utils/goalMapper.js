import {
  computeProgress,
  computeDeadline,
  computeDaysRemaining,
  isGoalOverdue,
} from './goalProgress.js';

export const toPublicGoal = (goal) => {
  const progress = computeProgress(goal.daysCompleted, goal.targetDays);
  const endDate = computeDeadline(goal.startDate, goal.targetDays);
  const status = goal.status ?? 'active';
  const isCompleted = status === 'completed' || goal.daysCompleted >= goal.targetDays;

  return {
    userId: goal.user,
    id: goal._id,
    title: goal.title,
    description: goal.description ?? '',
    category: goal.category ?? 'personal',
    targetDays: goal.targetDays,
    daysCompleted: goal.daysCompleted,
    startDate: goal.startDate,
    status,
    progress,
    isCompleted,
    completedAt: goal.completedAt ?? null,
    endDate,
    deadline: endDate,
    daysRemaining: computeDaysRemaining(
      goal.startDate,
      goal.targetDays,
      goal.daysCompleted
    ),
    isOverdue: isGoalOverdue(
      goal.startDate,
      goal.targetDays,
      goal.daysCompleted,
      status
    ),
    streak: goal.streak ?? 0,
    streakHistory: goal.streakHistory ?? [0, 0, 0, 0, 0, 0, 0],
    milestones: (goal.milestones ?? []).map((m) => ({
      id: m._id,
      title: m.title,
      completed: m.completed,
      targetDay: m.targetDay,
    })),
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
  };
};
