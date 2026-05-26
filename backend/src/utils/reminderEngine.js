/** Reusable reminder builders — analytics-ready payloads for Notification.create */

export const buildTaskReminder = (task) => ({
  title: 'High-priority task',
  message: `"${task.title}" is still pending. Consider tackling it today.`,
  type: 'task_reminder',
  relatedTask: task._id,
});

export const buildOverdueAlert = (count) => ({
  title: 'Overdue tasks',
  message: `You have ${count} task(s) open for over a week. Review your task list.`,
  type: 'overdue',
});

export const buildGoalReminder = (goal, progress) => ({
  title: 'Goal momentum',
  message: `"${goal.title}" is at ${progress}%. Log progress to build streak.`,
  type: 'goal_reminder',
  relatedGoal: goal._id,
});

export const buildStreakWarning = () => ({
  title: 'Start your streak',
  message: 'Complete a focus session or log a goal day to begin your streak.',
  type: 'streak_warning',
});

export const buildDailySummary = ({ doneTasks, totalTasks, activeGoals, streak }) => ({
  title: 'Daily summary',
  message: `Tasks: ${doneTasks}/${totalTasks} done · ${activeGoals} active goal(s) · Streak: ${streak} day(s).`,
  type: 'daily_summary',
});

export const buildDeadlineAlert = (goal, daysLeft) => ({
  title: 'Upcoming deadline',
  message: `"${goal.title}" target ends in ${daysLeft} day(s). Stay on track.`,
  type: 'deadline',
  relatedGoal: goal._id,
});

export const goalProgressPercent = (goal) =>
  goal.targetDays > 0
    ? Math.min(100, Math.round((goal.daysCompleted / goal.targetDays) * 100))
    : 0;

export const goalDaysRemaining = (goal) => {
  const start = new Date(goal.startDate);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setDate(end.getDate() + goal.targetDays);
  const diff = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
};

export const isNotificationDue = (scheduledFor) =>
  !scheduledFor || new Date(scheduledFor) <= new Date();
