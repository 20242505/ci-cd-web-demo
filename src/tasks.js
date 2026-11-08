/** Pure task operations shared by the interface and unit tests. */
export function createTask(title, id = crypto.randomUUID()) {
  if (typeof title !== 'string' || !title.trim()) {
    throw new Error('Escribe una tarea antes de añadirla.');
  }
  const cleanTitle = title.trim();
  if (cleanTitle.length > 100) {
    throw new Error('La tarea debe tener como máximo 100 caracteres.');
  }
  return { id, title: cleanTitle, completed: false };
}

export function toggleTask(tasks, id) {
  return tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
}

export function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function filterTasks(tasks, filter = 'all') {
  if (filter === 'active') return tasks.filter((task) => !task.completed);
  if (filter === 'completed') return tasks.filter((task) => task.completed);
  return [...tasks];
}

export function getStats(tasks) {
  const completed = tasks.filter((task) => task.completed).length;
  return { total: tasks.length, completed, pending: tasks.length - completed };
}
