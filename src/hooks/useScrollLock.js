import { useEffect } from 'react';

let lockCount = 0;
let savedScrollY = 0;

/**
 * Locks document scroll while overlays (drawer, modals, fullscreen) are open.
 * Uses a refcount so nested locks do not break restore.
 */
export const useScrollLock = (locked) => {
  useEffect(() => {
    if (!locked) return undefined;

    lockCount += 1;
    if (lockCount === 1) {
      savedScrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.classList.add('scroll-locked');
      document.body.classList.add('scroll-locked');
      document.body.style.top = `-${savedScrollY}px`;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.documentElement.classList.remove('scroll-locked');
        document.body.classList.remove('scroll-locked');
        document.body.style.top = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [locked]);
};
