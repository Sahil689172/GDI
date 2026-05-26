export const GOAL_CATEGORIES = [
  { id: 'personal', label: 'Personal' },
  { id: 'academic', label: 'Academic' },
  { id: 'career', label: 'Career' },
  { id: 'health', label: 'Health' },
  { id: 'learning', label: 'Learning' },
  { id: 'project', label: 'Project' },
  { id: 'other', label: 'Other' },
];

export const GOAL_STATUSES = {
  active: 'Active',
  completed: 'Completed',
  archived: 'Archived',
};

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

export const formatDeadlineLabel = (goal) => {
  if (!goal?.endDate && !goal?.deadline) return '—';
  const date = goal.endDate || goal.deadline;
  if (goal.isCompleted) return `Completed · ${date}`;
  if (goal.isOverdue) return `Overdue · ${date}`;
  if (goal.daysRemaining != null && goal.daysRemaining >= 0) {
    return `${goal.daysRemaining}d left · ${date}`;
  }
  return `Due ${date}`;
};

export const getCategoryLabel = (categoryId) =>
  GOAL_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
