import { body } from 'express-validator';

export const createSessionRules = [
  body('mode').trim().notEmpty().withMessage('mode is required'),
  body('phase').trim().notEmpty().withMessage('phase is required'),
  body('minutes').isInt({ min: 1 }).withMessage('minutes must be at least 1'),
  body('completedAt').optional().isISO8601(),
];
