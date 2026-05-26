import { body, param, query } from 'express-validator';
import { TASK_PRIORITIES } from '../models/Task.js';

export const taskIdParam = [param('id').isMongoId().withMessage('Invalid task id')];

export const listTasksRules = [
  query('workspaceId').optional().isMongoId().withMessage('Invalid workspaceId'),
  query('completed').optional().isIn(['true', 'false']).withMessage('completed must be true or false'),
  query('priority').optional().isIn(TASK_PRIORITIES).withMessage('Invalid priority'),
  query('search').optional().isString().isLength({ max: 200 }).withMessage('search too long'),
  query('sort')
    .optional()
    .isIn(['order', 'priority', 'newest', 'completed'])
    .withMessage('Invalid sort'),
];

export const createTaskRules = [
  body('workspaceId').isMongoId().withMessage('workspaceId is required'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 500 })
    .withMessage('Title cannot exceed 500 characters'),
  body('priority')
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage(`priority must be one of: ${TASK_PRIORITIES.join(', ')}`),
  body('completed').optional().isBoolean().withMessage('completed must be a boolean'),
];

export const updateTaskRules = [
  ...taskIdParam,
  body('workspaceId').optional().isMongoId().withMessage('Invalid workspaceId'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 500 })
    .withMessage('Title cannot exceed 500 characters'),
  body('priority')
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage(`priority must be one of: ${TASK_PRIORITIES.join(', ')}`),
  body('completed').optional().isBoolean().withMessage('completed must be a boolean'),
  body('order').optional().isInt({ min: 0 }).withMessage('order must be a non-negative integer'),
];

export const reorderTasksRules = [
  body('workspaceId').isMongoId().withMessage('workspaceId is required'),
  body('orderedIds')
    .isArray({ min: 1 })
    .withMessage('orderedIds must be a non-empty array'),
  body('orderedIds.*').isMongoId().withMessage('Each task id must be valid'),
];
