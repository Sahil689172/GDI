import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  CheckSquare,
  Target,
  Folder,
  ArrowRight,
  Command,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const SEARCH_CATEGORIES = [
  {
    id: 'tasks',
    label: 'Tasks',
    icon: CheckSquare,
    items: [
      { title: 'Release Vite Core Architecture', meta: 'High · Today' },
      { title: 'Refactor Goal State Manager', meta: 'Medium · Tomorrow' },
      { title: 'Optimize Glassmorphism Shaders', meta: 'Low · May 25' },
    ],
  },
  {
    id: 'goals',
    label: 'Goals',
    icon: Target,
    items: [
      { title: 'Master Framer Motion Physics', meta: '85% complete' },
      { title: 'Complete Gotta-do-it MVP UI', meta: '60% complete' },
      { title: 'Perfect Focus Streak', meta: '90% complete' },
    ],
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: Folder,
    items: [
      { title: 'Development', meta: '12 items' },
      { title: 'Design System', meta: '8 items' },
      { title: 'Focus Sessions', meta: '24 items' },
    ],
  },
];

export const GlobalSearch = () => {
  const { searchOpen, closeSearch } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  const filteredCategories = SEARCH_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        !query.trim() ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.meta.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  const handleNavigate = (path) => {
    closeSearch();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="absolute inset-0 bg-overlay backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="relative w-full max-w-xl liquid-glass rounded-2xl border border-border shadow-glass-glow overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <Search className="w-4 h-4 text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks, goals, categories..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-subtle focus:outline-none font-sans"
              />
              <kbd className="hidden sm:flex items-center gap-0.5 text-[9px] font-mono text-subtle bg-elevated border border-border px-2 py-0.5 rounded-md">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
              <button
                onClick={closeSearch}
                className="p-1.5 rounded-lg text-subtle hover:text-foreground hover:bg-elevated transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-3">
              {filteredCategories.length === 0 ? (
                <p className="text-xs text-subtle text-center font-mono py-8">
                  No results found
                </p>
              ) : (
                filteredCategories.map((category) => {
                  const Icon = category.icon;
                  const path =
                    category.id === 'tasks'
                      ? '/tasks'
                      : category.id === 'goals'
                        ? '/goals'
                        : '/';

                  return (
                    <div key={category.id} className="mb-3 last:mb-0">
                      <div className="flex items-center gap-2 px-2 py-1.5">
                        <Icon className="w-3 h-3 text-muted" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
                          {category.label}
                        </span>
                      </div>
                      {category.items.map((item, idx) => (
                        <motion.button
                          key={`${category.id}-${idx}`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          onClick={() => handleNavigate(path)}
                          className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-elevated border border-transparent hover:border-border transition-all text-left group"
                        >
                          <div>
                            <span className="text-xs text-foreground font-sans block">
                              {item.title}
                            </span>
                            <span className="text-[9px] font-mono text-muted mt-0.5 block">
                              {item.meta}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-subtle group-hover:text-muted group-hover:translate-x-0.5 transition-all" />
                        </motion.button>
                      ))}
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-5 py-3 border-t border-border flex items-center justify-between">
              <span className="text-[9px] font-mono text-subtle uppercase tracking-widest">
                Global Search · UI Preview
              </span>
              <span className="text-[9px] font-mono text-subtle">
                ↑↓ navigate · ↵ select · esc close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
