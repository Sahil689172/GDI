import * as authService from '../services/authService.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { env } from '../config/env.js';
import { cookieOptions } from '../utils/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const setAuthCookie = (res, token) => {
  res.cookie(env.jwt.cookieName, token, cookieOptions);
};

const clearAuthCookie = (res) => {
  res.clearCookie(env.jwt.cookieName, { ...cookieOptions, maxAge: 0 });
};

export const signup = asyncHandler(async (req, res) => {
  const { user, token } = await authService.signupUser(req.body);
  setAuthCookie(res, token);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Account created successfully',
    data: { user, token },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);
  setAuthCookie(res, token);
  sendSuccess(res, {
    message: 'Logged in successfully',
    data: { user, token },
  });
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  sendSuccess(res, { message: 'Logged out successfully' });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  sendSuccess(res, {
    message: 'Profile retrieved successfully',
    data: { user },
  });
});
