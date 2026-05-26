import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationsContext';

export const NotificationBell = memo(function NotificationBell({ className = '' }) {
  const { unreadCount, openPanel } = useNotifications();

  return (
    <button
      type="button"
      onClick={openPanel}
      className={`touch-target relative p-2 rounded-xl border border-border ${className}`}
      aria-label={unreadCount ? `${unreadCount} unread notifications` : 'Notifications'}
    >
      <Bell className="w-4 h-4" />
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-foreground text-background text-[9px] font-bold font-mono flex items-center justify-center"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </motion.span>
      )}
    </button>
  );
});
