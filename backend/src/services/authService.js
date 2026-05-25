import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { signToken } from '../utils/jwt.js';
import { toPublicUser } from '../utils/userMapper.js';

export const signupUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user._id.toString());

  return { user: toPublicUser(user), token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password +isActive');
  if (!user || !user.isActive) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = signToken(user._id.toString());
  return { user: toPublicUser(user), token };
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select('+isActive');
  if (!user || !user.isActive) {
    throw ApiError.notFound('User not found');
  }
  return toPublicUser(user);
};
