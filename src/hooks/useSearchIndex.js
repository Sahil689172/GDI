import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Target,
  Folder,
  Calendar,
  Flame,
  FileText,
  Plus,
  Home,
  Moon,
  Sun,
  LayoutGrid,
} from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import { useGoals } from '../context/GoalsContext';
import { useCalendar } from '../context/CalendarContext';
import { NAV_ITEMS } from '../routes/navigation';
import { useTheme } from '../context/ThemeContext';

const formatEventMeta = (event) => {
  const d = event.start instanceof Date ? event.start : new Date(event.start);
  return `${event.type} · ${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
};

export const useSearchIndex = ({ onQuickAction, onClose }) => {
  const navigate = useNavigate();
  const { workspaces } = useTasks();
  const { goals } = useGoals();
  const { events, getExpandedEvents } = useCalendar();
  const { toggleTheme, isDark } = useTheme();

  const go = useCallback(
    (path, state) => {
      onClose?.();
      navigate(path, state ? { state } : undefined);
    },
    [navigate, onClose]
  );

  const run = useCallback(
    (fn) => {
      onClose?.();
      fn();
    },
    [onClose]
  );

  const expandedEvents = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 3, 0);
    return getExpandedEvents(start, end);
  }, [getExpandedEvents]);

  const commands = useMemo(
    () => [
      {
        id: 'cmd-add-task',
        category: 'commands',
        title: 'Add Task',
        meta: 'Create a new task',
        icon: CheckSquare,
        keywords: ['new', 'task', 'todo', 'add'],
        action: () => onQuickAction?.('task'),
      },
      {
        id: 'cmd-add-goal',
        category: 'commands',
        title: 'Add Goal',
        meta: 'Set a new objective',
        icon: Target,
        keywords: ['new', 'goal', 'objective', 'add'],
        action: () => onQuickAction?.('goal'),
      },
      {
        id: 'cmd-add-event',
        category: 'commands',
        title: 'Add Event',
        meta: 'Schedule on calendar',
        icon: Calendar,
        keywords: ['new', 'event', 'calendar', 'schedule'],
        action: () => {
          onQuickAction?.('event');
          go('/calendar');
        },
      },
      {
        id: 'cmd-focus',
        category: 'commands',
        title: 'Start Focus Session',
        meta: 'Begin pomodoro or deep work',
        icon: Flame,
        keywords: ['focus', 'pomodoro', 'timer', 'start'],
        action: () => {
          onQuickAction?.('focus');
          go('/focus');
        },
      },
      {
        id: 'cmd-note',
        category: 'commands',
        title: 'Quick Note',
        meta: 'Capture a thought',
        icon: FileText,
        keywords: ['note', 'quick', 'scratch', 'write'],
        action: () => onQuickAction?.('note'),
      },
      {
        id: 'cmd-theme',
        category: 'commands',
        title: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        meta: 'Appearance',
        icon: isDark ? Sun : Moon,
        keywords: ['theme', 'dark', 'light', 'mode', 'appearance'],
        action: () => run(toggleTheme),
      },
    ],
    [isDark, onQuickAction, go, run, toggleTheme]
  );

  const navigation = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        id: `nav-${item.path}`,
        category: 'navigation',
        title: item.title,
        meta: item.label,
        icon: item.icon,
        keywords: [item.label, item.title, item.path, 'go', 'open'],
        action: () => go(item.path),
      })),
    [go]
  );

  const taskItems = useMemo(
    () =>
      workspaces.flatMap((ws) =>
        ws.tasks.map((t) => ({
          id: `task-${t.id}`,
          category: 'tasks',
          title: t.title,
          meta: `${ws.name} · ${t.priority}${t.completed ? ' · done' : ''}`,
          icon: CheckSquare,
          keywords: [t.title, ws.name, t.priority, 'task'],
          action: () => go('/tasks'),
        }))
      ),
    [workspaces, go]
  );

  const workspaceItems = useMemo(
    () =>
      workspaces.map((ws) => ({
        id: `ws-${ws.id}`,
        category: 'workspaces',
        title: ws.name,
        meta: `${ws.tasks.length} tasks`,
        icon: Folder,
        keywords: [ws.name, 'workspace', 'folder', 'category'],
        action: () => go('/tasks'),
      })),
    [workspaces, go]
  );

  const goalItems = useMemo(
    () =>
      goals.map((g) => ({
        id: `goal-${g.id}`,
        category: 'goals',
        title: g.title,
        meta: `${g.progress}% · ${g.isCompleted ? 'completed' : 'active'}`,
        icon: Target,
        keywords: [g.title, g.description, 'goal'],
        action: () => go('/goals'),
      })),
    [goals, go]
  );

  const eventItems = useMemo(
    () =>
      expandedEvents.slice(0, 40).map((e) => ({
        id: `ev-${e.id}`,
        category: 'events',
        title: e.title,
        meta: formatEventMeta(e),
        icon: Calendar,
        keywords: [e.title, e.description, e.type, 'event', 'calendar'],
        action: () => go('/calendar'),
      })),
    [expandedEvents, go]
  );

  const allItems = useMemo(
    () => [
      ...commands,
      ...navigation,
      ...taskItems,
      ...workspaceItems,
      ...goalItems,
      ...eventItems,
    ],
    [commands, navigation, taskItems, workspaceItems, goalItems, eventItems]
  );

  const filterItems = useCallback(
    (query) => {
      const q = query.trim().toLowerCase();
      if (!q) return null;
      return allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.meta?.toLowerCase().includes(q) ||
          item.keywords?.some((k) => k.includes(q) || q.includes(k))
      );
    },
    [allItems]
  );

  const defaultGroups = useMemo(
    () => [
      { id: 'commands', label: 'Commands', icon: Plus, items: commands },
      { id: 'navigation', label: 'Go to', icon: LayoutGrid, items: navigation },
    ],
    [commands, navigation]
  );

  const groupByCategory = useCallback((items) => {
    const order = ['commands', 'navigation', 'tasks', 'goals', 'workspaces', 'events', 'recent'];
    const labels = {
      commands: 'Commands',
      navigation: 'Go to',
      tasks: 'Tasks',
      goals: 'Goals',
      workspaces: 'Workspaces',
      events: 'Events',
      recent: 'Recent',
    };
    const icons = {
      commands: Plus,
      navigation: Home,
      tasks: CheckSquare,
      goals: Target,
      workspaces: Folder,
      events: Calendar,
      recent: BarChart2,
    };
    const map = {};
    items.forEach((item) => {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    });
    return order
      .filter((cat) => map[cat]?.length)
      .map((cat) => ({
        id: cat,
        label: labels[cat] || cat,
        icon: icons[cat] || CheckSquare,
        items: map[cat],
      }));
  }, []);

  return {
    allItems,
    commands,
    filterItems,
    defaultGroups,
    groupByCategory,
  };
};
