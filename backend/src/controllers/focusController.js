import * as focusService from '../services/focusService.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listSessions = asyncHandler(async (req, res) => {
  const sessions = await focusService.listSessions(req.user._id);
  sendSuccess(res, { message: 'Focus sessions retrieved', data: { sessions } });
});

export const createSession = asyncHandler(async (req, res) => {
  const session = await focusService.createSession(req.user._id, req.body);
  sendSuccess(res, { statusCode: 201, message: 'Session recorded', data: { session } });
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await focusService.getFocusStats(req.user._id);
  sendSuccess(res, { message: 'Focus stats retrieved', data: { stats } });
});
