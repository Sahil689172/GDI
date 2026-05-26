import { api, getResponseData } from '../api/client.js';

export const fetchGoals = async () => {
  const res = await api.get('/goals');
  return getResponseData(res).goals ?? [];
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
