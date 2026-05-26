import mongoose from 'mongoose';
import { ApiError } from './ApiError.js';

export const toObjectId = (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid id');
  }
  return new mongoose.Types.ObjectId(id);
};

export const assertUserOwns = (doc, userId, label = 'Resource') => {
  if (!doc) throw ApiError.notFound(`${label} not found`);
  if (doc.user.toString() !== userId.toString()) {
    throw ApiError.forbidden('Access denied');
  }
  return doc;
};
