export const GOAL_STATUSES = ['active', 'completed', 'archived'];
export const GOAL_CATEGORIES = [
  'personal',
  'academic',
  'career',
  'health',
  'learning',
  'project',
  'other',
];

export const computeProgress = (daysCompleted, targetDays) => {
  if (!targetDays || targetDays < 1) return 0;
  return Math.min(100, Math.round((daysCompleted / targetDays) * 100));
};

export const computeDeadline = (startDate, targetDays) => {
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setDate(end.getDate() + Number(targetDays));
  return end.toISOString().split('T')[0];
};

export const computeDaysRemaining = (startDate, targetDays, daysCompleted) => {
  const deadline = computeDeadline(startDate, targetDays);
  if (!deadline) return 0;
  const end = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const remaining = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  const workLeft = Math.max(0, targetDays - daysCompleted);
  return Math.max(0, Math.min(remaining, workLeft));
};

export const isGoalOverdue = (startDate, targetDays, daysCompleted, status) => {
  if (status === 'completed' || status === 'archived') return false;
  const deadline = computeDeadline(startDate, targetDays);
  if (!deadline) return false;
  const end = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return today > end && daysCompleted < targetDays;
};

/** Sync status + completedAt from progress (respects archived) */
export const applyGoalCompletionState = (goal) => {
  const done = goal.daysCompleted >= goal.targetDays;
  if (goal.status === 'archived') return goal;
  if (done) {
    goal.status = 'completed';
    if (!goal.completedAt) goal.completedAt = new Date();
  } else if (goal.status === 'completed') {
    goal.status = 'active';
    goal.completedAt = null;
  }
  return goal;
};
