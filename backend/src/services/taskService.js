import { Task } from '../models/Task.js';
import { Workspace } from '../models/Workspace.js';
import { ApiError } from '../utils/ApiError.js';
import { toObjectId, assertUserOwns } from '../utils/ownership.js';
import { toPublicTask } from '../utils/mappers.js';

const nextTaskOrder = async (userId, workspaceId) => {
  const last = await Task.findOne({ user: userId, workspace: workspaceId })
    .sort({ order: -1 })
    .select('order');
  return last ? last.order + 1 : 0;
};

const assertWorkspaceForUser = async (userId, workspaceId) => {
  const wsId = toObjectId(workspaceId);
  const workspace = await Workspace.findOne({ _id: wsId, user: userId });
  assertUserOwns(workspace, userId, 'Workspace');
  return workspace;
};

export const listTasks = async (userId, query = {}) => {
  const filter = { user: userId };

  if (query.workspaceId) {
    filter.workspace = toObjectId(query.workspaceId);
  }

  if (query.completed !== undefined) {
    filter.completed = query.completed === 'true' || query.completed === true;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.search?.trim()) {
    filter.title = { $regex: query.search.trim(), $options: 'i' };
  }

  let sort = { order: 1, createdAt: 1 };
  if (query.sort === 'priority') {
    sort = { priority: -1, order: 1 };
  } else if (query.sort === 'newest') {
    sort = { createdAt: -1 };
  } else if (query.sort === 'completed') {
    sort = { completed: 1, order: 1 };
  }

  const tasks = await Task.find(filter).sort(sort);
  return tasks.map(toPublicTask);
};

export const createTask = async (userId, { workspaceId, title, priority = 'normal', completed = false }) => {
  const workspace = await assertWorkspaceForUser(userId, workspaceId);
  const order = await nextTaskOrder(userId, workspace._id);

  const task = await Task.create({
    user: userId,
    workspace: workspace._id,
    title,
    priority,
    completed,
    order,
    completedAt: completed ? new Date() : null,
  });

  if (!workspace.collapsed && completed === false) {
    /* keep workspace expanded when adding active tasks */
  }

  return toPublicTask(task);
};

export const updateTask = async (userId, taskId, updates) => {
  const id = toObjectId(taskId);
  const task = await Task.findOne({ _id: id, user: userId });
  assertUserOwns(task, userId, 'Task');

  if (updates.workspaceId !== undefined) {
    const workspace = await assertWorkspaceForUser(userId, updates.workspaceId);
    task.workspace = workspace._id;
    if (updates.order === undefined) {
      task.order = await nextTaskOrder(userId, workspace._id);
    }
  }

  if (updates.title !== undefined) task.title = updates.title;
  if (updates.priority !== undefined) task.priority = updates.priority;
  if (updates.order !== undefined) task.order = updates.order;

  if (updates.completed !== undefined) {
    task.completed = updates.completed;
    task.completedAt = updates.completed ? new Date() : null;
  }

  await task.save();
  return toPublicTask(task);
};

export const deleteTask = async (userId, taskId) => {
  const id = toObjectId(taskId);
  const task = await Task.findOne({ _id: id, user: userId });
  assertUserOwns(task, userId, 'Task');
  await task.deleteOne();
};

export const reorderTasks = async (userId, workspaceId, orderedIds) => {
  const workspace = await assertWorkspaceForUser(userId, workspaceId);
  const ids = orderedIds.map((id) => toObjectId(id));

  const tasks = await Task.find({
    user: userId,
    workspace: workspace._id,
    _id: { $in: ids },
  });

  if (tasks.length !== ids.length) {
    throw ApiError.badRequest('Invalid task order list for this workspace');
  }

  const bulk = ids.map((id, index) => ({
    updateOne: {
      filter: { _id: id, user: userId },
      update: { $set: { order: index } },
    },
  }));

  await Task.bulkWrite(bulk);

  return listTasks(userId, { workspaceId: workspace._id.toString() });
};
