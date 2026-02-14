export function moveTask(tasks, taskId, newStatus) {
  return tasks.map((task) =>
    task.id === taskId ? { ...task, status: newStatus } : task,
  );
}

export function addTask(tasks, task) {
  return [...tasks, task];
}

export function deleteTask(tasks, taskId) {
  return tasks.filter((task) => task.id !== taskId);
}

export function filterTasks(tasks, status) {
  return tasks.filter((task) => task.status === status);
}
