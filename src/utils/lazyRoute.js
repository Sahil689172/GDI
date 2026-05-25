import { lazy } from 'react';

/**
 * Lazy-load a route module with one automatic retry (chunk load failures).
 */
export const lazyRoute = (factory, label = 'module') =>
  lazy(() =>
    factory().catch((err) => {
      console.warn(`[lazyRoute] Retrying ${label}…`, err);
      return factory();
    })
  );
