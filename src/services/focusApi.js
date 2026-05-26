import { api, getResponseData } from '../api/client.js';

export const fetchSessions = async () => {
  const res = await api.get('/focus/sessions');
  return getResponseData(res).sessions ?? [];
};

export const fetchFocusStats = async () => {
  const res = await api.get('/focus/stats');
  return getResponseData(res).stats;
};

export const createSession = async (payload) => {
  const res = await api.post('/focus/sessions', payload);
  return getResponseData(res).session;
};
