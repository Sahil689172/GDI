import { api, getResponseData } from '../api/client.js';

export const fetchWorkspaces = async () => {
  const res = await api.get('/workspaces');
  const data = getResponseData(res);
  return data.workspaces ?? [];
};

export const createWorkspace = async (payload) => {
  const res = await api.post('/workspaces', payload);
  return getResponseData(res).workspace;
};

export const updateWorkspace = async (id, payload) => {
  const res = await api.put(`/workspaces/${id}`, payload);
  return getResponseData(res).workspace;
};

export const deleteWorkspace = async (id) => {
  await api.delete(`/workspaces/${id}`);
};

export const reorderWorkspaces = async (orderedIds) => {
  const res = await api.put('/workspaces/reorder', { orderedIds });
  return getResponseData(res).workspaces ?? [];
};

export const createTask = async (payload) => {
  const res = await api.post('/tasks', payload);
  return getResponseData(res).task;
};

export const updateTask = async (id, payload) => {
  const res = await api.put(`/tasks/${id}`, payload);
  return getResponseData(res).task;
};

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
};

export const reorderTasks = async (workspaceId, orderedIds) => {
  const res = await api.put('/tasks/reorder', { workspaceId, orderedIds });
  return getResponseData(res).tasks ?? [];
};
