import * as analyticsService from '../services/analyticsService.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAnalytics = asyncHandler(async (req, res) => {
  const period = req.query.period || 'weekly';
  const analytics = await analyticsService.getAnalytics(req.user._id, period);
  sendSuccess(res, { message: 'Analytics retrieved', data: { analytics } });
});
