import * as goalService from '../services/goalService.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const listGoals = asyncHandler(async (req, res) => {
  const goals = await goalService.listGoals(req.user._id, req.query);
  const analytics = await goalService.getGoalAnalytics(req.user._id);
  sendSuccess(res, {
    message: 'Goals retrieved',
    data: { goals, analytics },
    meta: { count: goals.length },
  });
});

export const getGoalAnalytics = asyncHandler(async (req, res) => {
  const analytics = await goalService.getGoalAnalytics(req.user._id);
  sendSuccess(res, { message: 'Goal analytics retrieved', data: { analytics } });
});

export const createGoal = asyncHandler(async (req, res) => {
  const goal = await goalService.createGoal(req.user._id, req.body);
  sendSuccess(res, { statusCode: 201, message: 'Goal created', data: { goal } });
});

export const updateGoal = asyncHandler(async (req, res) => {
  const allowed = [
    'title',
    'description',
    'category',
    'targetDays',
    'startDate',
    'status',
    'daysCompleted',
    'streak',
    'streakHistory',
    'milestones',
  ];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k, v]) => allowed.includes(k) && v !== undefined)
  );
  if (!Object.keys(updates).length) {
    throw ApiError.badRequest('No valid fields to update');
  }
  const goal = await goalService.updateGoal(req.user._id, req.params.id, updates);
  sendSuccess(res, { message: 'Goal updated', data: { goal } });
});

export const deleteGoal = asyncHandler(async (req, res) => {
  await goalService.deleteGoal(req.user._id, req.params.id);
  sendSuccess(res, { message: 'Goal deleted' });
});

export const logGoalDay = asyncHandler(async (req, res) => {
  const goal = await goalService.logGoalDay(req.user._id, req.params.id);
  sendSuccess(res, { message: 'Progress logged', data: { goal } });
});
