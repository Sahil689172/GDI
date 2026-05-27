import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { useSync } from './SyncContext';
import * as tasksApi from '../services/tasksApi.js';
import { clearLegacyTaskStorage } from '../utils/clearLegacyStorage.js';
import { cacheGet, cacheSet } from '../utils/offlineCache.js';

const TasksContext = createContext(null);

const normalizeWorkspace = (ws) => ({
  id: String(ws.id),
  name: ws.name,
  collapsed: Boolean(ws.collapsed),
  order: ws.order ?? 0,
  tasks: (ws.tasks ?? []).map((t) => ({
    id: String(t.id),
    title: t.title,
    completed: Boolean(t.completed),
    priority: t.priority ?? 'normal',
    order: t.order ?? 0,
  })),
});

const upsertTaskInWorkspaces = (workspaces, task) => {
  const wsId = String(task.workspaceId);
  return workspaces.map((ws) => {
    if (ws.id !== wsId) return ws;
    const exists = ws.tasks.some((t) => t.id === String(task.id));
    const nextTask = {
      id: String(task.id),
      title: task.title,
      completed: Boolean(task.completed),
      priority: task.priority ?? 'normal',
      order: task.order ?? 0,
    };
    return {
      ...ws,
      collapsed: false,
      tasks: exists
        ? ws.tasks.map((t) => (t.id === nextTask.id ? nextTask : t))
        : [...ws.tasks, nextTask],
    };
  });
};

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
};

