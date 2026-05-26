import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'gdi-profile-v1';

const defaultState = () => ({
  profile: {
    name: '',
    email: '',
    bio: '',
    role: '',
  },
  appearance: {
    compactLayout: false,
    ambientBackground: true,
    reduceMotion: false,
  },
  notifications: {
    taskReminders: true,
    focusAlerts: true,
    goalMilestones: true,
    weeklyDigest: false,
    soundEnabled: false,
  },
  productivity: {
    defaultFocusMode: 'pomodoro',
    autoStartBreaks: false,
    showFocusQuotes: true,
    weekStartsMonday: true,
    defaultTaskPriority: 'normal',
  },
  calendar: {
    googleSyncEnabled: false,
    syncAssignments: true,
    syncFocusBlocks: true,
    reminderLeadMinutes: 15,
  },
  privacy: {
    localAnalytics: true,
    shareProgress: false,
    retainHistoryDays: 90,
  },
  security: {
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30,
  },
  sessions: [
    {
      id: 'sess-1',
      device: 'Windows PC',
      browser: 'Chrome',
      location: 'Local',
      lastActive: new Date().toISOString(),
      current: true,
    },
    {
      id: 'sess-2',
      device: 'Mobile',
      browser: 'Safari',
      location: 'Local',
      lastActive: new Date(Date.now() - 86400000 * 2).toISOString(),
      current: false,
    },
  ],
  connectedAccounts: {
    google: false,
    github: false,
  },
});

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultState(), ...parsed, profile: { ...defaultState().profile, ...parsed.profile } };
    }
  } catch {
    /* defaults */
  }
  return defaultState();
};

const ProfileContext = createContext();

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
};

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState(load);
  const [saveToast, setSaveToast] = useState(null);
  const syncedUserId = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    if (syncedUserId.current === user.id) return;
    syncedUserId.current = user.id;
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        name: user.name,
        email: user.email,
      },
    }));
  }, [isAuthenticated, user?.id, user?.name, user?.email]);

  useEffect(() => {
    if (!isAuthenticated) syncedUserId.current = null;
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const triggerSave = useCallback((message = 'Settings saved') => {
    setSaveToast(message);
    const t = setTimeout(() => setSaveToast(null), 2400);
    return () => clearTimeout(t);
  }, []);

  const updateProfile = useCallback(
    (updates) => {
      setData((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...updates },
      }));
      triggerSave('Profile updated');
    },
    [triggerSave]
  );

  const updateSettings = useCallback(
    (section, key, value) => {
      setData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }));
      triggerSave();
    },
    [triggerSave]
  );

  const setConnectedAccount = useCallback(
    (provider, connected) => {
      setData((prev) => ({
        ...prev,
        connectedAccounts: { ...prev.connectedAccounts, [provider]: connected },
      }));
      triggerSave(connected ? `${provider} connected` : `${provider} disconnected`);
    },
    [triggerSave]
  );

  const revokeSession = useCallback(
    (sessionId) => {
      setData((prev) => ({
        ...prev,
        sessions: prev.sessions.filter((s) => s.id !== sessionId || s.current),
      }));
      triggerSave('Session revoked');
    },
    [triggerSave]
  );

  const value = {
    profile: data.profile,
    appearance: data.appearance,
    notifications: data.notifications,
    productivity: data.productivity,
    calendar: data.calendar,
    privacy: data.privacy,
    security: data.security,
    sessions: data.sessions,
    connectedAccounts: data.connectedAccounts,
    updateProfile,
    updateSettings,
    setConnectedAccount,
    revokeSession,
    saveToast,
    triggerSave,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
