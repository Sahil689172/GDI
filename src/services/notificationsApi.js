import { api, getResponseData } from '../api/client.js';

export const fetchNotifications = async (params = {}) => {
  const res = await api.get('/notifications', { params });
  const data = getResponseData(res);
  return {
    notifications: data.notifications ?? [],
    unreadCount: data.unreadCount ?? 0,
  };
};

export const createNotification = async (payload) => {
  const res = await api.post('/notifications', payload);
  return getResponseData(res).notification;
};

export const markNotificationRead = async (id) => {
  const res = await api.put(`/notifications/${id}/read`);
  return getResponseData(res).notification;
};

export const markAllNotificationsRead = async () => {
  const res = await api.put('/notifications/read-all');
  return getResponseData(res).modified;
};

export const deleteNotification = async (id) => {
  await api.delete(`/notifications/${id}`);
};

export const generateReminders = async () => {
  const res = await api.post('/notifications/generate');
  return getResponseData(res);
};
