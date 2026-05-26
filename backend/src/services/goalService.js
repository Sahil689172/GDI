import { Goal } from '../models/Goal.js';
import { ApiError } from '../utils/ApiError.js';
import { toObjectId, assertUserOwns } from '../utils/ownership.js';
import { toPublicGoal } from '../utils/goalMapper.js';

export const listGoals = async (userId) => {
  const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });
  return goals.map(toPublicGoal);
};

export const createGoal = async (userId, data) => {
  const goal = await Goal.create({
    user: userId,
    title: data.title,
    description: data.description ?? '',
    targetDays: data.targetDays,
    daysCompleted: 0,
    startDate: data.startDate || new Date().toISOString().split('T')[0],
    streak: 0,
    streakHistory: [0, 0, 0, 0, 0, 0, 0],
    milestones: (data.milestones ?? []).map((m) => ({
      title: m.title,
      completed: Boolean(m.completed),
      targetDay: m.targetDay != null ? Number(m.targetDay) : undefined,
    })),
  });
  return toPublicGoal(goal);
};

export const updateGoal = async (userId, goalId, updates) => {
  const id = toObjectId(goalId);
  const goal = await Goal.findOne({ _id: id, user: userId });
  assertUserOwns(goal, userId, 'Goal');

  if (updates.title !== undefined) goal.title = updates.title;
  if (updates.description !== undefined) goal.description = updates.description;
  if (updates.targetDays !== undefined) goal.targetDays = updates.targetDays;
  if (updates.daysCompleted !== undefined) goal.daysCompleted = updates.daysCompleted;
  if (updates.startDate !== undefined) goal.startDate = updates.startDate;
  if (updates.streak !== undefined) goal.streak = updates.streak;
  if (updates.streakHistory !== undefined) goal.streakHistory = updates.streakHistory;
  if (updates.milestones !== undefined) {
    goal.milestones = updates.milestones.map((m) => ({
      ...(m.id || m._id ? { _id: m.id || m._id } : {}),
      title: m.title,
      completed: Boolean(m.completed),
      targetDay: m.targetDay != null ? Number(m.targetDay) : undefined,
    }));
  }

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

  if (goal.daysCompleted >= goal.targetDays) {
    throw ApiError.badRequest('Goal already completed');
  }

  const history = [...(goal.streakHistory ?? [0, 0, 0, 0, 0, 0, 0]).slice(-6), 1];
  goal.daysCompleted += 1;
  goal.streak = (goal.streak ?? 0) + 1;
  goal.streakHistory = history;
  await goal.save();
  return toPublicGoal(goal);
};
