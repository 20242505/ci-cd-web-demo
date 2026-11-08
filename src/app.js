import { createTask, toggleTask, deleteTask, filterTasks, getStats } from './tasks.js';
import { loadTasks, saveTasks } from './storage.js';

const checkIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 12 4 4 8-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const deleteIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M10 4h4M7 7l1 13h8l1-13M10 10v7m4-7v7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function mountApp(root, { storage = localStorage, createId = () => crypto.randomUUID() } = {}) {
  let tasks = loadTasks(storage);
  let filter = 'all';
  root.innerHTML = `
    <div class="page-shell">
      <header class="site-header">
        <a class="brand" href="./" aria-label="Enfoque, inicio"><span class="brand-icon">${checkIcon}</span>enfoque<span class="brand-dot">.</span></a>
        <span class="header-note"><span class="status-dot"></span> Un paso a la vez</span>
      </header>
      <main>
        <section class="intro" aria-labelledby="page-title">
          <p class="eyebrow"><span></span> MENOS RUIDO. MÁS CLARIDAD.</p>
          <h1 id="page-title">Tu día, con<br><em>intención.</em></h1>
          <p class="intro-description">Dale espacio a lo que importa.<br>Una tarea pequeña puede ser un gran comienzo.</p>
          <div class="intro-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span class="art-check">${checkIcon}</span><span class="art-dot"></span></div>
        </section>

        <section class="workspace" aria-labelledby="tasks-heading">
          <div class="workspace-top"><div><p class="eyebrow small">TU ESPACIO DE HOY</p><h2 id="tasks-heading">Mis tareas<span class="heading-dot">.</span></h2></div><span class="workspace-tag">Hazlo simple</span></div>
          <div class="progress-area"><div class="progress-label"><span id="progress-text"></span><span id="progress-percent"></span></div><div class="progress-track"><div id="progress-fill"></div></div></div>
          <form id="task-form" novalidate>
            <label for="task-input" class="input-label">Nueva tarea</label>
            <div class="input-row"><input id="task-input" name="title" type="text" placeholder="¿Qué quieres lograr hoy?" maxlength="100" autocomplete="off" aria-describedby="feedback" /><button type="submit" class="add-button"><span aria-hidden="true">+</span> Añadir tarea</button></div>
          </form>
          <p id="feedback" role="alert" aria-live="polite"></p>
          <div class="list-toolbar"><div class="filters" role="group" aria-label="Filtrar tareas"><button type="button" data-filter="all" aria-pressed="true">Todas</button><button type="button" data-filter="active" aria-pressed="false">Pendientes</button><button type="button" data-filter="completed" aria-pressed="false">Completadas</button></div><span id="task-count" aria-live="polite"></span></div>
          <ul id="task-list" aria-label="Lista de tareas"></ul>
          <div id="empty-state" class="empty-state"><span class="empty-icon" aria-hidden="true">${checkIcon}</span><h3 id="empty-title"></h3><p id="empty-description"></p></div>
          <div class="workspace-bottom"><span><span class="storage-dot"></span> Guardado en este navegador</span><span id="completed-count"></span></div>
        </section>
        <aside class="gentle-note"><span aria-hidden="true">✦</span><p>No tienes que hacerlo todo.<br><strong>Empieza por algo.</strong></p><span class="note-line" aria-hidden="true"></span></aside>
      </main>
      <footer class="site-footer"><span>Un poco de orden. Un poco de calma.</span><span>ENFOQUE · PROYECTO CI/CD</span></footer>
    </div>`;

  const form = root.querySelector('#task-form');
  const input = root.querySelector('#task-input');
  const feedback = root.querySelector('#feedback');
  const list = root.querySelector('#task-list');
  const storageLabel = root.querySelector('.workspace-bottom > span');

  function render() {
    const stats = getStats(tasks);
    const visible = filterTasks(tasks, filter);
    const percent = stats.total ? Math.round(stats.completed / stats.total * 100) : 0;
    root.querySelector('#progress-text').textContent = `${stats.completed} de ${stats.total} tareas completadas`;
    root.querySelector('#progress-percent').textContent = `${percent}%`;
    root.querySelector('#progress-fill').style.width = `${percent}%`;
    root.querySelector('#task-count').textContent = `${stats.pending} pendiente${stats.pending === 1 ? '' : 's'}`;
    root.querySelector('#completed-count').textContent = `${stats.completed} completada${stats.completed === 1 ? '' : 's'}`;
    root.querySelectorAll('[data-filter]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
    list.replaceChildren();
    visible.forEach((task) => {
      const item = document.createElement('li');
      item.className = `task-item${task.completed ? ' is-complete' : ''}`;
      const label = document.createElement('label');
      label.className = 'task-label';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.dataset.toggle = task.id;
      const title = document.createElement('span');
      title.textContent = task.title;
      label.append(checkbox, title);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'delete-button';
      remove.dataset.delete = task.id;
      remove.setAttribute('aria-label', `Eliminar ${task.title}`);
      remove.innerHTML = deleteIcon;
      item.append(label, remove);
      list.append(item);
    });
    root.querySelector('#empty-state').hidden = visible.length > 0;
    root.querySelector('#empty-title').textContent = stats.total === 0 ? 'Un nuevo comienzo' : filter === 'active' ? 'Todo al día' : 'Todavía no hay tareas aquí';
    root.querySelector('#empty-description').textContent = stats.total === 0 ? 'Añade tu primera tarea y da el primer paso.' : filter === 'active' ? 'Has terminado tus pendientes. Respira y disfruta.' : 'Tus tareas aparecerán en este espacio.';
  }

  function persist() {
    try {
      saveTasks(tasks, storage);
      storageLabel.innerHTML = '<span class="storage-dot"></span> Guardado en este navegador';
    } catch {
      feedback.textContent = 'No se pudieron guardar los cambios. Se perderán al cerrar esta página.';
      storageLabel.textContent = 'Cambios sin guardar';
    }
    render();
  }

  function onSubmit(event) {
    event.preventDefault();
    feedback.textContent = '';
    try {
      tasks = [...tasks, createTask(input.value, createId())];
      input.value = '';
      filter = 'all';
      persist();
      input.focus();
    } catch (error) {
      feedback.textContent = error.message;
      input.focus();
    }
  }

  function onClick(event) {
    const filterButton = event.target.closest('[data-filter]');
    if (filterButton) {
      filter = filterButton.dataset.filter;
      render();
    }
    const deleteButton = event.target.closest('[data-delete]');
    if (deleteButton) {
      tasks = deleteTask(tasks, deleteButton.dataset.delete);
      feedback.textContent = '';
      persist();
    }
  }

  function onChange(event) {
    if (event.target.matches('[data-toggle]')) {
      tasks = toggleTask(tasks, event.target.dataset.toggle);
      feedback.textContent = '';
      persist();
    }
  }

  form.addEventListener('submit', onSubmit);
  root.addEventListener('click', onClick);
  root.addEventListener('change', onChange);
  render();
  return () => {
    form.removeEventListener('submit', onSubmit);
    root.removeEventListener('click', onClick);
    root.removeEventListener('change', onChange);
  };
}
