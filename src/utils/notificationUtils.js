import {
  Bell,
  Target,
  CheckSquare,
  AlertTriangle,
  Flame,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';

export const NOTIFICATION_TYPE_META = {
  task_reminder: { label: 'Task', icon: CheckSquare, accent: 'text-foreground' },
  goal_reminder: { label: 'Goal', icon: Target, accent: 'text-foreground' },
  overdue: { label: 'Overdue', icon: AlertTriangle, accent: 'text-foreground' },
  streak_warning: { label: 'Streak', icon: Flame, accent: 'text-foreground' },
  daily_summary: { label: 'Summary', icon: Calendar, accent: 'text-foreground' },
  deadline: { label: 'Deadline', icon: Clock, accent: 'text-foreground' },
  system: { label: 'System', icon: Bell, accent: 'text-muted' },
};

export const getNotificationMeta = (type) =>
  NOTIFICATION_TYPE_META[type] ?? { label: 'Alert', icon: Sparkles, accent: 'text-muted' };

export const formatNotificationTime = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  const diffMs = now - date;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export const sortNotifications = (list) =>
  [...list].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
