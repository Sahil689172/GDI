import { useMemo } from 'react';

/**
 * Stable context value object — avoids re-renders when deps unchanged.
 */
export const useMemoContextValue = (factory, deps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
};
