import { api, getResponseData } from '../api/client.js';

export const fetchSyncStatus = async () => {
  const res = await api.get('/sync/status');
  return getResponseData(res).status;
};

export const pullSync = async (payload = {}) => {
  const res = await api.post('/sync/pull', payload);
  return getResponseData(res);
};

export const pushSync = async (payload = {}) => {
  const res = await api.post('/sync/push', payload);
  return getResponseData(res);
};

