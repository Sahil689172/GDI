const KEY = 'gdi_device_id_v1';

const gen = () => {
  const rand = Math.random().toString(16).slice(2);
  return `web_${Date.now().toString(36)}_${rand}`.slice(0, 120);
};

export const getOrCreateDeviceId = () => {
  try {
    const existing = localStorage.getItem(KEY);
    if (existing) return existing;
    const created = gen();
    localStorage.setItem(KEY, created);
    return created;
  } catch {
    return 'web';
  }
};

