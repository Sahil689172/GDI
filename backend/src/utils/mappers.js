const workspaceIdOf = (task) => {
  const ws = task.workspace;
  return ws?._id?.toString?.() ?? ws?.toString?.() ?? ws;
};

export const toPublicTask = (task) => ({
  id: task._id,
  title: task.title,
  completed: task.completed,
  priority: task.priority,
  workspaceId: workspaceIdOf(task),
  order: task.order,
  completedAt: task.completedAt ?? null,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

export const toPublicWorkspace = (workspace, tasks = []) => ({
  id: workspace._id,
  name: workspace.name,
  collapsed: workspace.collapsed,
  order: workspace.order,
  tasks: tasks.map(toPublicTask),
  createdAt: workspace.createdAt,
  updatedAt: workspace.updatedAt,
});
