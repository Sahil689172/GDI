import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Calendar } from 'lucide-react';

const VIEWS = [
  { id: 'month', label: 'Month' },
  { id: 'week', label: 'Week' },
  { id: 'day', label: 'Day' },
];

const TYPE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'assignment', label: 'Tasks' },
  { id: 'goal', label: 'Goals' },
  { id: 'focus', label: 'Focus' },
  { id: 'reminder', label: 'Reminders' },
];

export const CalendarToolbar = ({
  view,
  onViewChange,
  date,
  onNavigate,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  onToday,
}) => {
  const label = date.toLocaleDateString([], {
    month: 'long',
    year: 'numeric',
    ...(view === 'day' ? { day: 'numeric', weekday: 'short' } : {}),
  });

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('PREV')}
            className="p-2 rounded-xl border border-border text-muted hover:text-foreground hover:border-border-strong transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onToday}
            className="px-3 py-2 rounded-xl border border-border text-[10px] font-mono uppercase tracking-wider text-muted hover:text-foreground hover:border-border-strong transition-all"
          >
            Today
          </button>
          <button
            onClick={() => onNavigate('NEXT')}
            className="p-2 rounded-xl border border-border text-muted hover:text-foreground hover:border-border-strong transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-foreground font-sans ml-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted" />
            {label}
          </span>
        </div>

        <div className="flex p-1 rounded-xl bg-surface border border-border">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => onViewChange(v.id)}
              className={`relative px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors ${
                view === v.id ? 'text-foreground' : 'text-muted hover:text-foreground'
              }`}
            >
              {view === v.id && (
                <motion.div
                  layoutId="cal-view"
                  className="absolute inset-0 rounded-lg bg-elevated border border-border-strong shadow-glass-glow"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl input-field text-xs font-sans"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => onTypeFilterChange(f.id)}
              className={`shrink-0 px-3 py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider border transition-all ${
                typeFilter === f.id
                  ? 'bg-elevated border-border-strong text-foreground'
                  : 'bg-surface border-border text-muted hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
