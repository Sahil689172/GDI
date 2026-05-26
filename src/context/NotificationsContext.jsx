import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useAuth } from './AuthContext';
import * as notificationsApi from '../services/notificationsApi.js';
import { sortNotifications } from '../utils/notificationUtils.js';

const NotificationsContext = createContext(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
};

export const NotificationsProvider = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const generatedRef = useRef(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await notificationsApi.fetchNotifications({ limit: 50 });
      setNotifications(sortNotifications(data.notifications));
      setUnreadCount(data.unreadCount);
    } catch (err) {
      setError(err.parsed?.message || 'Failed to load notifications');
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const bootstrap = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      await notificationsApi.generateReminders();
    } catch {
      /* non-blocking */
    }
    await refresh();
  }, [isAuthenticated, refresh]);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      if (!generatedRef.current) {
        generatedRef.current = true;
        bootstrap();
      } else {
        refresh();
      }
    } else {
      generatedRef.current = false;
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
      setPanelOpen(false);
    }
  }, [isAuthenticated, authLoading, bootstrap, refresh]);

  const openPanel = useCallback(() => {
    setPanelOpen(true);
    refresh();
  }, [refresh]);

  const closePanel = useCallback(() => setPanelOpen(false), []);

  const markRead = useCallback(async (id) => {
    try {
      const updated = await notificationsApi.markNotificationRead(id);
      setNotifications((prev) =>
        sortNotifications(prev.map((n) => (n.id === id ? { ...n, ...updated, read: true } : n)))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      setError(err.parsed?.message || 'Failed to mark as read');
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await notificationsApi.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err.parsed?.message || 'Failed to mark all as read');
    }
  }, []);

  const remove = useCallback(async (id) => {
    const target = notifications.find((n) => n.id === id);
    try {
      await notificationsApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (target && !target.read) setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      setError(err.parsed?.message || 'Failed to delete notification');
    }
  }, [notifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      panelOpen,
      openPanel,
      closePanel,
      refresh,
      markRead,
      markAllRead,
      remove,
    }),
    [
      notifications,
      unreadCount,
      loading,
      error,
      panelOpen,
      openPanel,
      closePanel,
      refresh,
      markRead,
      markAllRead,
      remove,
    ]
  );

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
};
