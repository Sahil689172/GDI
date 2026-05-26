import { body, param, query } from 'express-validator';
import { NOTIFICATION_TYPES } from '../models/Notification.js';

export const listRules = [
  query('unreadOnly').optional().isIn(['true', 'false']),
  query('type').optional().isIn(NOTIFICATION_TYPES),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

export const createRules = [
  body('title').trim().notEmpty().isLength({ max: 200 }),
  body('message').trim().notEmpty().isLength({ max: 2000 }),
  body('type').optional().isIn(NOTIFICATION_TYPES),
  body('read').optional().isBoolean(),
  body('relatedTask').optional({ nullable: true }).isMongoId(),
  body('relatedGoal').optional({ nullable: true }).isMongoId(),
  body('scheduledFor').optional({ nullable: true }).isISO8601(),
];

export const idParam = [param('id').isMongoId().withMessage('Invalid notification id')];
