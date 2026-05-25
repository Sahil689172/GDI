import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useSearchIndex } from '../../hooks/useSearchIndex';
import { useCommandPalette } from '../../hooks/useCommandPalette';
import { SearchCategoryGroup } from './SearchCategoryGroup';

const RECENT_KEY = 'gdi-recent-searches';
const MAX_RECENT = 6;

const loadRecent = () => {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRecent = (list) => {
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
};

export const CommandPalette = () => {
  const { searchOpen, closeSearch, triggerQuickAction } = useApp();
  const [query, setQuery] = useState('');
  const [recentQueries, setRecentQueries] = useState(loadRecent);
  const inputRef = useRef(null);

  const handleClose = useCallback(() => {
    closeSearch();
    setQuery('');
  }, [closeSearch]);

  const { filterItems, defaultGroups, groupByCategory } = useSearchIndex({
    onQuickAction: triggerQuickAction,
    onClose: handleClose,
  });

  const recentItems = useMemo(() => {
    if (query.trim()) return [];
    return recentQueries.map((q) => ({
      id: `recent-${q}`,
      category: 'recent',
      title: q,
      meta: 'Recent search',
      icon: Clock,
      keywords: [q],
      action: () => setQuery(q),
    }));
  }, [recentQueries, query]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) {
      const items = [...recentItems];
      defaultGroups.forEach((g) => items.push(...g.items));
      return items;
    }
    return filterItems(q) || [];
  }, [query, filterItems, defaultGroups, recentItems]);

  const groups = useMemo(() => {
    if (!query.trim() && recentItems.length) {
      const rest = defaultGroups;
      return [
        { id: 'recent', label: 'Recent', icon: Clock, items: recentItems },
        ...rest,
      ];
    }
    if (!query.trim()) return defaultGroups;
    return groupByCategory(filtered);
  }, [query, filtered, defaultGroups, groupByCategory, recentItems]);

  const flatItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const recordSearch = useCallback(
    (item) => {
      const term = query.trim() || item.title;
      if (!term || term.length < 2) return;
      setRecentQueries((prev) => {
        const next = [term, ...prev.filter((r) => r !== term)];
        saveRecent(next);
        return next.slice(0, MAX_RECENT);
      });
    },
    [query]
  );

  const { selectedIndex, setSelectedIndex, listRef, selectItem } = useCommandPalette({
    items: flatItems,
    isOpen: searchOpen,
    onSelect: recordSearch,
    onClose: handleClose,
  });

  const groupOffsets = useMemo(() => {
    let offset = 0;
    return groups.map((g) => {
      const start = offset;
      offset += g.items.length;
      return start;
    });
  }, [groups]);

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [searchOpen]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-start justify-center sm:pt-[12vh] px-0 sm:px-4 touch-manipulation">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="absolute inset-0 bg-overlay backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="relative w-full sm:max-w-xl max-h-[min(92dvh,640px)] sm:max-h-none flex flex-col liquid-glass rounded-t-2xl sm:rounded-2xl rounded-b-none sm:rounded-b-2xl border border-border border-b-0 sm:border-b shadow-glass-glow overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-border">
              <Search className="w-4 h-4 text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search or run a command..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-subtle focus:outline-none font-sans min-w-0"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden sm:flex items-center gap-0.5 text-[9px] font-mono text-subtle bg-elevated border border-border px-2 py-0.5 rounded-md shrink-0">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-lg text-subtle hover:text-foreground hover:bg-elevated transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={listRef} className="flex-1 min-h-0 max-h-[min(60dvh,480px)] sm:max-h-[min(50vh,420px)] overflow-y-auto scroll-smooth-touch p-3 no-scrollbar">
              {flatItems.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-xs text-muted font-sans">No results found</p>
                  <p className="text-[10px] font-mono text-subtle mt-1 uppercase tracking-wider">
                    Try a different keyword
                  </p>
                </div>
              ) : (
                groups.map((group, gi) => (
                  <SearchCategoryGroup
                    key={group.id}
                    group={group}
                    flatOffset={groupOffsets[gi]}
                    selectedIndex={selectedIndex}
                    onSelect={selectItem}
                    onHover={setSelectedIndex}
                  />
                ))
              )}
            </div>

            <div className="px-4 sm:px-5 py-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
              <span className="text-[9px] font-mono text-subtle uppercase tracking-widest">
                Command palette
              </span>
              <div className="flex items-center gap-3 text-[9px] font-mono text-subtle">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
