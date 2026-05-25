import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickAction, setQuickAction] = useState(null);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((p) => !p), []);

  const triggerQuickAction = useCallback((type) => {
    setQuickAction({ type, at: Date.now() });
  }, []);

  const clearQuickAction = useCallback(() => setQuickAction(null), []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      const inField = tag === 'input' || tag === 'textarea' || e.target?.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }

      if (searchOpen) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !inField) {
        e.preventDefault();
        setQuickAction({ type: 'task', at: Date.now() });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const value = useMemo(
    () => ({
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar,
      searchOpen,
      setSearchOpen,
      openSearch,
      closeSearch,
      quickAction,
      triggerQuickAction,
      clearQuickAction,
      mobileMenuOpen,
      openMobileMenu,
      closeMobileMenu,
      toggleMobileMenu,
    }),
    [
      sidebarCollapsed,
      searchOpen,
      quickAction,
      mobileMenuOpen,
      toggleSidebar,
      openSearch,
      closeSearch,
      triggerQuickAction,
      clearQuickAction,
      openMobileMenu,
      closeMobileMenu,
      toggleMobileMenu,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
