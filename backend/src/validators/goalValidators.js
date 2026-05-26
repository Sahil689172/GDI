import { body, param, query } from 'express-validator';
import { GOAL_STATUSES, GOAL_CATEGORIES } from '../utils/goalProgress.js';

export const goalIdParam = [param('id').isMongoId().withMessage('Invalid goal id')];

export const listGoalsRules = [
  query('status').optional().isIn(GOAL_STATUSES).withMessage('Invalid status'),
  query('category').optional().isIn(GOAL_CATEGORIES).withMessage('Invalid category'),
  query('includeArchived').optional().isIn(['true', 'false']),
];

export const createGoalRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('category').optional().isIn(GOAL_CATEGORIES).withMessage('Invalid category'),
  body('targetDays').isInt({ min: 1, max: 999 }).withMessage('targetDays must be 1–999'),
  body('startDate').optional().isISO8601().withMessage('Invalid startDate'),
  body('milestones').optional().isArray(),
];

export const updateGoalRules = [
  ...goalIdParam,
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('category').optional().isIn(GOAL_CATEGORIES),
  body('targetDays').optional().isInt({ min: 1, max: 999 }),
  body('startDate').optional().isISO8601(),
  body('status').optional().isIn(GOAL_STATUSES),
  body('daysCompleted').optional().isInt({ min: 0 }),
  body('milestones').optional().isArray(),
];
