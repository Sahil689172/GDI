import * as syncService from '../services/syncService.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const deviceIdOf = (req) =>
  req.headers['x-device-id'] ||
  req.headers['x-deviceid'] ||
  req.body?.deviceId ||
  req.query?.deviceId ||
  'web';

export const status = asyncHandler(async (req, res) => {
  const status = await syncService.getStatus(req.user._id, deviceIdOf(req));
  sendSuccess(res, { message: 'Sync status retrieved', data: { status } });
});

export const pull = asyncHandler(async (req, res) => {
  const data = await syncService.pull(req.user._id, deviceIdOf(req), req.body);
  sendSuccess(res, { message: 'Sync pull complete', data });
});

export const push = asyncHandler(async (req, res) => {
  const result = await syncService.push(req.user._id, deviceIdOf(req), req.body);
  sendSuccess(res, { message: 'Sync push complete', data: result });
});

