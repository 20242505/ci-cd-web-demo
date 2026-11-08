export const STORAGE_KEY = 'enfoque.tasks.v1';

function isTask(task) {
  return task !== null && typeof task === 'object'
    && typeof task.id === 'string' && task.id.length > 0
    && typeof task.title === 'string' && task.title.trim().length > 0 && task.title.length <= 100
    && typeof task.completed === 'boolean';
}

export function loadTasks(storage = localStorage) {
  try {
    const tasks = JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(tasks) || !tasks.every(isTask)) return [];
    if (new Set(tasks.map((task) => task.id)).size !== tasks.length) return [];
    return tasks;
  } catch {
    return [];
  }
}

export function saveTasks(tasks, storage = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
