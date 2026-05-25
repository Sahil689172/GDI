import { format } from 'date-fns';

export const formatEventTime = (event) => {
  if (event.allDay) return 'All day';
  return `${format(event.start, 'h:mm a')} – ${format(event.end, 'h:mm a')}`;
};

export const eventStyleGetter = (event) => {
  const classes = [
    `event-type-${event.type}`,
    `event-priority-${event.priority}`,
  ];
  return { className: classes.join(' ') };
};

export const TYPE_ICONS = {
  assignment: 'Assignment',
  goal: 'Goal',
  focus: 'Focus',
  reminder: 'Reminder',
};
