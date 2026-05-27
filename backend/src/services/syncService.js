import mongoose from 'mongoose';
import { SyncState } from '../models/SyncState.js';
import { Workspace } from '../models/Workspace.js';
import { Task } from '../models/Task.js';
import { Goal } from '../models/Goal.js';
import { ApiError } from '../utils/ApiError.js';
import { toPublicWorkspace, toPublicTask } from '../utils/mappers.js';
import { toPublicGoal } from '../utils/goalMapper.js';
import { toObjectId, assertUserOwns } from '../utils/ownership.js';

const normalizeDeviceId = (deviceId) => {
  const raw = (deviceId || 'web').toString().trim();
  return raw.slice(0, 120) || 'web';
};

const upsertSyncState = async (userId, deviceId) => {
  const normalized = normalizeDeviceId(deviceId);
  const state = await SyncState.findOneAndUpdate(
    { user: userId, deviceId: normalized },
    { $setOnInsert: { user: userId, deviceId: normalized } },
    { new: true, upsert: true }
  );
  return state;
};

const parseSince = (since) => {
  if (!since) return null;
  const d = new Date(since);
  if (Number.isNaN(d.getTime())) throw ApiError.badRequest('Invalid since timestamp');
  return d;
};

const safeUpdatedAt = (value) => {
  const d = value ? new Date(value) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
};

export const getStatus = async (userId, deviceId) => {
  const state = await upsertSyncState(userId, deviceId);
  return {
    deviceId: state.deviceId,
    lastPulledAt: state.lastPulledAt,
    lastPushedAt: state.lastPushedAt,
    lastSyncedAt: state.lastSyncedAt,
    lastError: state.lastError?.message
      ? { message: state.lastError.message, at: state.lastError.at }
      : null,
    serverTime: new Date().toISOString(),
  };
};

export const pull = async (userId, deviceId, { since, limit = 500 } = {}) => {
  const state = await upsertSyncState(userId, deviceId);
  const cursor = parseSince(since) || state.lastPulledAt || new Date(0);
  const max = Math.min(Number(limit) || 500, 500);

  const [workspaces, tasks, goals] = await Promise.all([
    Workspace.find({ user: userId, updatedAt: { $gt: cursor } })
      .sort({ updatedAt: 1 })
      .limit(max),
    Task.find({ user: userId, updatedAt: { $gt: cursor } }).sort({ updatedAt: 1 }).limit(max),
    Goal.find({ user: userId, updatedAt: { $gt: cursor } }).sort({ updatedAt: 1 }).limit(max),
  ]);

  state.lastPulledAt = new Date();
  state.lastSyncedAt = state.lastPulledAt;
  state.lastError = { message: null, at: null };
  await state.save();

  return {
    since: cursor.toISOString(),
    pulledAt: state.lastPulledAt.toISOString(),
    workspaces: workspaces.map((ws) => toPublicWorkspace(ws, [])),
    tasks: tasks.map(toPublicTask),
    goals: goals.map(toPublicGoal),
  };
};

const applyWorkspaceUpsert = async (userId, item) => {
  const incomingUpdatedAt = safeUpdatedAt(item.updatedAt);
  const data = item.data || {};

  if (item.id && mongoose.Types.ObjectId.isValid(item.id)) {
    const id = toObjectId(item.id);
    const existing = await Workspace.findOne({ _id: id, user: userId });
    assertUserOwns(existing, userId, 'Workspace');

    if (incomingUpdatedAt && existing.updatedAt && incomingUpdatedAt <= existing.updatedAt) {
      return { status: 'conflict', server: toPublicWorkspace(existing, []) };
    }

    if (data.name !== undefined) existing.name = data.name;
    if (data.collapsed !== undefined) existing.collapsed = Boolean(data.collapsed);
    if (data.order !== undefined) existing.order = Number(data.order) || 0;
    await existing.save();
    return { status: 'applied', record: toPublicWorkspace(existing, []) };
  }

  const created = await Workspace.create({
    user: userId,
    name: data.name || 'Workspace',
    collapsed: Boolean(data.collapsed),
    order: Number(data.order) || 0,
  });
  return {
    status: 'created',
    record: toPublicWorkspace(created, []),
    idMap: item.clientId ? { [item.clientId]: created._id.toString() } : null,
  };
};

const applyTaskUpsert = async (userId, item, workspaceIdMap) => {
  const incomingUpdatedAt = safeUpdatedAt(item.updatedAt);
  const data = item.data || {};

  const workspaceId = workspaceIdMap?.[data.workspaceId] || data.workspaceId;
  if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw ApiError.badRequest('Invalid workspaceId for task');
  }
  const workspace = await Workspace.findOne({ _id: toObjectId(workspaceId), user: userId });
  assertUserOwns(workspace, userId, 'Workspace');

  if (item.id && mongoose.Types.ObjectId.isValid(item.id)) {
    const id = toObjectId(item.id);
    const existing = await Task.findOne({ _id: id, user: userId });
    assertUserOwns(existing, userId, 'Task');

    if (incomingUpdatedAt && existing.updatedAt && incomingUpdatedAt <= existing.updatedAt) {
      return { status: 'conflict', server: toPublicTask(existing) };
    }

    if (data.title !== undefined) existing.title = data.title;
    if (data.completed !== undefined) {
      existing.completed = Boolean(data.completed);
      existing.completedAt = existing.completed ? new Date() : null;
    }
    if (data.priority !== undefined) existing.priority = data.priority;
    if (data.order !== undefined) existing.order = Number(data.order) || 0;
    existing.workspace = workspace._id;
    await existing.save();
    return { status: 'applied', record: toPublicTask(existing) };
  }

  const created = await Task.create({
    user: userId,
    workspace: workspace._id,
    title: data.title || 'Task',
    completed: Boolean(data.completed),
    priority: data.priority || 'normal',
    order: Number(data.order) || 0,
    completedAt: data.completed ? new Date() : null,
  });

  return {
    status: 'created',
    record: toPublicTask(created),
    idMap: item.clientId ? { [item.clientId]: created._id.toString() } : null,
  };
};

