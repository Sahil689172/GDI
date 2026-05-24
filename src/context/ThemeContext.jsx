import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

const STORAGE_KEY = 'gdi-theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  return localStorage.getItem(STORAGE_KEY) || 'dark';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const applyTheme = useCallback((next) => {
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const setTheme = useCallback(
    (next) => {
      if (next === theme) return;
      setIsTransitioning(true);
      document.documentElement.classList.add('theme-transition');
      setThemeState(next);
      const timer = setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
        setIsTransitioning(false);
      }, 400);
      return () => clearTimeout(timer);
    },
    [theme]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, toggleTheme, isDark, isTransitioning }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
