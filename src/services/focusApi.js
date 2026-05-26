import { api, getResponseData } from '../api/client.js';

export const fetchSessions = async () => {
  const res = await api.get('/focus');
  return getResponseData(res).sessions ?? [];
};

export const fetchFocusStats = async () => {
  const res = await api.get('/focus/stats');
  return getResponseData(res).stats;
};

export const startSession = async (payload) => {
  const res = await api.post('/focus/start', payload);
  return getResponseData(res).session;
};

export const endSession = async (payload) => {
  const res = await api.post('/focus/end', payload);
  return getResponseData(res).session;
};
