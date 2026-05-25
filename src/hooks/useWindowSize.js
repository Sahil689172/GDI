import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [size, setSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  useEffect(() => {
    const onResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
};

export const useIsMobile = () => {
  const { width } = useWindowSize();
  return width < 768;
};

export const useIsTablet = () => {
  const { width } = useWindowSize();
  return width >= 768 && width < 1024;
};
