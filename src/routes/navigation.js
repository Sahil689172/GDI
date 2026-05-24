import {
  Home,
  CheckSquare,
  Target,
  Calendar,
  BarChart2,
  Flame,
  User,
} from 'lucide-react';

export const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home, title: 'Command Center' },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare, title: 'Focus Tasks' },
  { path: '/goals', label: 'Goals', icon: Target, title: 'Flow Objectives' },
  { path: '/calendar', label: 'Calendar', icon: Calendar, title: 'Flow Calendar' },
  { path: '/analytics', label: 'Analytics', icon: BarChart2, title: 'Diagnostics' },
  { path: '/focus', label: 'Focus', icon: Flame, title: 'Focus Chamber' },
  { path: '/profile', label: 'Profile', icon: User, title: 'Credentials' },
];

export const getPageTitle = (pathname) => {
  const item = NAV_ITEMS.find((nav) => nav.path === pathname);
  return item?.title ?? 'Gotta-do-it';
};
