import { api, getResponseData } from '../api/client.js';

export const fetchGoals = async (params = {}) => {
  const res = await api.get('/goals', { params });
  const data = getResponseData(res);
  return {
    goals: data.goals ?? [],
    analytics: data.analytics ?? null,
  };
};

export const fetchGoalAnalytics = async () => {
  const res = await api.get('/goals/analytics/summary');
  return getResponseData(res).analytics;
};

export const createGoal = async (payload) => {
  const res = await api.post('/goals', payload);
  return getResponseData(res).goal;
};

export const updateGoal = async (id, payload) => {
  const res = await api.put(`/goals/${id}`, payload);
  return getResponseData(res).goal;
};

export const deleteGoal = async (id) => {
  await api.delete(`/goals/${id}`);
};

export const logGoalDay = async (id) => {
  const res = await api.post(`/goals/${id}/log-day`);
  return getResponseData(res).goal;
};

export const archiveGoal = async (id) => updateGoal(id, { status: 'archived' });
