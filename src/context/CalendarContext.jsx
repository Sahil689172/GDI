import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  addDays,
  addWeeks,
  addMonths,
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
} from 'date-fns';

const STORAGE_KEY = 'gdi-calendar-v1';

export const EVENT_TYPES = [
  { id: 'assignment', label: 'Assignment' },
  { id: 'goal', label: 'Goal' },
  { id: 'focus', label: 'Focus' },
  { id: 'reminder', label: 'Reminder' },
];

export const RECURRING_OPTIONS = [
  { id: '', label: 'None' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const toEvent = (raw) => ({
  ...raw,
  start: new Date(raw.start),
  end: new Date(raw.end),
});

const serialize = (events) =>
  events.map((e) => ({
    ...e,
    start: e.start.toISOString(),
    end: e.end.toISOString(),
  }));

const loadEvents = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored).map(toEvent);
  } catch {
    /* empty */
  }
  return [];
};

const expandRecurring = (event, rangeStart, rangeEnd) => {
  if (!event.recurring) return [{ ...event, id: event.id, parentId: event.id }];

  const instances = [];
  let cursor = startOfDay(event.start);
  const limit = 60;
  let count = 0;

  while (isBefore(cursor, rangeEnd) && count < limit) {
    if (!isBefore(cursor, rangeStart)) {
      const duration = event.end.getTime() - event.start.getTime();
      const start = new Date(cursor);
      start.setHours(
        event.start.getHours(),
        event.start.getMinutes(),
        0,
        0
      );
      const end = new Date(start.getTime() + duration);
      instances.push({
        ...event,
        id: `${event.id}-${cursor.toISOString()}`,
        parentId: event.id,
        start,
        end,
      });
    }
    if (event.recurring === 'daily') cursor = addDays(cursor, 1);
    else if (event.recurring === 'weekly') cursor = addWeeks(cursor, 1);
    else if (event.recurring === 'monthly') cursor = addMonths(cursor, 1);
    else break;
    count++;
  }
  return instances;
};

const CalendarContext = createContext();

export const useCalendar = () => {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider');
  return ctx;
};

export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState(loadEvents);
  const [googleConnected, setGoogleConnected] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize(events)));
  }, [events]);

  const getExpandedEvents = useCallback(
    (rangeStart, rangeEnd) => {
      const start = rangeStart || addMonths(new Date(), -1);
      const end = rangeEnd || addMonths(new Date(), 2);
      return events.flatMap((e) => expandRecurring(e, start, end));
    },
    [events]
  );

  const createEvent = useCallback((data) => {
    const start = data.allDay ? startOfDay(new Date(data.start)) : new Date(data.start);
    const end = data.allDay
      ? endOfDay(new Date(data.end || data.start))
      : new Date(data.end || data.start);

    const newEvent = {
      id: generateId(),
      title: data.title.trim(),
      description: data.description?.trim() || '',
      start,
      end: end < start ? start : end,
      type: data.type || 'assignment',
      priority: data.priority || 'normal',
      recurring: data.recurring || '',
      allDay: !!data.allDay,
    };
    setEvents((prev) => [...prev, newEvent]);
    return newEvent.id;
  }, []);

  const resolveParentId = useCallback(
    (idOrEvent) => {
      const id = typeof idOrEvent === 'string' ? idOrEvent : idOrEvent.parentId || idOrEvent.id;
      const direct = events.find((e) => e.id === id);
      if (direct) return direct.id;
      return events.find((e) => id.startsWith(`${e.id}-`))?.id;
    },
    [events]
  );

  const updateEvent = useCallback(
    (idOrEvent, data) => {
      const parentId = resolveParentId(idOrEvent);
      if (!parentId) return;

      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== parentId) return e;
          const start = data.start
            ? data.allDay
              ? startOfDay(new Date(data.start))
              : new Date(data.start)
            : e.start;
          const end = data.end
            ? data.allDay
              ? endOfDay(new Date(data.end))
              : new Date(data.end)
            : e.end;

          return {
            ...e,
            title: data.title?.trim() ?? e.title,
            description: data.description ?? e.description,
            start,
            end: end < start ? start : end,
            type: data.type ?? e.type,
            priority: data.priority ?? e.priority,
            recurring: data.recurring ?? e.recurring,
            allDay: data.allDay ?? e.allDay,
          };
        })
      );
    },
    [resolveParentId]
  );

  const deleteEvent = useCallback(
    (idOrEvent) => {
      const parentId = resolveParentId(idOrEvent);
      if (!parentId) return;
      setEvents((prev) => prev.filter((e) => e.id !== parentId));
    },
    [resolveParentId]
  );

  const moveEvent = useCallback(
    ({ event, start, end }) => {
      const parentId = resolveParentId(event);
      if (!parentId) return;

      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== parentId) return e;
          const duration = e.end.getTime() - e.start.getTime();
          const newStart = new Date(start);
          const newEnd = end ? new Date(end) : new Date(newStart.getTime() + duration);
          return { ...e, start: newStart, end: newEnd };
        })
      );
    },
    [resolveParentId]
  );

  const resizeEvent = useCallback(({ event, start, end }) => {
    moveEvent({ event, start, end });
  }, [moveEvent]);

  const todayEvents = useMemo(() => {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);
    return getExpandedEvents(start, end)
      .filter((e) => e.start <= end && e.end >= start)
      .sort((a, b) => a.start - b.start);
  }, [getExpandedEvents]);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    const horizon = addDays(now, 14);
    return getExpandedEvents(now, horizon)
      .filter((e) => isAfter(e.start, now) || (e.start <= now && e.end >= now))
      .filter((e) => e.type === 'assignment' || e.priority === 'high')
      .sort((a, b) => a.start - b.start)
      .slice(0, 8);
  }, [getExpandedEvents]);

  const value = {
    events,
    googleConnected,
    setGoogleConnected,
    getExpandedEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    moveEvent,
    resizeEvent,
    todayEvents,
    upcomingDeadlines,
  };

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
};
