import * as goalService from '../services/goalService.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const listGoals = asyncHandler(async (req, res) => {
  const goals = await goalService.listGoals(req.user._id);
  sendSuccess(res, { message: 'Goals retrieved', data: { goals }, meta: { count: goals.length } });
});

export const createGoal = asyncHandler(async (req, res) => {
  const goal = await goalService.createGoal(req.user._id, req.body);
  sendSuccess(res, { statusCode: 201, message: 'Goal created', data: { goal } });
});

export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await goalService.updateGoal(req.user._id, req.params.id, req.body);
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
