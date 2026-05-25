import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const extractToken = (req) => {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    return header.slice(7);
  }
  if (req.cookies?.[env.jwt.cookieName]) {
    return req.cookies[env.jwt.cookieName];
  }
  return null;
};

/** Verifies JWT and attaches decoded payload to req.auth */
export const verifyAuthToken = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw ApiError.unauthorized('Authentication required');
  }

  const decoded = verifyToken(token);
  req.auth = decoded;
  next();
});

/** Loads active user after token verification — use on protected routes */
export const protect = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw ApiError.unauthorized('Authentication required');
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.sub).select('+isActive');
  if (!user || !user.isActive) {
    throw ApiError.unauthorized('User not found or inactive');
  }

  req.auth = decoded;
  req.user = user;
  next();
});
