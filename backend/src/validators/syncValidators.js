import { body } from 'express-validator';

const deviceIdRule = body('deviceId')
  .optional()
  .isString()
  .isLength({ min: 1, max: 120 })
  .withMessage('deviceId must be 1–120 characters');

export const statusRules = [deviceIdRule];

export const pullRules = [
  deviceIdRule,
  body('since').optional({ nullable: true }).isISO8601().withMessage('since must be ISO8601'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage('limit must be 1–500'),
];

export const pushRules = [
  deviceIdRule,
  body('changes').isObject().withMessage('changes is required'),
  body('changes.workspaces').optional().isArray(),
  body('changes.tasks').optional().isArray(),
  body('changes.goals').optional().isArray(),
];