const applyGoalUpsert = async (userId, item) => {
  const incomingUpdatedAt = safeUpdatedAt(item.updatedAt);
  const data = item.data || {};

  if (item.id && mongoose.Types.ObjectId.isValid(item.id)) {
    const id = toObjectId(item.id);
    const existing = await Goal.findOne({ _id: id, user: userId });
    assertUserOwns(existing, userId, 'Goal');

    if (data.$op === 'logDay') {
      if (existing.status === 'archived') {
        throw ApiError.badRequest('Cannot log progress on archived goals');
      }
      existing.daysCompleted = (existing.daysCompleted ?? 0) + 1;
      existing.streak = (existing.streak ?? 0) + 1;
      existing.streakHistory = [
        ...(existing.streakHistory ?? [0, 0, 0, 0, 0, 0, 0]).slice(-6),
        1,
      ];
      await existing.save();
      return { status: 'applied', record: toPublicGoal(existing) };
    }

    if (incomingUpdatedAt && existing.updatedAt && incomingUpdatedAt <= existing.updatedAt) {
      return { status: 'conflict', server: toPublicGoal(existing) };
    }

    const allowed = [
      'title',
      'description',
      'category',
      'targetDays',
      'startDate',
      'status',
      'daysCompleted',
      'streak',
      'streakHistory',
      'milestones',
    ];
    allowed.forEach((k) => {
      if (data[k] !== undefined) existing[k] = data[k];
    });

    await existing.save();
    return { status: 'applied', record: toPublicGoal(existing) };
  }

  const created = await Goal.create({
    user: userId,
    title: data.title || 'Goal',
    description: data.description ?? '',
    category: data.category ?? 'personal',
    targetDays: Number(data.targetDays) || 30,
    daysCompleted: Number(data.daysCompleted) || 0,
    startDate: data.startDate || new Date().toISOString().split('T')[0],
    status: data.status ?? 'active',
    streak: Number(data.streak) || 0,
    streakHistory: data.streakHistory ?? [0, 0, 0, 0, 0, 0, 0],
    milestones: (data.milestones || []).map((m) => ({
      ...(m.id || m._id ? { _id: m.id || m._id } : {}),
      title: m.title,
      completed: Boolean(m.completed),
      targetDay: m.targetDay != null ? Number(m.targetDay) : undefined,
    })),
  });

  return {
    status: 'created',
    record: toPublicGoal(created),
    idMap: item.clientId ? { [item.clientId]: created._id.toString() } : null,
  };
};

const applyDelete = async (Model, userId, id, label) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return { status: 'ignored' };
  const _id = toObjectId(id);
  const doc = await Model.findOne({ _id, user: userId });
  if (!doc) return { status: 'ignored' };
  assertUserOwns(doc, userId, label);
  await doc.deleteOne();
  return { status: 'deleted', id };
};

export const push = async (userId, deviceId, { changes = {} } = {}) => {
  const state = await upsertSyncState(userId, deviceId);
  const applied = { workspaces: 0, tasks: 0, goals: 0, deletes: 0 };
  const conflicts = [];
  const idMap = {};

  try {
    // Workspaces first (so tasks can reference mapped ids)
    const wsChanges = Array.isArray(changes.workspaces) ? changes.workspaces : [];
    for (const item of wsChanges) {
      if (item.op === 'delete') {
        const result = await applyDelete(Workspace, userId, item.id, 'Workspace');
        if (result.status === 'deleted') applied.deletes += 1;
        continue;
      }
      const result = await applyWorkspaceUpsert(userId, item);
      if (result.status === 'conflict') conflicts.push({ entity: 'workspace', id: item.id, server: result.server });
      else {
        applied.workspaces += 1;
        if (result.idMap) Object.assign(idMap, result.idMap);
      }
    }

    const taskChanges = Array.isArray(changes.tasks) ? changes.tasks : [];
    for (const item of taskChanges) {
      if (item.op === 'delete') {
        const result = await applyDelete(Task, userId, item.id, 'Task');
        if (result.status === 'deleted') applied.deletes += 1;
        continue;
      }
      const result = await applyTaskUpsert(userId, item, idMap);
      if (result.status === 'conflict') conflicts.push({ entity: 'task', id: item.id, server: result.server });
      else {
        applied.tasks += 1;
        if (result.idMap) Object.assign(idMap, result.idMap);
      }
    }

    const goalChanges = Array.isArray(changes.goals) ? changes.goals : [];
    for (const item of goalChanges) {
      if (item.op === 'delete') {
        const result = await applyDelete(Goal, userId, item.id, 'Goal');
        if (result.status === 'deleted') applied.deletes += 1;
        continue;
      }
      const result = await applyGoalUpsert(userId, item);
      if (result.status === 'conflict') conflicts.push({ entity: 'goal', id: item.id, server: result.server });
      else {
        applied.goals += 1;
        if (result.idMap) Object.assign(idMap, result.idMap);
      }
    }

    state.lastPushedAt = new Date();
    state.lastSyncedAt = state.lastPushedAt;
    state.lastError = { message: null, at: null };
    await state.save();

    return {
      pushedAt: state.lastPushedAt.toISOString(),
      applied,
      conflicts,
      idMap,
    };
  } catch (err) {
    state.lastError = { message: err.message || 'Sync push failed', at: new Date() };
    await state.save();
    throw err;
  }
};

