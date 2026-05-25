import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { addMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Link2 } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { PageHeader } from '../ui/PageHeader';
import { GlassCard } from '../ui/GlassCard';
import { ConfirmModal } from '../ui/ConfirmModal';
import { staggerContainer, staggerItem } from '../animations/pageTransitions';
import { CalendarToolbar } from '../components/calendar/CalendarToolbar';
import { CalendarWidget } from '../components/calendar/CalendarWidget';
import { TodaySchedule } from '../components/calendar/TodaySchedule';
import { UpcomingDeadlines } from '../components/calendar/UpcomingDeadlines';
import { EventModal } from '../components/calendar/EventModal';
import { GoogleCalendarSync } from '../components/calendar/GoogleCalendarSync';
import { CalendarEmptyState } from '../components/calendar/CalendarEmptyState';
import { CalendarFAB } from '../components/calendar/CalendarFAB';
import { DayEventsModal } from '../components/calendar/DayEventsModal';

export const CalendarPage = () => {
  const {
    getExpandedEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    todayEvents,
    upcomingDeadlines,
    googleConnected,
    events,
  } = useCalendar();

  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [defaultSlot, setDefaultSlot] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [dayEventsPanel, setDayEventsPanel] = useState(null);

  const rangeStart = useMemo(() => startOfMonth(addMonths(date, -1)), [date]);
  const rangeEnd = useMemo(() => endOfMonth(addMonths(date, 2)), [date]);

  const expandedEvents = useMemo(
    () => getExpandedEvents(rangeStart, rangeEnd),
    [getExpandedEvents, rangeStart, rangeEnd]
  );

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return expandedEvents.filter((e) => {
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q))
      );
    });
  }, [expandedEvents, searchQuery, typeFilter]);

  const isEmpty = events.length === 0;

  const handleNavigate = useCallback((action) => {
    if (action === 'PREV') {
      setDate((d) => {
        const next = new Date(d);
        if (view === 'month') next.setMonth(next.getMonth() - 1);
        else if (view === 'week') next.setDate(next.getDate() - 7);
        else next.setDate(next.getDate() - 1);
        return next;
      });
    } else if (action === 'NEXT') {
      setDate((d) => {
        const next = new Date(d);
        if (view === 'month') next.setMonth(next.getMonth() + 1);
        else if (view === 'week') next.setDate(next.getDate() + 7);
        else next.setDate(next.getDate() + 1);
        return next;
      });
    } else {
      setDate(action instanceof Date ? action : new Date(action));
    }
  }, [view]);

  const openCreate = useCallback((slot = null) => {
    setEditEvent(null);
    setDefaultSlot(slot);
    setEventModalOpen(true);
  }, []);

  const openEdit = useCallback((event) => {
    setEditEvent(event);
    setDefaultSlot(null);
    setEventModalOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event) => openEdit(event), [openEdit]);

  const handleShowMore = useCallback((events, dayDate) => {
    setDayEventsPanel({ date: dayDate, events });
  }, []);

  const handleSelectSlot = useCallback(
    ({ start, end, action }) => {
      if (action === 'click' || action === 'select') {
        openCreate({ start, end, allDay: view === 'month' });
      }
    },
    [openCreate, view]
  );

  const handleSave = useCallback(
    (data) => {
      if (editEvent) {
        updateEvent(editEvent, data);
      } else {
        createEvent(data);
      }
    },
    [editEvent, updateEvent, createEvent]
  );

  const handleDeleteRequest = useCallback(() => {
    if (!editEvent) return;
    setDeleteConfirm(editEvent);
    setEventModalOpen(false);
  }, [editEvent]);

  const confirmDelete = useCallback(() => {
    if (deleteConfirm) deleteEvent(deleteConfirm);
    setDeleteConfirm(null);
    setEditEvent(null);
  }, [deleteConfirm, deleteEvent]);

  const calendarHeight = view === 'month' ? 520 : view === 'week' ? 600 : 640;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <PageHeader
        title="Flow Calendar"
        subtitle="Plan assignments, goals, focus blocks, and reminders in one monochrome timeline."
        badge={googleConnected ? 'Google linked' : 'Local sync'}
      />

      <motion.div variants={staggerItem} className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setGoogleModalOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-[10px] font-mono uppercase tracking-wider text-muted hover:text-foreground hover:border-border-strong transition-all"
        >
          <Link2 className="w-3.5 h-3.5" />
          Google Calendar
        </button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
        <motion.div variants={staggerItem} className="min-w-0">
          <GlassCard className="!p-4 md:!p-5" glow>
            <CalendarToolbar
              view={view}
              onViewChange={setView}
              date={date}
              onNavigate={handleNavigate}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              onToday={() => setDate(new Date())}
            />

            {isEmpty ? (
              <CalendarEmptyState onAdd={() => openCreate()} />
            ) : (
              <CalendarWidget
                view={view}
                date={date}
                onNavigate={handleNavigate}
                onView={setView}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                onShowMore={handleShowMore}
                filteredEvents={filteredEvents}
                height={calendarHeight}
              />
            )}
          </GlassCard>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4"
        >
          <TodaySchedule events={todayEvents} onEventClick={openEdit} />
          <UpcomingDeadlines deadlines={upcomingDeadlines} onEventClick={openEdit} />
        </motion.div>
      </div>

      <CalendarFAB onClick={() => openCreate()} />

      <EventModal
        open={eventModalOpen}
        onClose={() => {
          setEventModalOpen(false);
          setEditEvent(null);
          setDefaultSlot(null);
        }}
        onSave={handleSave}
        onDelete={editEvent ? handleDeleteRequest : undefined}
        editEvent={editEvent}
        defaultSlot={defaultSlot}
      />

      <DayEventsModal
        open={!!dayEventsPanel}
        date={dayEventsPanel?.date}
        events={dayEventsPanel?.events ?? []}
        onClose={() => setDayEventsPanel(null)}
        onEventClick={openEdit}
      />

      <GoogleCalendarSync open={googleModalOpen} onClose={() => setGoogleModalOpen(false)} />

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Event"
        message="Remove this event from your calendar? Recurring series will be deleted entirely."
      />
    </motion.div>
  );
};
