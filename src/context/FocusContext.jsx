import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { PRESETS } from '../components/focus/focusConstants';
import { useAuth } from './AuthContext';
import * as focusApi from '../services/focusApi.js';
import { clearLegacyFocusStorage } from '../utils/clearLegacyStorage.js';

const emptyStats = {
  totalHours: 0,
  avgSession: 0,
  dailyHoursToday: 0,
  dailyMinutesToday: 0,
  weekDays: Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      minutes: 0,
    };
  }),
  bestTime: '—',
  sessionCount: 0,
  pomodoroCycle: 0,
};

const FocusContext = createContext(null);

export const useFocus = () => {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error('useFocus must be used within FocusProvider');
  return ctx;
};

export const FocusProvider = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pomodoroCycle, setPomodoroCycle] = useState(0);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const startedAtRef = useRef(null);

  const [mode, setMode] = useState('pomodoro');
  const [phase, setPhase] = useState('work');
  const [status, setStatus] = useState('idle');
  const [secondsRemaining, setSecondsRemaining] = useState(PRESETS.pomodoroWork);
  const [totalSeconds, setTotalSeconds] = useState(PRESETS.pomodoroWork);
  const [customMinutes, setCustomMinutes] = useState(45);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [lastCompleted, setLastCompleted] = useState(null);

  const intervalRef = useRef(null);
  const endAtRef = useRef(null);

  const refreshFocusData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const [sessions, focusStats] = await Promise.all([
        focusApi.fetchSessions(),
        focusApi.fetchFocusStats(),
      ]);
      setHistory(sessions);
      setStats({ ...focusStats, pomodoroCycle });
    } catch (err) {
      setError(err.parsed?.message || 'Failed to load focus data');
      setHistory([]);
      setStats(emptyStats);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, pomodoroCycle]);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      clearLegacyFocusStorage();
      refreshFocusData();
    } else {
      setHistory([]);
      setStats(emptyStats);
      setError(null);
      clearLegacyFocusStorage();
    }
  }, [isAuthenticated, authLoading, refreshFocusData]);

  const getDurationForPhase = useCallback(
    (m, ph) => {
      if (m === 'deep') return PRESETS.deepWork;
      if (m === 'longBreak') return PRESETS.longBreak;
      if (m === 'custom') return customMinutes * 60;
      if (ph === 'shortBreak') return PRESETS.pomodoroShort;
      if (ph === 'longBreak') return PRESETS.pomodoroLong;
      return PRESETS.pomodoroWork;
    },
    [customMinutes]
  );

  const endActiveSession = useCallback(
    async ({ completed }) => {
      if (!isAuthenticated || !activeSessionId) return;
      try {
        const endedAt = new Date().toISOString();
        const session = await focusApi.endSession({
          sessionId: activeSessionId,
          completed: Boolean(completed),
          endedAt,
          notes: '',
        });
        setActiveSessionId(null);
        startedAtRef.current = null;
        if (session?.completed) {
          setHistory((prev) => [session, ...prev].slice(0, 200));
          setLastCompleted(session);
          setShowComplete(true);
          setTimeout(() => setShowComplete(false), 3200);
        }
        const focusStats = await focusApi.fetchFocusStats();
        setStats({ ...focusStats, pomodoroCycle });
      } catch (err) {
        setError(err.parsed?.message || 'Failed to end focus session');
      }
    },
    [isAuthenticated, activeSessionId, pomodoroCycle]
  );

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    endAtRef.current = null;
  }, []);

  const applyDuration = useCallback(
    (m, ph) => {
      const dur = getDurationForPhase(m, ph);
      setSecondsRemaining(dur);
      setTotalSeconds(dur);
    },
    [getDurationForPhase]
  );

  const selectMode = useCallback(
    (newMode) => {
      clearTimer();
      setStatus('idle');
      setMode(newMode);
      if (newMode === 'longBreak') {
        setPhase('longBreak');
        applyDuration(newMode, 'longBreak');
      } else if (newMode === 'deep') {
        setPhase('work');
        applyDuration(newMode, 'work');
      } else if (newMode === 'custom') {
        setPhase('work');
        applyDuration(newMode, 'work');
      } else {
        setPhase('work');
        applyDuration('pomodoro', 'work');
      }
    },
    [clearTimer, applyDuration]
  );

  const setCustomDuration = useCallback(
    (minutes) => {
      const m = Math.max(1, Math.min(180, Math.round(minutes)));
      setCustomMinutes(m);
      if (mode === 'custom') {
        clearTimer();
        setStatus('idle');
        const dur = m * 60;
        setSecondsRemaining(dur);
        setTotalSeconds(dur);
      }
    },
    [mode, clearTimer]
  );

  const tick = useCallback(() => {
    if (!endAtRef.current) return;
    const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
    setSecondsRemaining(left);
    if (left <= 0) {
      clearTimer();
      setStatus('idle');
      const completedMode = mode;
      const completedPhase = phase;
      if (completedPhase === 'work') {
        endActiveSession({ completed: true });
      }

      if (completedMode === 'pomodoro') {
        if (completedPhase === 'work') {
          const cycle = pomodoroCycle + 1;
          const nextPhase = cycle % 4 === 0 ? 'longBreak' : 'shortBreak';
          setPhase(nextPhase);
          applyDuration('pomodoro', nextPhase);
          setPomodoroCycle(cycle);
        } else {
          setPhase('work');
          applyDuration('pomodoro', 'work');
        }
      } else if (completedMode !== 'longBreak') {
        setPhase('work');
        applyDuration(mode, 'work');
      }
    }
  }, [clearTimer, mode, phase, pomodoroCycle, applyDuration, endActiveSession]);

  const start = useCallback(() => {
    clearTimer();
    if (secondsRemaining <= 0) applyDuration(mode, phase);
    const dur = secondsRemaining > 0 ? secondsRemaining : getDurationForPhase(mode, phase);
    setTotalSeconds(dur);
    setSecondsRemaining(dur);
    endAtRef.current = Date.now() + dur * 1000;
    setStatus('running');
    intervalRef.current = setInterval(tick, 250);

    // Start a DB-backed session only for focus/work phases
    if (isAuthenticated && phase === 'work' && !activeSessionId) {
      const duration = Math.max(1, Math.round(dur / 60));
      focusApi
        .startSession({
          duration,
          sessionType: mode,
          notes: '',
        })
        .then((session) => {
          setActiveSessionId(session?.id || null);
          startedAtRef.current = session?.startedAt || new Date().toISOString();
        })
        .catch((err) => {
          setError(err.parsed?.message || 'Failed to start focus session');
        });
    }
  }, [clearTimer, secondsRemaining, mode, phase, applyDuration, getDurationForPhase, tick]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    clearTimer();
    setStatus('paused');
  }, [status, clearTimer]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    endAtRef.current = Date.now() + secondsRemaining * 1000;
    setStatus('running');
    intervalRef.current = setInterval(tick, 250);
  }, [status, secondsRemaining, tick]);

  const reset = useCallback(() => {
    clearTimer();
    setStatus('idle');
    setShowComplete(false);
    if (activeSessionId) endActiveSession({ completed: false });
    applyDuration(mode, phase === 'work' ? 'work' : phase);
  }, [clearTimer, mode, phase, applyDuration, activeSessionId, endActiveSession]);

  const skipBreak = useCallback(() => {
    clearTimer();
    setStatus('idle');
    setPhase('work');
    applyDuration(mode === 'pomodoro' ? 'pomodoro' : mode, 'work');
  }, [clearTimer, mode, applyDuration]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const analytics = useMemo(
    () => ({
      ...stats,
      pomodoroCycle,
    }),
    [stats, pomodoroCycle]
  );

  const progress = totalSeconds > 0 ? secondsRemaining / totalSeconds : 0;

  const phaseLabel =
    phase === 'work'
      ? mode === 'deep'
        ? 'Deep Work'
        : mode === 'custom'
          ? 'Custom Session'
          : 'Focus'
      : phase === 'longBreak'
        ? 'Long Break'
        : 'Short Break';

  const value = {
    mode,
    phase,
    phaseLabel,
    status,
    secondsRemaining,
    totalSeconds,
    progress,
    customMinutes,
    isFullscreen,
    setIsFullscreen,
    showComplete,
    lastCompleted,
    selectMode,
    setCustomDuration,
    start,
    pause,
    resume,
    reset,
    skipBreak,
    analytics,
    history,
    loading,
    error,
    refreshFocusData,
  };

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
};
