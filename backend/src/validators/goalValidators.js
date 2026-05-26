import { body, param } from 'express-validator';

export const goalIdParam = [param('id').isMongoId().withMessage('Invalid goal id')];

export const createGoalRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('targetDays').isInt({ min: 1, max: 999 }).withMessage('targetDays must be 1–999'),
  body('startDate').optional().isISO8601().withMessage('Invalid startDate'),
  body('milestones').optional().isArray(),
];

export const updateGoalRules = [
  ...goalIdParam,
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('targetDays').optional().isInt({ min: 1, max: 999 }),
  body('milestones').optional().isArray(),
];
