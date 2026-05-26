const LEGACY_KEYS = [
  'gdi-workspaces-v1',
  'gdi-goals-v1',
  'gdi-focus-v1',
  'gdi-calendar-v1',
];

const removeKeys = (keys) => {
  keys.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  });
};

export const clearLegacyTaskStorage = () => removeKeys(['gdi-workspaces-v1']);

export const clearLegacyGoalStorage = () => removeKeys(['gdi-goals-v1']);

export const clearLegacyFocusStorage = () => removeKeys(['gdi-focus-v1']);

export const clearLegacyCalendarStorage = () => removeKeys(['gdi-calendar-v1']);

export const clearAllLegacyAppStorage = () => removeKeys(LEGACY_KEYS);
