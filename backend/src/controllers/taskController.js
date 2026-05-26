import * as taskService from '../services/taskService.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const listTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.listTasks(req.user._id, req.query);
  sendSuccess(res, {
    message: 'Tasks retrieved',
    data: { tasks },
    meta: { count: tasks.length },
  });
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user._id, req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Task created',
    data: { task },
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const { title, completed, priority, order, workspaceId } = req.body;
  if (
    title === undefined &&
    completed === undefined &&
    priority === undefined &&
    order === undefined &&
    workspaceId === undefined
  ) {
    throw ApiError.badRequest('No valid fields to update');
  }
  const task = await taskService.updateTask(req.user._id, req.params.id, {
    title,
    completed,
    priority,
    order,
    workspaceId,
  });
  sendSuccess(res, { message: 'Task updated', data: { task } });
});

export const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.user._id, req.params.id);
  sendSuccess(res, { message: 'Task deleted' });
});

export const reorderTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.reorderTasks(
    req.user._id,
    req.body.workspaceId,
    req.body.orderedIds
  );
  sendSuccess(res, { message: 'Tasks reordered', data: { tasks } });
});
