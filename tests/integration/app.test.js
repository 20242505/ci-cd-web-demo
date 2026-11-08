// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mountApp } from '../../src/app.js';
import { loadTasks, saveTasks } from '../../src/storage.js';

let root;
let cleanup;
let sequence;

const button = (name) => [...root.querySelectorAll('button')]
  .find((element) => element.textContent.trim() === name || element.getAttribute('aria-label') === name);
const checkboxes = () => [...root.querySelectorAll('input[type="checkbox"]')];

function addTask(title) {
  const input = root.querySelector('input:not([type="checkbox"])');
  input.value = title;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  root.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

function mount(storage = localStorage) {
  cleanup = mountApp(root, { storage, createId: () => `id-${++sequence}` });
}

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '<main id="app"></main>';
  root = document.querySelector('#app');
  sequence = 0;
});

afterEach(() => {
  cleanup?.();
  document.body.innerHTML = '';
});

describe('integración de la interfaz, reglas y almacenamiento', () => {
  it('añade, completa, filtra y elimina tareas mediante la interfaz', () => {
    mount();
    expect(checkboxes()).toHaveLength(0);
    addTask('Preparar demostración');
    addTask('Revisar documentación');
    expect(checkboxes()).toHaveLength(2);
    expect(loadTasks().map((task) => task.title)).toEqual([
      'Preparar demostración', 'Revisar documentación',
    ]);

    checkboxes()[0].click();
    expect(loadTasks()[0].completed).toBe(true);
    button('Pendientes').click();
    expect(checkboxes()).toHaveLength(1);
    expect(checkboxes()[0].checked).toBe(false);
    button('Completadas').click();
    expect(checkboxes()).toHaveLength(1);
    expect(checkboxes()[0].checked).toBe(true);
    button('Todas').click();
    expect(checkboxes()).toHaveLength(2);

    button('Eliminar Preparar demostración').click();
    expect(checkboxes()).toHaveLength(1);
    expect(loadTasks()).toEqual([
      { id: 'id-2', title: 'Revisar documentación', completed: false },
    ]);
  });

  it('recupera las tareas y su estado al volver a montar la aplicación', () => {
    mount();
    addTask('Conservar después de recargar');
    checkboxes()[0].click();
    cleanup();
    root.innerHTML = '';
    mount();
    expect(checkboxes()).toHaveLength(1);
    expect(checkboxes()[0].checked).toBe(true);
    expect(root.textContent).toContain('Conservar después de recargar');
  });

  it('muestra un error al enviar espacios y permite corregirlo', () => {
    mount();
    addTask('   ');
    expect(checkboxes()).toHaveLength(0);
    expect(root.querySelector('[role="alert"]').textContent.trim()).not.toBe('');
    addTask('Título válido');
    expect(checkboxes()).toHaveLength(1);
    expect(loadTasks()[0].title).toBe('Título válido');
  });

  it('rechaza títulos demasiado largos incluso cuando se envían por código', () => {
    mount();
    addTask('a'.repeat(101));
    expect(checkboxes()).toHaveLength(0);
    expect(root.querySelector('[role="alert"]').textContent.trim()).not.toBe('');
  });

  it('representa los títulos como texto e impide inyectar etiquetas HTML', () => {
    mount();
    const title = '<img src=x onerror="alert(1)">';
    addTask(title);
    expect(root.textContent).toContain(title);
    expect(root.querySelector('img')).toBeNull();
    expect(loadTasks()[0].title).toBe(title);
  });

  it('sigue permitiendo trabajar e informa si no puede guardar los cambios', () => {
    const storage = {
      getItem: () => null,
      setItem: () => { throw new Error('Almacenamiento bloqueado'); },
    };
    mount(storage);
    addTask('Trabajar sin persistencia');
    expect(checkboxes()).toHaveLength(1);
    expect(root.querySelector('[role="alert"]').textContent.trim()).not.toBe('');
  });

  it('carga una lista existente sin duplicarla', () => {
    saveTasks([{ id: 'existente', title: 'Tarea previa', completed: true }]);
    mount();
    expect(checkboxes()).toHaveLength(1);
    expect(checkboxes()[0].checked).toBe(true);
    addTask('Tarea nueva');
    expect(loadTasks()).toHaveLength(2);
  });

  it('libera los eventos al desmontar la aplicación', () => {
    mount();
    cleanup();
    addTask('No debe guardarse');
    expect(loadTasks()).toEqual([]);
  });
});

