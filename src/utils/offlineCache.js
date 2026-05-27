export const cacheSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify({ v: value, at: Date.now() }));
  } catch {
    /* ignore */
  }
};

export const cacheGet = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed?.v ?? fallback;
  } catch {
    return fallback;
  }
};

