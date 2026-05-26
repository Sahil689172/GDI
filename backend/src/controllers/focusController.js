import * as focusService from '../services/focusService.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const stats = await focusService.getFocusStats(req.user._id);
  sendSuccess(res, { message: 'Focus stats retrieved', data: { stats } });
});

export const listSessions = asyncHandler(async (req, res) => {
  const sessions = await focusService.listSessions(req.user._id);
  sendSuccess(res, { message: 'Focus sessions retrieved', data: { sessions } });
});

export const start = asyncHandler(async (req, res) => {
  const session = await focusService.startSession(req.user._id, req.body);
  sendSuccess(res, { statusCode: 201, message: 'Focus session started', data: { session } });
});

export const end = asyncHandler(async (req, res) => {
  const session = await focusService.endSession(req.user._id, req.body);
  sendSuccess(res, { message: 'Focus session ended', data: { session } });
});
