import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

const STORAGE_KEY = 'gdi-workspaces-v1';

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const DEFAULT_WORKSPACES = [
  {
    id: 'ws-academic',
    name: 'Academic Goals',
    collapsed: false,
    tasks: [
      { id: 't-1', title: 'Complete Assignment', completed: false, priority: 'high' },
      { id: 't-2', title: 'Revise DBMS', completed: true, priority: 'normal' },
      { id: 't-3', title: 'Learn React Native', completed: false, priority: 'normal' },
    ],
  },
  {
    id: 'ws-personal',
    name: 'Personal Goals',
    collapsed: false,
    tasks: [
      { id: 't-4', title: 'Read 20 pages daily', completed: false, priority: 'normal' },
      { id: 't-5', title: 'Plan weekend trip', completed: false, priority: 'high' },
    ],
  },
  {
    id: 'ws-fitness',
    name: 'Fitness',
    collapsed: true,
    tasks: [
      { id: 't-6', title: 'Morning run 5km', completed: true, priority: 'normal' },
      { id: 't-7', title: 'Stretch routine', completed: false, priority: 'normal' },
    ],
  },
  {
    id: 'ws-project',
    name: 'Project Work',
    collapsed: false,
    tasks: [
      { id: 't-8', title: 'Release Vite Core Architecture', completed: false, priority: 'high' },
      { id: 't-9', title: 'Optimize Glassmorphism Shaders', completed: true, priority: 'normal' },
    ],
  },
];

const loadWorkspaces = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    /* use defaults */
  }
  return DEFAULT_WORKSPACES;
};

const TasksContext = createContext();

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
};

export const TasksProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState(loadWorkspaces);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
  }, [workspaces]);

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
        priority: t.priority === 'high' ? 'High' : 'Medium',
        deadline: 'Today',
        workspaceId: t.workspaceId,
      })),
    [allTasks]
  );

  const createWorkspace = useCallback((name) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const newWs = {
      id: generateId(),
      name: trimmed,
      collapsed: false,
      tasks: [],
    };
    setWorkspaces((prev) => [...prev, newWs]);
    return newWs.id;
  }, []);

  const updateWorkspace = useCallback((workspaceId, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === workspaceId ? { ...ws, name: trimmed } : ws))
    );
  }, []);

  const deleteWorkspace = useCallback((workspaceId) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== workspaceId));
  }, []);

  const toggleWorkspaceCollapse = useCallback((workspaceId) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId ? { ...ws, collapsed: !ws.collapsed } : ws
      )
    );
  }, []);

  const reorderWorkspaces = useCallback((activeId, overId) => {
    if (!overId || activeId === overId) return;
    setWorkspaces((prev) => {
      const oldIndex = prev.findIndex((ws) => ws.id === activeId);
      const newIndex = prev.findIndex((ws) => ws.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const next = [...prev];
      const [removed] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, removed);
      return next;
    });
  }, []);

  const addTask = useCallback((workspaceId, title, priority = 'normal') => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? {
              ...ws,
              collapsed: false,
              tasks: [
                ...ws.tasks,
                { id: generateId(), title: trimmed, completed: false, priority },
              ],
            }
          : ws
      )
    );
  }, []);

  const addTaskToFirstWorkspace = useCallback(
    (title, priority = 'normal') => {
      const trimmed = title.trim();
      if (!trimmed) return;
      setWorkspaces((prev) => {
        if (prev.length === 0) {
          const wsId = generateId();
          return [
            {
              id: wsId,
              name: 'Inbox',
              collapsed: false,
              tasks: [{ id: generateId(), title: trimmed, completed: false, priority }],
            },
          ];
        }
        return prev.map((ws, i) =>
          i === 0
            ? {
                ...ws,
                tasks: [
                  ...ws.tasks,
                  { id: generateId(), title: trimmed, completed: false, priority },
                ],
              }
            : ws
        );
      });
    },
    []
  );

  const updateTask = useCallback((workspaceId, taskId, updates) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? {
              ...ws,
              tasks: ws.tasks.map((t) =>
                t.id === taskId ? { ...t, ...updates } : t
              ),
            }
          : ws
      )
    );
  }, []);

  const toggleTask = useCallback((workspaceId, taskId) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? {
              ...ws,
              tasks: ws.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
          : ws
      )
    );
  }, []);

  const deleteTask = useCallback((workspaceId, taskId) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? { ...ws, tasks: ws.tasks.filter((t) => t.id !== taskId) }
          : ws
      )
    );
  }, []);

  const reorderTasks = useCallback((workspaceId, activeId, overId) => {
    if (!overId || activeId === overId) return;
    setWorkspaces((prev) =>
      prev.map((ws) => {
        if (ws.id !== workspaceId) return ws;
        const oldIndex = ws.tasks.findIndex((t) => t.id === activeId);
        const newIndex = ws.tasks.findIndex((t) => t.id === overId);
        if (oldIndex === -1 || newIndex === -1) return ws;
        const tasks = [...ws.tasks];
        const [removed] = tasks.splice(oldIndex, 1);
        tasks.splice(newIndex, 0, removed);
        return { ...ws, tasks };
      })
    );
  }, []);

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

  const value = {
    workspaces,
    setWorkspaces,
    allTasks,
    stats,
    flatTasksForDashboard,
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
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};
