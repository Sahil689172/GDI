import { api, getResponseData } from '../api/client.js';

export const fetchAnalytics = async (period = 'weekly') => {
  const res = await api.get('/analytics', { params: { period } });
  return getResponseData(res).analytics;
};
