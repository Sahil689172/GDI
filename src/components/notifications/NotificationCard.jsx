import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import { getNotificationMeta, formatNotificationTime } from '../../utils/notificationUtils.js';

export const NotificationCard = memo(function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
}) {
  const meta = getNotificationMeta(notification.type);
  const Icon = meta.icon;
  const unread = !notification.read;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`relative rounded-xl border p-4 transition-colors ${
        unread
          ? 'liquid-glass border-border-strong shadow-glass-glow'
          : 'bg-surface/60 border-border opacity-80'
      }`}
    >
      {unread && (
        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-foreground" aria-hidden />
      )}
      <div className="flex gap-3 pr-4">
        <div className="w-9 h-9 rounded-lg bg-elevated border border-border flex items-center justify-center shrink-0">
          <Icon className={`w-4 h-4 ${meta.accent}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted">
                {meta.label}
              </p>
              <h4 className="text-sm font-semibold text-foreground truncate">{notification.title}</h4>
            </div>
            <time className="text-[10px] font-mono text-subtle shrink-0">
              {formatNotificationTime(notification.createdAt)}
            </time>
          </div>
          <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-3">
            {notification.message}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-border/60">
        {unread && (
          <button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            className="touch-target inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wide border border-border hover:border-border-strong transition-colors"
          >
            <Check className="w-3 h-3" />
            Read
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(notification.id)}
          className="touch-target p-2 rounded-lg text-muted hover:text-foreground border border-transparent hover:border-border transition-colors"
          aria-label="Delete notification"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.article>
  );
});
