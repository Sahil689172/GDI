const cache = new Map();

const ROUTE_LOADERS = {
  '/': () => import('../pages/HomePage'),
  '/tasks': () => import('../pages/TasksPage'),
  '/goals': () => import('../pages/GoalsPage'),
  '/calendar': () => import('../pages/CalendarPage'),
  '/analytics': () => import('../pages/AnalyticsPage'),
  '/focus': () => import('../pages/FocusPage'),
  '/profile': () => import('../pages/ProfilePage'),
};

export const prefetchRoute = (path) => {
  const loader = ROUTE_LOADERS[path];
  if (!loader || cache.has(path)) return;
  cache.set(
    path,
    loader().catch(() => {
      cache.delete(path);
    })
  );
};

export const prefetchOnIntent = (path) => () => prefetchRoute(path);
