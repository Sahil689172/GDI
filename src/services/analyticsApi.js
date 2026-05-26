import { api, getResponseData } from '../api/client.js';

export const fetchAnalytics = async (period = 'weekly') => {
  const res = await api.get('/analytics', { params: { period } });
  return getResponseData(res).analytics;
};

export const fetchDailyAnalytics = async () => {
  const res = await api.get('/analytics/daily');
  return getResponseData(res).analytics;
};

export const fetchWeeklyAnalytics = async () => {
  const res = await api.get('/analytics/weekly');
  return getResponseData(res).analytics;
};

export const fetchMonthlyAnalytics = async () => {
  const res = await api.get('/analytics/monthly');
  return getResponseData(res).analytics;
};

export const fetchHeatmap = async () => {
  const res = await api.get('/analytics/heatmap');
  return getResponseData(res).heatmap;
};
