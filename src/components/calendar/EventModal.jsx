import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { EVENT_TYPES, RECURRING_OPTIONS } from '../../context/CalendarContext';

const PRIORITIES = [
  { id: 'low', label: 'Low' },
  { id: 'normal', label: 'Normal' },
  { id: 'high', label: 'High' },
];

const toInputDate = (d) => format(d, 'yyyy-MM-dd');
const toInputTime = (d) => format(d, 'HH:mm');

export const EventModal = ({
  open,
  onClose,
  onSave,
  onDelete,
  editEvent = null,
  defaultSlot = null,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('assignment');
  const [priority, setPriority] = useState('normal');
  const [recurring, setRecurring] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('10:00');

  useEffect(() => {
    if (!open) return;

    if (editEvent) {
      setTitle(editEvent.title);
      setDescription(editEvent.description || '');
      setType(editEvent.type);
      setPriority(editEvent.priority);
      setRecurring(editEvent.recurring || '');
      setAllDay(editEvent.allDay);
      setStartDate(toInputDate(editEvent.start));
      setEndDate(toInputDate(editEvent.end));
      setStartTime(toInputTime(editEvent.start));
      setEndTime(toInputTime(editEvent.end));
    } else if (defaultSlot) {
      const start = defaultSlot.start || new Date();
      const end = defaultSlot.end || new Date(start.getTime() + 60 * 60 * 1000);
      setTitle('');
      setDescription('');
      setType('assignment');
      setPriority('normal');
      setRecurring('');
      setAllDay(defaultSlot.allDay ?? false);
      setStartDate(toInputDate(start));
      setEndDate(toInputDate(end));
      setStartTime(toInputTime(start));
      setEndTime(toInputTime(end));
    } else {
      const now = new Date();
      const end = new Date(now.getTime() + 60 * 60 * 1000);
      setTitle('');
      setDescription('');
      setType('assignment');
      setPriority('normal');
      setRecurring('');
      setAllDay(false);
      setStartDate(toInputDate(now));
      setEndDate(toInputDate(end));
      setStartTime(toInputTime(now));
      setEndTime(toInputTime(end));
    }
  }, [open, editEvent, defaultSlot]);

  const buildDateTime = (dateStr, timeStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (allDay) return new Date(y, m - 1, d);
    const [hh, mm] = timeStr.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const start = buildDateTime(startDate, startTime);
    const end = buildDateTime(endDate, endTime);

    onSave({
      title,
      description,
      type,
      priority,
      recurring,
      allDay,
      start,
      end,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[65] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-overlay backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto liquid-glass rounded-t-2xl sm:rounded-2xl border border-border shadow-glass-glow p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-foreground font-sans">
                {editEvent ? 'Edit Event' : 'Schedule Event'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-subtle hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full input-field text-sm"
                  placeholder="Event title"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full input-field text-xs resize-none"
                  placeholder="Optional notes"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full input-field text-xs"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full input-field text-xs"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={(e) => setAllDay(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-xs text-muted font-sans">All day</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">
                    Start
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full input-field text-xs font-mono mb-1.5"
                  />
                  {!allDay && (
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full input-field text-xs font-mono"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">
                    End
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full input-field text-xs font-mono mb-1.5"
                  />
                  {!allDay && (
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full input-field text-xs font-mono"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">
                  Recurring
                </label>
                <select
                  value={recurring}
                  onChange={(e) => setRecurring(e.target.value)}
                  className="w-full input-field text-xs"
                >
                  {RECURRING_OPTIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                {editEvent && onDelete && (
                  <button
                    type="button"
                    onClick={onDelete}
                    className="px-4 py-2.5 rounded-xl border border-border text-muted hover:text-foreground hover:border-border-strong transition-all flex items-center gap-2 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-xs text-muted hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  {editEvent ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
