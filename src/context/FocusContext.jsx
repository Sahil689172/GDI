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

const STORAGE_KEY = 'gdi-focus-v1';

const todayKey = () => new Date().toISOString().split('T')[0];

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* defaults */
  }
  return { history: [], dailyMinutes: {}, pomodoroCycle: 0 };
};

const saveState = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const FocusContext = createContext();

export const useFocus = () => {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error('useFocus must be used within FocusProvider');
  return ctx;
};

export const FocusProvider = ({ children }) => {
  const [persisted, setPersisted] = useState(loadState);
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

  useEffect(() => {
    saveState(persisted);
  }, [persisted]);

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

  const recordSession = useCallback((completedMode, completedPhase, durationSec) => {
    const minutes = Math.round(durationSec / 60);
    if (minutes < 1) return;

    const now = new Date();
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      mode: completedMode,
      phase: completedPhase,
      minutes,
      completedAt: now.toISOString(),
      hourOfDay: now.getHours(),
    };

    if (completedPhase === 'work') {
      setPersisted((prev) => {
        const day = todayKey();
        const dailyMinutes = {
          ...prev.dailyMinutes,
          [day]: (prev.dailyMinutes[day] || 0) + minutes,
        };
        return {
          ...prev,
          history: [entry, ...prev.history].slice(0, 200),
          dailyMinutes,
          pomodoroCycle:
            completedMode === 'pomodoro'
              ? (prev.pomodoroCycle || 0) + 1
              : prev.pomodoroCycle,
        };
      });
      setLastCompleted(entry);
      setShowComplete(true);
      setTimeout(() => setShowComplete(false), 3200);
    }
  }, []);

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
      recordSession(completedMode, completedPhase, totalSeconds);

      if (completedMode === 'pomodoro') {
        if (completedPhase === 'work') {
          const cycle = (persisted.pomodoroCycle || 0) + 1;
          const nextPhase = cycle % 4 === 0 ? 'longBreak' : 'shortBreak';
          setPhase(nextPhase);
          applyDuration('pomodoro', nextPhase);
        } else {
          setPhase('work');
          applyDuration('pomodoro', 'work');
        }
      } else if (completedMode !== 'longBreak') {
        setPhase('work');
        applyDuration(mode, 'work');
      }
    }
  }, [clearTimer, mode, phase, totalSeconds, recordSession, persisted.pomodoroCycle, applyDuration]);

  const start = useCallback(() => {
    clearTimer();
    if (secondsRemaining <= 0) applyDuration(mode, phase);
    const dur = secondsRemaining > 0 ? secondsRemaining : getDurationForPhase(mode, phase);
    setTotalSeconds(dur);
    setSecondsRemaining(dur);
    endAtRef.current = Date.now() + dur * 1000;
    setStatus('running');
    intervalRef.current = setInterval(tick, 250);
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
    applyDuration(mode, phase === 'work' ? 'work' : phase);
  }, [clearTimer, mode, phase, applyDuration]);

  const skipBreak = useCallback(() => {
    clearTimer();
    setStatus('idle');
    setPhase('work');
    applyDuration(mode === 'pomodoro' ? 'pomodoro' : mode, 'work');
  }, [clearTimer, mode, applyDuration]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const analytics = useMemo(() => {
    const workSessions = persisted.history.filter((s) => s.phase === 'work');
    const totalMinutes = workSessions.reduce((a, s) => a + s.minutes, 0);
    const totalHours = Number((totalMinutes / 60).toFixed(1));
    const avgSession =
      workSessions.length > 0
        ? Math.round(totalMinutes / workSessions.length)
        : 0;

    const today = todayKey();
    const dailyMinutesToday = persisted.dailyMinutes[today] || 0;
    const dailyHoursToday = Number((dailyMinutesToday / 60).toFixed(1));

    const weekDays = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      weekDays.push({
        label: d.toLocaleDateString([], { weekday: 'short' }),
        minutes: persisted.dailyMinutes[key] || 0,
      });
    }

    const hourCounts = Array(24).fill(0);
    workSessions.forEach((s) => {
      hourCounts[s.hourOfDay] = (hourCounts[s.hourOfDay] || 0) + 1;
    });
    let bestHour = 9;
    let bestCount = 0;
    hourCounts.forEach((c, h) => {
      if (c > bestCount) {
        bestCount = c;
        bestHour = h;
      }
    });
    const formatHour = (h) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hr = h % 12 || 12;
      return `${hr} ${ampm}`;
    };
    const bestTime =
      bestCount > 0
        ? `${formatHour(bestHour)} – ${formatHour((bestHour + 1) % 24)}`
        : '—';

    return {
      totalHours,
      avgSession,
      dailyHoursToday,
      dailyMinutesToday,
      weekDays,
      bestTime,
      sessionCount: workSessions.length,
      pomodoroCycle: persisted.pomodoroCycle || 0,
    };
  }, [persisted]);

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
    history: persisted.history,
  };

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
};
