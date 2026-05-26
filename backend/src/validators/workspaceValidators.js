import { body, param } from 'express-validator';

export const workspaceIdParam = [
  param('id').isMongoId().withMessage('Invalid workspace id'),
];

export const createWorkspaceRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Workspace name is required')
    .isLength({ max: 120 })
    .withMessage('Name cannot exceed 120 characters'),
  body('collapsed').optional().isBoolean().withMessage('collapsed must be a boolean'),
];

export const updateWorkspaceRules = [
  ...workspaceIdParam,
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 120 })
    .withMessage('Name cannot exceed 120 characters'),
  body('collapsed').optional().isBoolean().withMessage('collapsed must be a boolean'),
  body('order').optional().isInt({ min: 0 }).withMessage('order must be a non-negative integer'),
];

export const reorderWorkspacesRules = [
  body('orderedIds')
    .isArray({ min: 1 })
    .withMessage('orderedIds must be a non-empty array'),
  body('orderedIds.*').isMongoId().withMessage('Each workspace id must be valid'),
];
