import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FolderPlus } from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Done' },
  { id: 'high', label: 'High Priority' },
];

export const TaskToolbar = ({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  onCreateWorkspace,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="flex flex-col gap-3 mb-6"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks and workspaces..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-subtle focus:outline-none focus:border-border-strong focus:shadow-glass-glow font-sans transition-all"
          />
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateWorkspace}
          className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-elevated border border-border border border-border text-xs font-semibold uppercase tracking-wider text-foreground hover:shadow-glass-glow hover:border-border-strong transition-all"
        >
          <FolderPlus className="w-4 h-4 text-muted" />
          <span className="whitespace-nowrap">New Workspace</span>
        </motion.button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Filter className="w-3.5 h-3.5 text-subtle shrink-0 hidden sm:block" />
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`
              shrink-0 px-3 py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all duration-200
              ${filter === f.id
                ? 'bg-elevated border border-border-strong text-foreground shadow-glass-glow'
                : 'bg-surface border border-border text-muted hover:text-foreground hover:border-border'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
