import { describe, expect, it } from 'vitest';
import { createTask, deleteTask, filterTasks, getStats, toggleTask } from '../../src/tasks.js';

const pending = Object.freeze({ id: 'a', title: 'Preparar demo', completed: false });
const done = Object.freeze({ id: 'b', title: 'Escribir README', completed: true });
const tasks = Object.freeze([pending, done]);

describe('reglas de las tareas', () => {
  it('crea una tarea pendiente y elimina espacios en los extremos', () => {
    expect(createTask('  Preparar demo  ', 'task-1')).toEqual({
      id: 'task-1', title: 'Preparar demo', completed: false,
    });
  });

  it('genera un identificador cuando no se proporciona', () => {
    const first = createTask('Primera tarea');
    const second = createTask('Segunda tarea');
    expect(first.id).toEqual(expect.any(String));
    expect(first.id).not.toBe(second.id);
  });

  it.each(['', '   ', '\n\t'])('rechaza un título vacío: %j', (title) => {
    expect(() => createTask(title, 'id')).toThrow();
  });

  it('acepta el límite de 100 caracteres y rechaza 101', () => {
    expect(createTask('a'.repeat(100), 'id').title).toHaveLength(100);
    expect(() => createTask('a'.repeat(101), 'id')).toThrow();
  });

  it('completa y vuelve a abrir una tarea sin modificar la lista original', () => {
    const completed = toggleTask(tasks, 'a');
    expect(completed).toEqual([{ ...pending, completed: true }, done]);
    expect(tasks[0].completed).toBe(false);
    expect(toggleTask(completed, 'a')).toEqual(tasks);
  });

  it('conserva las tareas si el identificador no existe', () => {
    expect(toggleTask(tasks, 'desconocido')).toEqual(tasks);
    expect(deleteTask(tasks, 'desconocido')).toEqual(tasks);
  });

  it('elimina únicamente la tarea elegida y conserva la lista original', () => {
    expect(deleteTask(tasks, 'a')).toEqual([done]);
    expect(tasks).toHaveLength(2);
  });

  it('filtra tareas pendientes y completadas', () => {
    expect(filterTasks(tasks)).toEqual(tasks);
    expect(filterTasks(tasks, 'all')).toEqual(tasks);
    expect(filterTasks(tasks, 'active')).toEqual([pending]);
    expect(filterTasks(tasks, 'completed')).toEqual([done]);
  });

  it('resume las tareas para los contadores de la interfaz', () => {
    expect(getStats(tasks)).toEqual({ total: 2, completed: 1, pending: 1 });
    expect(getStats([])).toEqual({ total: 0, completed: 0, pending: 0 });
  });
});

