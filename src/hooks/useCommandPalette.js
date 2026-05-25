import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

export const useCommandPalette = ({ items, isOpen, onSelect, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef(null);

  const flatItems = useMemo(() => items, [items]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [flatItems, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const el = listRef.current?.querySelector('[data-selected="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex, isOpen]);

  const selectItem = useCallback(
    (index) => {
      const item = flatItems[index];
      if (item) {
        onSelect?.(item);
        item.action?.();
      }
    },
    [flatItems, onSelect]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % Math.max(flatItems.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + flatItems.length) % Math.max(flatItems.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        selectItem(selectedIndex);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatItems.length, selectedIndex, selectItem, onClose]);

  return {
    selectedIndex,
    setSelectedIndex,
    listRef,
    selectItem,
    flatItems,
  };
};
