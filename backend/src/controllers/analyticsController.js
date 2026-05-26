import * as analyticsService from '../services/analyticsService.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAnalytics = asyncHandler(async (req, res) => {
  const period = req.query.period || 'weekly';
  const analytics = await analyticsService.getAnalytics(req.user._id, period);
  sendSuccess(res, { message: 'Analytics retrieved', data: { analytics } });
});

export const getDaily = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getDailyAnalytics(req.user._id);
  sendSuccess(res, { message: 'Daily analytics retrieved', data: { analytics } });
});

export const getWeekly = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getWeeklyAnalytics(req.user._id);
  sendSuccess(res, { message: 'Weekly analytics retrieved', data: { analytics } });
});

export const getMonthly = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getMonthlyAnalytics(req.user._id);
  sendSuccess(res, { message: 'Monthly analytics retrieved', data: { analytics } });
});

export const getHeatmap = asyncHandler(async (req, res) => {
  const heatmap = await analyticsService.getHeatmap(req.user._id);
  sendSuccess(res, { message: 'Heatmap retrieved', data: { heatmap } });
});
