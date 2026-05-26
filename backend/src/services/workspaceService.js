import { Workspace } from '../models/Workspace.js';
import { Task } from '../models/Task.js';
import { ApiError } from '../utils/ApiError.js';
import { toObjectId, assertUserOwns } from '../utils/ownership.js';
import { toPublicWorkspace } from '../utils/mappers.js';

const nextWorkspaceOrder = async (userId) => {
  const last = await Workspace.findOne({ user: userId }).sort({ order: -1 }).select('order');
  return last ? last.order + 1 : 0;
};

const loadTasksByWorkspace = async (userId, workspaceIds) => {
  const tasks = await Task.find({
    user: userId,
    workspace: { $in: workspaceIds },
  }).sort({ order: 1, createdAt: 1 });

  const map = new Map();
  workspaceIds.forEach((id) => map.set(id.toString(), []));
  tasks.forEach((task) => {
    const key = task.workspace.toString();
    map.get(key)?.push(task);
  });
  return map;
};

export const listWorkspaces = async (userId) => {
  const workspaces = await Workspace.find({ user: userId }).sort({ order: 1, createdAt: 1 });
  if (!workspaces.length) return [];

  const taskMap = await loadTasksByWorkspace(
    userId,
    workspaces.map((ws) => ws._id)
  );

  return workspaces.map((ws) => toPublicWorkspace(ws, taskMap.get(ws._id.toString()) ?? []));
};

export const createWorkspace = async (userId, { name, collapsed = false }) => {
  const order = await nextWorkspaceOrder(userId);
  const workspace = await Workspace.create({
    user: userId,
    name,
    collapsed,
    order,
  });
  return toPublicWorkspace(workspace, []);
};

export const updateWorkspace = async (userId, workspaceId, updates) => {
  const id = toObjectId(workspaceId);
  const workspace = await Workspace.findOne({ _id: id, user: userId });
  assertUserOwns(workspace, userId, 'Workspace');

  if (updates.name !== undefined) workspace.name = updates.name;
  if (updates.collapsed !== undefined) workspace.collapsed = updates.collapsed;
  if (updates.order !== undefined) workspace.order = updates.order;

  await workspace.save();

  const tasks = await Task.find({ user: userId, workspace: id }).sort({ order: 1, createdAt: 1 });
  return toPublicWorkspace(workspace, tasks);
};

export const deleteWorkspace = async (userId, workspaceId) => {
  const id = toObjectId(workspaceId);
  const workspace = await Workspace.findOne({ _id: id, user: userId });
  assertUserOwns(workspace, userId, 'Workspace');

  await Task.deleteMany({ user: userId, workspace: id });
  await workspace.deleteOne();
};

export const reorderWorkspaces = async (userId, orderedIds) => {
  const ids = orderedIds.map((id) => toObjectId(id));
  const workspaces = await Workspace.find({ user: userId, _id: { $in: ids } });

  if (workspaces.length !== ids.length) {
    throw ApiError.badRequest('Invalid workspace order list');
  }

  const bulk = ids.map((id, index) => ({
    updateOne: {
      filter: { _id: id, user: userId },
      update: { $set: { order: index } },
    },
  }));

  await Workspace.bulkWrite(bulk);
  return listWorkspaces(userId);
};
