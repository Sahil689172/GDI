import { Notification } from '../models/Notification.js';
import { Task } from '../models/Task.js';
import { Goal } from '../models/Goal.js';
import { User } from '../models/User.js';
import { toObjectId, assertUserOwns } from '../utils/ownership.js';
import { toPublicNotification } from '../utils/notificationMapper.js';
import {
  buildTaskReminder,
  buildOverdueAlert,
  buildGoalReminder,
  buildStreakWarning,
  buildDailySummary,
  buildDeadlineAlert,
  goalProgressPercent,
  goalDaysRemaining,
} from '../utils/reminderEngine.js';

const dueFilter = () => ({
  $or: [{ scheduledFor: null }, { scheduledFor: { $lte: new Date() } }],
});

export const listNotifications = async (userId, query = {}) => {
  const filter = { user: userId, ...dueFilter() };
  if (query.unreadOnly === 'true') filter.read = false;
  if (query.type) filter.type = query.type;

  const limit = Math.min(Number(query.limit) || 50, 100);
  const notifications = await Notification.find(filter)
    .sort({ read: 1, createdAt: -1 })
    .limit(limit);

  return notifications.map(toPublicNotification);
};

export const getUnreadCount = async (userId) =>
  Notification.countDocuments({ user: userId, read: false, ...dueFilter() });

export const createNotification = async (userId, data) => {
  const notification = await Notification.create({
    user: userId,
    title: data.title,
    message: data.message,
    type: data.type || 'system',
    read: Boolean(data.read),
    relatedTask: data.relatedTask || null,
    relatedGoal: data.relatedGoal || null,
    scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
  });
  return toPublicNotification(notification);
};

export const markAsRead = async (userId, notificationId) => {
  const id = toObjectId(notificationId);
  const notification = await Notification.findOne({ _id: id, user: userId });
  assertUserOwns(notification, userId, 'Notification');
  notification.read = true;
  await notification.save();
  return toPublicNotification(notification);
};

export const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { user: userId, read: false, ...dueFilter() },
    { $set: { read: true } }
  );
  return { modified: result.modifiedCount };
};

export const deleteNotification = async (userId, notificationId) => {
  const id = toObjectId(notificationId);
  const notification = await Notification.findOne({ _id: id, user: userId });
  assertUserOwns(notification, userId, 'Notification');
  await notification.deleteOne();
};

/** Generate reminder/alert notifications from real task & goal data */
export const generateReminders = async (userId) => {
  const now = new Date();
  const created = [];
  const dayKey = now.toISOString().slice(0, 10);

  const existsToday = async (type, extra = {}) =>
    Notification.exists({
      user: userId,
      type,
      createdAt: { $gte: new Date(dayKey) },
      ...extra,
    });

  // High-priority pending tasks
  const highPriorityTasks = await Task.find({
    user: userId,
    completed: false,
    priority: 'high',
  }).limit(5);

  for (const task of highPriorityTasks) {
    const dup = await Notification.exists({
      user: userId,
      type: 'task_reminder',
      relatedTask: task._id,
      read: false,
    });
    if (!dup) created.push(await createNotification(userId, buildTaskReminder(task)));
  }

  // Overdue-style: tasks older than 7 days incomplete
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const staleCount = await Task.countDocuments({
    user: userId,
    completed: false,
    createdAt: { $lte: weekAgo },
  });
  if (staleCount > 0 && !(await existsToday('overdue'))) {
    created.push(await createNotification(userId, buildOverdueAlert(staleCount)));
  }

  // Active goals below 25% progress
  const goals = await Goal.find({ user: userId, status: 'active' });
  for (const goal of goals) {
    const progress = goalProgressPercent(goal);
    if (progress < 25) {
      const dup = await Notification.exists({
        user: userId,
        type: 'goal_reminder',
        relatedGoal: goal._id,
        read: false,
        createdAt: { $gte: new Date(dayKey) },
      });
      if (!dup) created.push(await createNotification(userId, buildGoalReminder(goal, progress)));
    }

    const daysLeft = goalDaysRemaining(goal);
    if (daysLeft !== null && daysLeft >= 0 && daysLeft <= 3) {
      const dupDeadline = await Notification.exists({
        user: userId,
        type: 'deadline',
        relatedGoal: goal._id,
        createdAt: { $gte: new Date(dayKey) },
      });
      if (!dupDeadline) {
        created.push(await createNotification(userId, buildDeadlineAlert(goal, daysLeft)));
      }
    }
  }

  // Streak warning
  const user = await User.findById(userId).select('streak');
  const streak = user?.streak ?? 0;
  if (streak === 0 && !(await existsToday('streak_warning'))) {
    created.push(await createNotification(userId, buildStreakWarning()));
  }

  // Daily summary (once per day)
  if (!(await existsToday('daily_summary'))) {
    const [totalTasks, doneTasks, activeGoals] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, completed: true }),
      Goal.countDocuments({ user: userId, status: 'active' }),
    ]);
    created.push(
      await createNotification(userId, buildDailySummary({
        doneTasks,
        totalTasks,
        activeGoals,
        streak,
      }))
    );
  }

  return { created: created.length, notifications: created };
};
