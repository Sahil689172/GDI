import { FocusSession } from '../models/FocusSession.js';
import { toObjectId, assertUserOwns } from '../utils/ownership.js';

const formatDate = (d) => d.toISOString().split('T')[0];

const toPublicSession = (s) => ({
  id: s._id,
  duration: s.duration,
  startedAt: s.startedAt,
  endedAt: s.endedAt,
  completed: Boolean(s.completed),
  sessionType: s.sessionType,
  notes: s.notes || '',
  createdAt: s.createdAt,
});

export const listSessions = async (userId, { limit = 200 } = {}) => {
  const sessions = await FocusSession.find({ user: userId })
    .sort({ startedAt: -1 })
    .limit(limit);

  return sessions.map(toPublicSession);
};

export const startSession = async (userId, { duration, sessionType, notes }) => {
  const startedAt = new Date();
  const session = await FocusSession.create({
    user: userId,
    duration,
    sessionType,
    startedAt,
    endedAt: null,
    completed: false,
    notes: notes || '',
    // legacy compatibility
    mode: sessionType,
    phase: 'work',
    minutes: 0,
    completedAt: null,
    hourOfDay: startedAt.getHours(),
  });

  return toPublicSession(session);
};

export const endSession = async (userId, { sessionId, completed, endedAt, notes }) => {
  const id = toObjectId(sessionId);
  const session = await FocusSession.findOne({ _id: id, user: userId });
  assertUserOwns(session, userId, 'Focus session');

  const endAt = endedAt ? new Date(endedAt) : new Date();
  session.endedAt = endAt;
  session.completed = Boolean(completed);
  if (notes !== undefined) session.notes = notes || '';

  // compute actual minutes (ceil) but cap to planned duration for completed sessions
  const diffMin = Math.max(
    0,
    Math.ceil((endAt.getTime() - new Date(session.startedAt).getTime()) / 60000)
  );
  const actualMin = session.completed ? Math.min(diffMin, session.duration) : diffMin;
  session.minutes = actualMin;
  session.completedAt = session.completed ? endAt : null;
  session.hourOfDay = endAt.getHours();

  await session.save();
  return toPublicSession(session);
};

export const getFocusStats = async (userId) => {
  const sessions = await FocusSession.find({
    user: userId,
    completed: true,
  }).sort({ endedAt: -1 });

  const totalMinutes = sessions.reduce((a, s) => a + (s.minutes || 0), 0);
  const totalHours = Number((totalMinutes / 60).toFixed(1));
  const sessionCount = sessions.length;
  const avgSession = sessionCount > 0 ? Math.round(totalMinutes / sessionCount) : 0;

  const dailyMinutes = {};
  sessions.forEach((s) => {
    const key = formatDate(s.endedAt || s.completedAt || s.startedAt);
    dailyMinutes[key] = (dailyMinutes[key] || 0) + (s.minutes || 0);
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
    const h = typeof s.hourOfDay === 'number' ? s.hourOfDay : 0;
    hourCounts[h] = (hourCounts[h] || 0) + 1;
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

  // streak = consecutive days with >=1 completed session
  const days = new Set(Object.keys(dailyMinutes).filter((k) => dailyMinutes[k] > 0));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = formatDate(d);
    if (!days.has(key)) break;
    streak += 1;
  }

  return {
    totalHours,
    avgSession,
    dailyHoursToday: Number((dailyMinutesToday / 60).toFixed(1)),
    dailyMinutesToday,
    weekDays,
    bestTime,
    sessionCount,
    completedSessionCount: sessionCount,
    streak,
  };
};
