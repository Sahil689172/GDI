import { Goal } from '../models/Goal.js';
import { ApiError } from '../utils/ApiError.js';
import { toObjectId, assertUserOwns } from '../utils/ownership.js';
import { toPublicGoal } from '../utils/goalMapper.js';
import {
  applyGoalCompletionState,
  GOAL_CATEGORIES,
} from '../utils/goalProgress.js';

const mapMilestones = (items = []) =>
  items.map((m) => ({
    ...(m.id || m._id ? { _id: m.id || m._id } : {}),
    title: m.title,
    completed: Boolean(m.completed),
    targetDay: m.targetDay != null ? Number(m.targetDay) : undefined,
  }));

export const listGoals = async (userId, query = {}) => {
  const filter = { user: userId };

  if (query.status) {
    filter.status = query.status;
  } else if (query.includeArchived !== 'true') {
    filter.status = { $ne: 'archived' };
  }

  if (query.category) {
    filter.category = query.category;
  }

  const goals = await Goal.find(filter).sort({ createdAt: -1 });
  return goals.map(toPublicGoal);
};

export const createGoal = async (userId, data) => {
  const goal = await Goal.create({
    user: userId,
    title: data.title,
    description: data.description ?? '',
    category: data.category ?? 'personal',
    targetDays: data.targetDays,
    daysCompleted: 0,
    startDate: data.startDate || new Date().toISOString().split('T')[0],
    status: 'active',
    streak: 0,
    streakHistory: [0, 0, 0, 0, 0, 0, 0],
    milestones: mapMilestones(data.milestones),
  });
  return toPublicGoal(goal);
};

export const updateGoal = async (userId, goalId, updates) => {
  const id = toObjectId(goalId);
  const goal = await Goal.findOne({ _id: id, user: userId });
  assertUserOwns(goal, userId, 'Goal');

  if (updates.title !== undefined) goal.title = updates.title;
  if (updates.description !== undefined) goal.description = updates.description;
  if (updates.category !== undefined) goal.category = updates.category;
  if (updates.targetDays !== undefined) goal.targetDays = updates.targetDays;
  if (updates.daysCompleted !== undefined) goal.daysCompleted = updates.daysCompleted;
  if (updates.startDate !== undefined) goal.startDate = updates.startDate;
  if (updates.streak !== undefined) goal.streak = updates.streak;
  if (updates.streakHistory !== undefined) goal.streakHistory = updates.streakHistory;
  if (updates.status !== undefined) {
    goal.status = updates.status;
    if (updates.status === 'archived' && !goal.completedAt && goal.daysCompleted >= goal.targetDays) {
      goal.completedAt = new Date();
    }
    if (updates.status === 'active') {
      goal.completedAt = null;
    }
  }
  if (updates.milestones !== undefined) {
    goal.milestones = mapMilestones(updates.milestones);
  }

  applyGoalCompletionState(goal);
  await goal.save();
  return toPublicGoal(goal);
};

export const deleteGoal = async (userId, goalId) => {
  const id = toObjectId(goalId);
  const goal = await Goal.findOne({ _id: id, user: userId });
  assertUserOwns(goal, userId, 'Goal');
  await goal.deleteOne();
};

export const logGoalDay = async (userId, goalId) => {
  const id = toObjectId(goalId);
  const goal = await Goal.findOne({ _id: id, user: userId });
  assertUserOwns(goal, userId, 'Goal');

  if (goal.status === 'archived') {
    throw ApiError.badRequest('Cannot log progress on archived goals');
  }

  if (goal.daysCompleted >= goal.targetDays) {
    throw ApiError.badRequest('Goal already completed');
  }

  const history = [...(goal.streakHistory ?? [0, 0, 0, 0, 0, 0, 0]).slice(-6), 1];
  goal.daysCompleted += 1;
  goal.streak = (goal.streak ?? 0) + 1;
  goal.streakHistory = history;

  applyGoalCompletionState(goal);
  await goal.save();
  return toPublicGoal(goal);
};

export const getGoalAnalytics = async (userId) => {
  const goals = await Goal.find({ user: userId });
  const publicGoals = goals.map(toPublicGoal);

  return {
    total: goals.length,
    active: goals.filter((g) => g.status === 'active').length,
    completed: goals.filter((g) => g.status === 'completed').length,
    archived: goals.filter((g) => g.status === 'archived').length,
    avgProgress:
      publicGoals.length > 0
        ? Math.round(publicGoals.reduce((a, g) => a + g.progress, 0) / publicGoals.length)
        : 0,
    maxStreak: publicGoals.length ? Math.max(...publicGoals.map((g) => g.streak)) : 0,
    totalDaysLogged: goals.reduce((a, g) => a + g.daysCompleted, 0),
    byCategory: GOAL_CATEGORIES.reduce((acc, cat) => {
      acc[cat] = publicGoals.filter((g) => g.category === cat).length;
      return acc;
    }, {}),
  };
};
