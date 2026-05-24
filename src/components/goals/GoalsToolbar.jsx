import React from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, SlidersHorizontal } from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

const SORTS = [
  { id: 'progress-desc', label: 'Progress ↓' },
  { id: 'progress-asc', label: 'Progress ↑' },
  { id: 'streak-desc', label: 'Streak' },
  { id: 'title', label: 'Name' },
];

export const GoalsToolbar = ({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  onCreateGoal,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 mb-6"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search goals..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl input-field text-xs font-sans transition-all"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateGoal}
          className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-xs font-semibold uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </motion.button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <SlidersHorizontal className="w-3.5 h-3.5 text-subtle shrink-0 hidden sm:block" />
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all ${
                filter === f.id
                  ? 'bg-elevated border border-border-strong text-foreground shadow-glass-glow'
                  : 'bg-surface border border-border text-muted hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-surface border border-border rounded-xl px-3 py-1.5 text-[10px] font-mono uppercase text-foreground focus:outline-none focus:border-border-strong sm:ml-auto"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id} className="bg-background text-foreground">
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
};
