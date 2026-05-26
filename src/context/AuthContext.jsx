import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as authApi from '../services/authApi.js';
import { setStoredToken, clearStoredToken, getStoredToken } from '../utils/authStorage.js';
import { setUnauthorizedHandler } from '../api/client.js';
import { validateLogin, validateSignup } from '../utils/authValidation.js';
import { clearAllLegacyAppStorage } from '../utils/clearLegacyStorage.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [status, setStatus] = useState(() => (getStoredToken() ? 'loading' : 'unauthenticated'));
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const applySession = useCallback(({ user: nextUser, token: nextToken }) => {
    setUser(nextUser);
    setToken(nextToken);
    setStoredToken(nextToken);
    setStatus('authenticated');
    setError(null);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    clearStoredToken();
    clearAllLegacyAppStorage();
    setStatus('unauthenticated');
    setError(null);
  }, []);

  const bootstrap = useCallback(async () => {
    const stored = getStoredToken();
    if (!stored) {
      setStatus('unauthenticated');
      return;
    }

    setStatus('loading');
    try {
      const data = await authApi.fetchProfile();
      setUser(data.user);
      setToken(stored);
      setStatus('authenticated');
    } catch {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    setUnauthorizedHandler(() => clearSession());
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  const signup = useCallback(async (form) => {
    const validation = validateSignup(form);
    if (!validation.valid) {
      setError({ message: 'Please fix the highlighted fields', fieldErrors: validation.fieldErrors });
      return { ok: false, fieldErrors: validation.fieldErrors };
    }

    setActionLoading(true);
    setError(null);
    try {
      const data = await authApi.signup(form);
      applySession(data);
      return { ok: true, user: data.user };
    } catch (err) {
      const parsed = err.parsed ?? { message: 'Signup failed', fieldErrors: {} };
      setError(parsed);
      return { ok: false, ...parsed };
    } finally {
      setActionLoading(false);
    }
  }, [applySession]);

  const login = useCallback(async (form) => {
    const validation = validateLogin(form);
    if (!validation.valid) {
      setError({ message: 'Please fix the highlighted fields', fieldErrors: validation.fieldErrors });
      return { ok: false, fieldErrors: validation.fieldErrors };
    }

    setActionLoading(true);
    setError(null);
    try {
      const data = await authApi.login(form);
      applySession(data);
      return { ok: true, user: data.user };
    } catch (err) {
      const parsed = err.parsed ?? { message: 'Login failed', fieldErrors: {} };
      setError(parsed);
      return { ok: false, ...parsed };
    } finally {
      setActionLoading(false);
    }
  }, [applySession]);

  const logout = useCallback(async () => {
    setActionLoading(true);
    try {
      await authApi.logout();
    } catch {
      /* clear local session even if API fails */
    } finally {
      clearSession();
      setActionLoading(false);
    }
  }, [clearSession]);

  const refreshProfile = useCallback(async () => {
    if (!getStoredToken()) return;
    try {
      const data = await authApi.fetchProfile();
      setUser(data.user);
    } catch {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      status,
      actionLoading,
      error,
      isAuthenticated: status === 'authenticated' && !!user,
      isLoading: status === 'loading',
      signup,
      login,
      logout,
      refreshProfile,
      clearError: () => setError(null),
    }),
    [user, token, status, actionLoading, error, signup, login, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
