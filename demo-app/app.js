(function () {
  'use strict';

  const STORAGE_KEY = 'speckit-todo-list:v1';
  const FILTERS = ['all', 'active', 'completed'];

  let state = { todos: [], filter: 'all' };

  // ---------- Persistence ----------

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(t =>
        t && typeof t.id === 'string' &&
        typeof t.text === 'string' &&
        typeof t.completed === 'boolean' &&
        typeof t.createdAt === 'number'
      );
    } catch (err) {
      console.warn('[todo] load failed, starting empty:', err);
      return [];
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
    } catch (err) {
      console.warn('[todo] save failed (in-memory only):', err);
    }
  }

  // ---------- Helpers ----------

  function makeId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  // ---------- Mutations ----------

  function addTodo(rawText) {
    const text = String(rawText || '').trim();
    if (!text) return;
    state.todos.push({ id: makeId(), text, completed: false, createdAt: Date.now() });
    saveToStorage();
    render();
  }

  function toggleTodo(id) {
    const todo = state.todos.find(t => t.id === id);
    if (!todo) return;
    todo.completed = !todo.completed;
    saveToStorage();
    render();
  }

  function deleteTodo(id) {
    const next = state.todos.filter(t => t.id !== id);
    if (next.length === state.todos.length) return;
    state.todos = next;
    saveToStorage();
    render();
  }

  function setFilter(name) {
    state.filter = FILTERS.includes(name) ? name : 'all';
    render();
  }

  function clearCompleted() {
    const next = state.todos.filter(t => !t.completed);
    if (next.length === state.todos.length) return;
    state.todos = next;
    saveToStorage();
    render();
  }

  // ---------- Render ----------

  function render() {
    const list = document.querySelector('.todo-list');
    const footer = document.querySelector('.todo-footer');
    const count = document.querySelector('.todo-footer__count');
    const clearBtn = document.querySelector('.todo-footer__clear');
    const filterBtns = document.querySelectorAll('.todo-footer__filter');

    // Visible items
    const visible = state.todos
      .slice()
      .sort((a, b) => a.createdAt - b.createdAt)
      .filter(t => {
        if (state.filter === 'active') return !t.completed;
        if (state.filter === 'completed') return t.completed;
        return true;
      });

    list.replaceChildren();
    for (const todo of visible) {
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.dataset.id = todo.id;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-item__checkbox';
      checkbox.checked = todo.completed;
      checkbox.setAttribute('aria-label', todo.text);

      const text = document.createElement('span');
      text.className = 'todo-item__text' + (todo.completed ? ' todo-item__text--completed' : '');
      text.textContent = todo.text;

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'todo-item__delete';
      del.textContent = '×';
      del.setAttribute('aria-label', `Delete: ${todo.text}`);

      li.append(checkbox, text, del);
      list.append(li);
    }

    // Footer visibility + counts
    const hasAny = state.todos.length > 0;
    const activeCount = state.todos.filter(t => !t.completed).length;
    const hasCompleted = state.todos.some(t => t.completed);

    footer.hidden = !hasAny;
    count.textContent = `${activeCount} item${activeCount === 1 ? '' : 's'} left`;
    clearBtn.hidden = !hasCompleted;

    filterBtns.forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.filter === state.filter));
    });
  }

  // ---------- Wiring ----------

  function init() {
    state.todos = loadFromStorage();

    const form = document.querySelector('.todo-form');
    const input = document.querySelector('.todo-form__input');
    const list = document.querySelector('.todo-list');
    const footer = document.querySelector('.todo-footer');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addTodo(input.value);
      input.value = '';
      input.focus();
    });

    list.addEventListener('click', (e) => {
      const li = e.target.closest('.todo-item');
      if (!li) return;
      if (e.target.classList.contains('todo-item__checkbox')) {
        toggleTodo(li.dataset.id);
      } else if (e.target.classList.contains('todo-item__delete')) {
        deleteTodo(li.dataset.id);
      }
    });

    footer.addEventListener('click', (e) => {
      if (e.target.classList.contains('todo-footer__filter')) {
        setFilter(e.target.dataset.filter);
      } else if (e.target.classList.contains('todo-footer__clear')) {
        clearCompleted();
      }
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