export const TasksProvider = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isOnline, enqueue, registerIdMapHandler } = useSync();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const CACHE_KEY = 'gdi_cache_workspaces_v1';

  useEffect(() => {
    return registerIdMapHandler((idMap) => {
      setWorkspaces((prev) =>
        prev.map((ws) => ({
          ...ws,
          id: idMap[ws.id] || ws.id,
          tasks: ws.tasks.map((t) => ({
            ...t,
            id: idMap[t.id] || t.id,
          })),
        }))
      );
    });
  }, [registerIdMapHandler]);

  const refreshWorkspaces = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.fetchWorkspaces();
      const normalized = data.map(normalizeWorkspace);
      setWorkspaces(normalized);
      cacheSet(CACHE_KEY, normalized);
    } catch (err) {
      setError(err.parsed?.message || 'Failed to load tasks');
      const cached = cacheGet(CACHE_KEY, []);
      setWorkspaces(Array.isArray(cached) ? cached : []);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, CACHE_KEY]);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      clearLegacyTaskStorage();
      refreshWorkspaces();
    } else {
      setWorkspaces([]);
      setError(null);
      clearLegacyTaskStorage();
    }
  }, [isAuthenticated, authLoading, refreshWorkspaces]);

  useEffect(() => {
    const onPulled = () => refreshWorkspaces();
    window.addEventListener('gdi:sync:pulled', onPulled);
    return () => window.removeEventListener('gdi:sync:pulled', onPulled);
  }, [refreshWorkspaces]);

  const allTasks = useMemo(
    () =>
      workspaces.flatMap((ws) =>
        ws.tasks.map((t) => ({
          ...t,
          workspaceId: ws.id,
          workspaceName: ws.name,
        }))
      ),
    [workspaces]
  );

  const stats = useMemo(() => {
    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, productivity };
  }, [allTasks]);

  const flatTasksForDashboard = useMemo(
    () =>
      allTasks.map((t) => ({
        id: t.id,
        title: t.title,
        completed: t.completed,
        priority: t.priority === 'high' ? 'High' : t.priority === 'low' ? 'Low' : 'Medium',
        deadline: 'Today',
        workspaceId: t.workspaceId,
      })),
    [allTasks]
  );

  const createWorkspace = useCallback(async (name) => {
    const trimmed = name.trim();
    if (!trimmed || !isAuthenticated) return null;
    if (!isOnline) {
      const clientId = `tmp_ws_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const optimistic = normalizeWorkspace({
        id: clientId,
        name: trimmed,
        collapsed: false,
        order: workspaces.length,
        tasks: [],
      });
      setWorkspaces((prev) => [...prev, optimistic]);
      enqueue({
        entity: 'workspace',
        op: 'upsert',
        clientId,
        data: { name: trimmed, collapsed: false, order: optimistic.order },
      });
      return clientId;
    }
    try {
      const workspace = await tasksApi.createWorkspace({ name: trimmed, collapsed: false });
      const normalized = normalizeWorkspace(workspace);
      setWorkspaces((prev) => [...prev, normalized]);
      return normalized.id;
    } catch (err) {
      setError(err.parsed?.message || 'Failed to create workspace');
      return null;
    }
  }, [isAuthenticated, isOnline, enqueue, workspaces.length]);

  const updateWorkspace = useCallback(
    async (workspaceId, name) => {
      const trimmed = name.trim();
      if (!trimmed || !isAuthenticated) return;
      if (!isOnline) {
        setWorkspaces((prev) => prev.map((ws) => (ws.id === workspaceId ? { ...ws, name: trimmed } : ws)));
        enqueue({
          entity: 'workspace',
          op: 'upsert',
          id: workspaceId,
          data: { name: trimmed },
        });
        return;
      }
      try {
        const workspace = await tasksApi.updateWorkspace(workspaceId, { name: trimmed });
        const normalized = normalizeWorkspace(workspace);
        setWorkspaces((prev) =>
          prev.map((ws) => (ws.id === workspaceId ? normalized : ws))
        );
      } catch (err) {
        setError(err.parsed?.message || 'Failed to update workspace');
      }
    },
    [isAuthenticated, isOnline, enqueue]
  );

  const deleteWorkspace = useCallback(
    async (workspaceId) => {
      if (!isAuthenticated) return;
      if (!isOnline) {
        setWorkspaces((prev) => prev.filter((ws) => ws.id !== workspaceId));
        enqueue({ entity: 'workspace', op: 'delete', id: workspaceId });
        return;
      }
      try {
        await tasksApi.deleteWorkspace(workspaceId);
        setWorkspaces((prev) => prev.filter((ws) => ws.id !== workspaceId));
      } catch (err) {
        setError(err.parsed?.message || 'Failed to delete workspace');
      }
    },
    [isAuthenticated, isOnline, enqueue]
  );

  const toggleWorkspaceCollapse = useCallback(
    async (workspaceId) => {
      const ws = workspaces.find((w) => w.id === workspaceId);
      if (!ws || !isAuthenticated) return;
      const collapsed = !ws.collapsed;
      setWorkspaces((prev) =>
        prev.map((w) => (w.id === workspaceId ? { ...w, collapsed } : w))
      );
      if (!isOnline) {
        enqueue({
          entity: 'workspace',
          op: 'upsert',
          id: workspaceId,
          data: { collapsed },
        });
        return;
      }
      try {
        await tasksApi.updateWorkspace(workspaceId, { collapsed });
      } catch (err) {
        setError(err.parsed?.message || 'Failed to update workspace');
        refreshWorkspaces();
      }
    },
    [workspaces, isAuthenticated, refreshWorkspaces, isOnline, enqueue]
  );

  const reorderWorkspaces = useCallback(
    async (activeId, overId) => {
      if (!overId || activeId === overId || !isAuthenticated) return;
      const oldIndex = workspaces.findIndex((ws) => ws.id === activeId);
      const newIndex = workspaces.findIndex((ws) => ws.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      const next = [...workspaces];
      const [removed] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, removed);
      const orderedIds = next.map((ws) => ws.id);
      setWorkspaces(next);

      try {
        const data = await tasksApi.reorderWorkspaces(orderedIds);
        setWorkspaces(data.map(normalizeWorkspace));
      } catch (err) {
        setError(err.parsed?.message || 'Failed to reorder workspaces');
        refreshWorkspaces();
      }
    },
    [workspaces, isAuthenticated, refreshWorkspaces]
  );

  const addTask = useCallback(
    async (workspaceId, title, priority = 'normal') => {
      const trimmed = title.trim();
      if (!trimmed || !isAuthenticated) return;
      if (!isOnline) {
        const clientId = `tmp_task_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        const optimisticTask = {
          id: clientId,
          title: trimmed,
          completed: false,
          priority,
          order: 0,
          workspaceId,
        };
        setWorkspaces((prev) => upsertTaskInWorkspaces(prev, optimisticTask));
        enqueue({
          entity: 'task',
          op: 'upsert',
          clientId,
          data: {
            workspaceId,
            title: trimmed,
            priority,
            completed: false,
            order: optimisticTask.order,
          },
        });
        return;
      }
      try {
        const task = await tasksApi.createTask({
          workspaceId,
          title: trimmed,
          priority,
          completed: false,
        });
        setWorkspaces((prev) => upsertTaskInWorkspaces(prev, task));
      } catch (err) {
        setError(err.parsed?.message || 'Failed to add task');
      }
    },
    [isAuthenticated, isOnline, enqueue]
  );

  const addTaskToFirstWorkspace = useCallback(
    async (title, priority = 'normal') => {
      const trimmed = title.trim();
      if (!trimmed || !isAuthenticated) return;

      let workspaceId = workspaces[0]?.id;
      if (!workspaceId) {
        workspaceId = await createWorkspace('Inbox');
        if (!workspaceId) return;
      }
      await addTask(workspaceId, trimmed, priority);
    },
    [workspaces, isAuthenticated, createWorkspace, addTask]
  );

  const updateTask = useCallback(
    async (workspaceId, taskId, updates) => {
      if (!isAuthenticated) return;
      if (!isOnline) {
        const optimistic = {
          id: taskId,
          workspaceId: updates.workspaceId || workspaceId,
          title: updates.title,
          completed: updates.completed,
          priority: updates.priority,
          order: updates.order,
        };
        setWorkspaces((prev) => {
          let next = upsertTaskInWorkspaces(prev, optimistic);
          if (updates.workspaceId && String(updates.workspaceId) !== workspaceId) {
            next = next.map((ws) =>
              ws.id === workspaceId
                ? { ...ws, tasks: ws.tasks.filter((t) => t.id !== taskId) }
                : ws
            );
          }
          return next;
        });
        enqueue({ entity: 'task', op: 'upsert', id: taskId, data: updates });
        return;
      }
      try {
        const task = await tasksApi.updateTask(taskId, updates);
        setWorkspaces((prev) => {
          let next = upsertTaskInWorkspaces(prev, task);
          if (updates.workspaceId && String(updates.workspaceId) !== workspaceId) {
            next = next.map((ws) =>
              ws.id === workspaceId
                ? { ...ws, tasks: ws.tasks.filter((t) => t.id !== taskId) }
                : ws
            );
          }
          return next;
        });
      } catch (err) {
        setError(err.parsed?.message || 'Failed to update task');
        refreshWorkspaces();
      }
    },
    [isAuthenticated, refreshWorkspaces, isOnline, enqueue]
  );

  const toggleTask = useCallback(
    async (workspaceId, taskId) => {
      const ws = workspaces.find((w) => w.id === workspaceId);
      const task = ws?.tasks.find((t) => t.id === taskId);
      if (!task || !isAuthenticated) return;
      await updateTask(workspaceId, taskId, { completed: !task.completed });
    },
    [workspaces, isAuthenticated, updateTask]
  );

  const deleteTask = useCallback(
    async (workspaceId, taskId) => {
      if (!isAuthenticated) return;
      if (!isOnline) {
        setWorkspaces((prev) =>
          prev.map((ws) =>
            ws.id === workspaceId
              ? { ...ws, tasks: ws.tasks.filter((t) => t.id !== taskId) }
              : ws
          )
        );
        enqueue({ entity: 'task', op: 'delete', id: taskId });
        return;
      }
      try {
        await tasksApi.deleteTask(taskId);
        setWorkspaces((prev) =>
          prev.map((ws) =>
            ws.id === workspaceId
              ? { ...ws, tasks: ws.tasks.filter((t) => t.id !== taskId) }
              : ws
          )
        );
      } catch (err) {
        setError(err.parsed?.message || 'Failed to delete task');
      }
    },
    [isAuthenticated, isOnline, enqueue]
  );

  const reorderTasks = useCallback(
    async (workspaceId, activeId, overId) => {
      if (!overId || activeId === overId || !isAuthenticated) return;
      const ws = workspaces.find((w) => w.id === workspaceId);
      if (!ws) return;

      const oldIndex = ws.tasks.findIndex((t) => t.id === activeId);
      const newIndex = ws.tasks.findIndex((t) => t.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      const tasks = [...ws.tasks];
      const [removed] = tasks.splice(oldIndex, 1);
      tasks.splice(newIndex, 0, removed);
      const orderedIds = tasks.map((t) => t.id);

      setWorkspaces((prev) =>
        prev.map((w) => (w.id === workspaceId ? { ...w, tasks } : w))
      );

      try {
        const updated = await tasksApi.reorderTasks(workspaceId, orderedIds);
        setWorkspaces((prev) =>
          prev.map((w) =>
            w.id === workspaceId
              ? {
                  ...w,
                  tasks: updated.map((t) => ({
                    id: String(t.id),
                    title: t.title,
                    completed: Boolean(t.completed),
                    priority: t.priority ?? 'normal',
                    order: t.order ?? 0,
                  })),
                }
              : w
          )
        );
      } catch (err) {
        setError(err.parsed?.message || 'Failed to reorder tasks');
        refreshWorkspaces();
      }
    },
    [workspaces, isAuthenticated, refreshWorkspaces]
  );

  const toggleTaskById = useCallback(
    (taskId) => {
      for (const ws of workspaces) {
        const task = ws.tasks.find((t) => t.id === taskId);
        if (task) {
          toggleTask(ws.id, taskId);
          return;
        }
      }
    },
    [workspaces, toggleTask]
  );

  const value = useMemo(
    () => ({
      workspaces,
      setWorkspaces,
      allTasks,
      stats,
      flatTasksForDashboard,
      loading,
      error,
      refreshWorkspaces,
      createWorkspace,
      updateWorkspace,
      deleteWorkspace,
      toggleWorkspaceCollapse,
      reorderWorkspaces,
      addTask,
      addTaskToFirstWorkspace,
      updateTask,
      toggleTask,
      toggleTaskById,
      deleteTask,
      reorderTasks,
    }),
    [
      workspaces,
      allTasks,
      stats,
      flatTasksForDashboard,
      loading,
      error,
      refreshWorkspaces,
      createWorkspace,
      updateWorkspace,
      deleteWorkspace,
      toggleWorkspaceCollapse,
      reorderWorkspaces,
      addTask,
      addTaskToFirstWorkspace,
      updateTask,
      toggleTask,
      toggleTaskById,
      deleteTask,
      reorderTasks,
    ]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};
