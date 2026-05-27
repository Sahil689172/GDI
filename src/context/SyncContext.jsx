import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import * as syncApi from '../services/syncApi.js';

const SyncContext = createContext(null);

const QUEUE_KEY = 'gdi_sync_queue_v1';
const LAST_SYNC_KEY = 'gdi_last_synced_at_v1';

const loadQueue = () => {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveQueue = (queue) => {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(0, 500)));
  } catch {
    /* ignore */
  }
};

const loadLastSyncedAt = () => {
  try {
    return localStorage.getItem(LAST_SYNC_KEY);
  } catch {
    return null;
  }
};

const saveLastSyncedAt = (iso) => {
  try {
    if (iso) localStorage.setItem(LAST_SYNC_KEY, iso);
  } catch {
    /* ignore */
  }
};

const createQueueItem = ({ entity, op, id, clientId, data, updatedAt }) => ({
  qid: `q_${Date.now()}_${Math.random().toString(16).slice(2)}`,
  at: new Date().toISOString(),
  entity,
  op,
  id: id ?? null,
  clientId: clientId ?? null,
  data: data ?? null,
  updatedAt: updatedAt ?? new Date().toISOString(),
});

export const useSync = () => {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSync must be used within SyncProvider');
  return ctx;
};

export const SyncProvider = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [queue, setQueue] = useState(loadQueue);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(loadLastSyncedAt);
  const [status, setStatus] = useState(null);
  const [toast, setToast] = useState(null);

  const idMapHandlers = useRef(new Set());

  useEffect(() => saveQueue(queue), [queue]);
  useEffect(() => saveLastSyncedAt(lastSyncedAt), [lastSyncedAt]);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const triggerToast = useCallback((message) => {
    setToast(message);
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, []);

  const enqueue = useCallback((item) => {
    setQueue((prev) => {
      const next = [...prev, createQueueItem(item)];
      return next.slice(-500);
    });
  }, []);

  const registerIdMapHandler = useCallback((handler) => {
    idMapHandlers.current.add(handler);
    return () => idMapHandlers.current.delete(handler);
  }, []);

  const emitIdMap = useCallback((idMap) => {
    if (!idMap || !Object.keys(idMap).length) return;
    idMapHandlers.current.forEach((h) => {
      try {
        h(idMap);
      } catch {
        /* ignore */
      }
    });
  }, []);

  const buildPushPayload = useCallback((items) => {
    const changes = { workspaces: [], tasks: [], goals: [] };
    items.forEach((q) => {
      const target =
        q.entity === 'workspace' ? changes.workspaces : q.entity === 'task' ? changes.tasks : changes.goals;
      target.push({
        op: q.op,
        id: q.id,
        clientId: q.clientId,
        data: q.data,
        updatedAt: q.updatedAt,
      });
    });
    return { changes };
  }, []);

  const syncNow = useCallback(
    async ({ pull = true } = {}) => {
      if (!isAuthenticated || authLoading) return { ok: false, reason: 'not_authenticated' };
      if (!isOnline) {
        triggerToast('Offline — queued changes will sync later');
        return { ok: false, reason: 'offline' };
      }
      if (syncing) return { ok: false, reason: 'busy' };

      setSyncing(true);
      setError(null);
      try {
        // Always fetch current sync status
        const s = await syncApi.fetchSyncStatus();
        setStatus(s);

        // Push pending changes first
        if (queue.length) {
          const pushRes = await syncApi.pushSync(buildPushPayload(queue));
          emitIdMap(pushRes.idMap);
          setQueue([]);
          window.dispatchEvent(new CustomEvent('gdi:sync:pushed', { detail: pushRes }));
          if (pushRes.conflicts?.length) {
            triggerToast(`${pushRes.conflicts.length} conflict(s) detected`);
          } else {
            triggerToast('Synced');
          }
          setLastSyncedAt(pushRes.pushedAt || new Date().toISOString());
        }

        // Pull updates since last sync (or epoch if none)
        if (pull) {
          const since = lastSyncedAt || null;
          const pullRes = await syncApi.pullSync({ since });
          // Consumers (Tasks/Goals) will merge via their own refresh calls for now.
          // This pull is kept to establish cross-device foundation + server cursor.
          setLastSyncedAt(pullRes.pulledAt || new Date().toISOString());
          window.dispatchEvent(new CustomEvent('gdi:sync:pulled', { detail: pullRes }));
        }

        const s2 = await syncApi.fetchSyncStatus();
        setStatus(s2);
        return { ok: true };
      } catch (err) {
        setError(err.parsed?.message || 'Sync failed');
        triggerToast('Sync failed — will retry');
        return { ok: false, reason: 'error' };
      } finally {
        setSyncing(false);
      }
    },
    [
      isAuthenticated,
      authLoading,
      isOnline,
      syncing,
      queue,
      buildPushPayload,
      emitIdMap,
      lastSyncedAt,
      triggerToast,
    ]
  );

  // Auto-sync: on reconnect + periodic when online
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    if (!isOnline) return;
    // Quick sync after coming online
    const t = setTimeout(() => {
      if (queue.length) syncNow({ pull: true });
    }, 600);
    return () => clearTimeout(t);
  }, [isAuthenticated, authLoading, isOnline, queue.length, syncNow]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    if (!isOnline) return;
    const interval = setInterval(() => {
      if (queue.length) syncNow({ pull: false });
    }, 25_000);
    return () => clearInterval(interval);
  }, [isAuthenticated, authLoading, isOnline, queue.length, syncNow]);

  const value = useMemo(
    () => ({
      isOnline,
      queueSize: queue.length,
      syncing,
      error,
      lastSyncedAt,
      status,
      toast,
      enqueue,
      syncNow,
      registerIdMapHandler,
    }),
    [isOnline, queue.length, syncing, error, lastSyncedAt, status, toast, enqueue, syncNow, registerIdMapHandler]
  );

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
};

