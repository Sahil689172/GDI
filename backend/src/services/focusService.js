import { FocusSession } from '../models/FocusSession.js';
import { toObjectId } from '../utils/ownership.js';

const formatDate = (d) => d.toISOString().split('T')[0];

export const listSessions = async (userId, { limit = 200 } = {}) => {
  const sessions = await FocusSession.find({ user: userId })
    .sort({ completedAt: -1 })
    .limit(limit);

  return sessions.map((s) => ({
    id: s._id,
    mode: s.mode,
    phase: s.phase,
    minutes: s.minutes,
    completedAt: s.completedAt,
    hourOfDay: s.hourOfDay,
  }));
};

export const createSession = async (userId, { mode, phase, minutes, completedAt }) => {
  const at = completedAt ? new Date(completedAt) : new Date();
  const session = await FocusSession.create({
    user: userId,
    mode,
    phase,
    minutes,
    completedAt: at,
    hourOfDay: at.getHours(),
  });

  return {
    id: session._id,
    mode: session.mode,
    phase: session.phase,
    minutes: session.minutes,
    completedAt: session.completedAt,
    hourOfDay: session.hourOfDay,
  };
};

export const getFocusStats = async (userId) => {
  const sessions = await FocusSession.find({
    user: userId,
    phase: 'work',
  }).sort({ completedAt: -1 });

  const totalMinutes = sessions.reduce((a, s) => a + s.minutes, 0);
  const totalHours = Number((totalMinutes / 60).toFixed(1));
  const sessionCount = sessions.length;
  const avgSession = sessionCount > 0 ? Math.round(totalMinutes / sessionCount) : 0;

  const dailyMinutes = {};
  sessions.forEach((s) => {
    const key = formatDate(s.completedAt);
    dailyMinutes[key] = (dailyMinutes[key] || 0) + s.minutes;
  });

  const today = formatDate(new Date());
  const dailyMinutesToday = dailyMinutes[today] || 0;

  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = formatDate(d);
    weekDays.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      minutes: dailyMinutes[key] || 0,
    });
  }

  const hourCounts = Array(24).fill(0);
  sessions.forEach((s) => {
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
    dailyHoursToday: Number((dailyMinutesToday / 60).toFixed(1)),
    dailyMinutesToday,
    weekDays,
    bestTime,
    sessionCount,
  };
};
