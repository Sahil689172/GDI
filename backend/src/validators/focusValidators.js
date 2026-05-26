import { body } from 'express-validator';

export const startSessionRules = [
  body('duration').isInt({ min: 1, max: 180 }).withMessage('duration must be 1–180 minutes'),
  body('sessionType').trim().notEmpty().withMessage('sessionType is required'),
  body('notes').optional().isString().isLength({ max: 2000 }),
];

export const endSessionRules = [
  body('sessionId').isMongoId().withMessage('sessionId is required'),
  body('completed').isBoolean().withMessage('completed must be a boolean'),
  body('endedAt').optional().isISO8601(),
  body('notes').optional().isString().isLength({ max: 2000 }),
];
