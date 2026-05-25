import { api, getResponseData } from '../api/client.js';

export const signup = async (payload) => {
  const res = await api.post('/auth/signup', payload);
  return getResponseData(res);
};

export const login = async (payload) => {
  const res = await api.post('/auth/login', payload);
  return getResponseData(res);
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const fetchProfile = async () => {
  const res = await api.get('/auth/profile');
  return getResponseData(res);
};
