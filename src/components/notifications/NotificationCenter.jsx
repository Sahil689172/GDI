import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCheck, Loader2 } from 'lucide-react';
import { useNotifications } from '../../context/NotificationsContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { overlayVariants, paletteVariants } from '../../animations/microinteractions';
import { NotificationCard } from './NotificationCard';
import { NotificationsEmptyState } from './NotificationsEmptyState';

export const NotificationCenter = () => {
  const {
    panelOpen,
    closePanel,
    notifications,
    unreadCount,
    loading,
    error,
    markRead,
    markAllRead,
    remove,
    refresh,
  } = useNotifications();

  useScrollLock(panelOpen);

  const handleBackdrop = useCallback(
    (e) => {
      if (e.target === e.currentTarget) closePanel();
    },
    [closePanel]
  );

  return (
    <AnimatePresence>
      {panelOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end sm:items-start justify-center sm:justify-end p-0 sm:p-4 md:p-6"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={handleBackdrop}
          role="presentation"
        >
          <motion.aside
            variants={paletteVariants}
            className="relative w-full sm:max-w-md max-h-[min(92dvh,720px)] flex flex-col liquid-glass glass-interactive rounded-t-2xl sm:rounded-2xl border border-border shadow-glass-glow overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            aria-label="Notification center"
          >
            <header className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-elevated border border-border flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
                  <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'Inbox clear'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="touch-target p-2 rounded-xl border border-border"
                    title="Mark all read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={closePanel}
                  className="touch-target p-2 rounded-xl border border-border"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 space-y-3">
              {loading && notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-2 text-muted">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-xs font-mono uppercase tracking-widest">Loading</span>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-border bg-surface p-3 text-xs text-muted">
                  {error}
                  <button
                    type="button"
                    onClick={refresh}
                    className="block mt-2 text-foreground font-medium underline-offset-2 hover:underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && notifications.length === 0 && !error && <NotificationsEmptyState />}

              <AnimatePresence mode="popLayout">
                {notifications.map((n) => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    onMarkRead={markRead}
                    onDelete={remove}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
