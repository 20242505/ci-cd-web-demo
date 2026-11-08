// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadTasks, saveTasks } from '../../src/storage.js';

const tasks = [{ id: 'uno', title: 'Probar persistencia', completed: false }];

describe('persistencia local', () => {
  beforeEach(() => localStorage.clear());

  it('empieza sin tareas y permite guardar y recuperar la lista', () => {
    expect(loadTasks()).toEqual([]);
    saveTasks(tasks);
    expect(loadTasks()).toEqual(tasks);
  });

  it('permite guardar una lista vacía después de eliminar las tareas', () => {
    saveTasks(tasks);
    saveTasks([]);
    expect(loadTasks()).toEqual([]);
  });

  it.each([
    'no es JSON',
    'null',
    '{}',
    '[{"id":"uno","title":"Falta completed"}]',
    '[{"id":1,"title":"Id inválido","completed":false}]',
    '[{"id":"uno","title":42,"completed":false}]',
    '[{"id":"uno","title":"Estado inválido","completed":"false"}]',
  ])('tolera datos dañados: %s', (raw) => {
    const storage = { getItem: vi.fn(() => raw) };
    expect(loadTasks(storage)).toEqual([]);
  });

  it('tolera un navegador que bloquea la lectura del almacenamiento', () => {
    const storage = { getItem: () => { throw new Error('Acceso denegado'); } };
    expect(loadTasks(storage)).toEqual([]);
  });

  it('propaga el error de escritura para que la interfaz pueda informarlo', () => {
    const storage = { setItem: () => { throw new Error('Cuota agotada'); } };
    expect(() => saveTasks(tasks, storage)).toThrow('Cuota agotada');
  });
});

