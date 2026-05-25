import React, { useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useCalendar } from '../../context/CalendarContext';
import { eventStyleGetter } from './eventUtils';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

export const CalendarWidget = ({
  view,
  date,
  onNavigate,
  onView,
  onSelectEvent,
  onSelectSlot,
  onShowMore,
  filteredEvents,
  height = 560,
}) => {
  const { moveEvent, resizeEvent } = useCalendar();

  const events = useMemo(
    () =>
      filteredEvents.map((e) => ({
        ...e,
        title: e.title,
      })),
    [filteredEvents]
  );

  const handleEventDrop = useCallback(
    ({ event, start, end }) => {
      moveEvent({ event, start, end });
    },
    [moveEvent]
  );

  const handleEventResize = useCallback(
    ({ event, start, end }) => {
      resizeEvent({ event, start, end });
    },
    [resizeEvent]
  );

  return (
    <div className="gdi-calendar w-full min-w-0 overflow-hidden" style={{ height }}>
      <DnDCalendar
        localizer={localizer}
        events={events}
        view={view}
        date={date}
        onNavigate={onNavigate}
        onView={onView}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable
        resizable
        draggableAccessor={() => true}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        eventPropGetter={eventStyleGetter}
        popup={false}
        doShowMoreDrillDown={false}
        onShowMore={onShowMore}
        showMultiDayTimes
        step={15}
        timeslots={4}
        scrollToTime={new Date(1970, 0, 1, 8, 0)}
        dayLayoutAlgorithm="no-overlap"
        formats={{
          timeGutterFormat: 'h a',
          eventTimeRangeFormat: ({ start, end }) =>
            `${format(start, 'h:mm a')} – ${format(end, 'h:mm a')}`,
        }}
      />
    </div>
  );
};
