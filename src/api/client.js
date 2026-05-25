import axios from 'axios';
import { getStoredToken, clearStoredToken } from '../utils/authStorage.js';
import { parseApiError } from '../utils/parseApiError.js';

export const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const parsed = parseApiError(error);
    const isAuthRoute = error.config?.url?.includes('/auth/login')
      || error.config?.url?.includes('/auth/signup');

    if (error.response?.status === 401 && !isAuthRoute) {
      clearStoredToken();
      onUnauthorized?.();
    }

    error.parsed = parsed;
    return Promise.reject(error);
  }
);

export const getResponseData = (response) => response.data?.data ?? response.data;
