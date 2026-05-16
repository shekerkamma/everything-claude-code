---
description: "Task list for the Todo List Demo App"
---

# Tasks: Todo List Demo App

**Input**: Design documents from `specs/001-todo-list/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md

**Tests**: Constitution Principle II routes verification through manual smoke
testing (the script in `quickstart.md`). No automated test tasks are emitted.

**Organization**: Tasks are grouped by user story (US1, US2, US3) so each
priority slice is independently shippable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, FOUND, SETUP)

## Path Conventions

All implementation paths are under `demo-app/` per plan.md "Project Structure".

---

## Phase 1: Setup

- [ ] **T001** Create the `demo-app/` directory at the repository root.
- [ ] **T002** [P] Create `demo-app/README.md` with a one-paragraph "open `index.html`" instruction and a link to `specs/001-todo-list/quickstart.md`.

---

## Phase 2: Foundational

**Purpose**: Files and modules every user story will write into. Must be in
place before US1/US2/US3 work begins.

- [ ] **T003** Create `demo-app/index.html` skeleton: `<!doctype html>`, `<meta charset>`, `<meta viewport>`, `<title>Todo</title>`, `<link rel="stylesheet" href="styles.css">`, `<main class="todo-app">` empty container, `<script src="app.js"></script>` at end of body. No interactive markup yet.
- [ ] **T004** Create `demo-app/styles.css` with: CSS reset (`* { box-sizing: border-box }`), root font (`system-ui, sans-serif`), `body` centered max-width 480px, baseline `:focus-visible` outline (2px solid #2563eb, offset 2px). No component styles yet.
- [ ] **T005** Create `demo-app/app.js` IIFE skeleton: `(function () { 'use strict'; const STORAGE_KEY = 'speckit-todo-list:v1'; let state = { todos: [], filter: 'all' }; function render() { /* TODO */ } document.addEventListener('DOMContentLoaded', render); })();`
- [ ] **T006** Add `loadFromStorage()` and `saveToStorage()` helpers in `app.js` per `data-model.md` invariants: try/catch on both, treat parse failure as empty list, log write failures to console. Call `loadFromStorage()` once at IIFE start to seed `state.todos`.
- [ ] **T007** Add `makeId()` helper in `app.js`: returns `crypto.randomUUID()` if available, else `${Date.now()}-${Math.random().toString(36).slice(2)}` per research.md D2.

**Checkpoint**: Foundation ready — US1/US2/US3 can be implemented in any order.

---

## Phase 3: User Story 1 — Capture and view a todo (P1) 🎯 MVP

**Goal**: User can add a todo, see it, and reload without losing it.

**Independent Test**: Per spec US1 acceptance scenarios 1–5 in `quickstart.md`
steps 1, 2, 3, 10.

- [ ] **T008** [US1] In `index.html`, add the add-todo form inside `<main class="todo-app">`: `<form class="todo-form">` containing `<input class="todo-form__input" type="text" aria-label="New todo" autofocus>` and `<button class="todo-form__submit" type="submit">Add</button>`.
- [ ] **T009** [US1] In `index.html`, add the empty list container after the form: `<ul class="todo-list" aria-label="Todos"></ul>`.
- [ ] **T010** [US1] In `app.js`, implement `addTodo(text)`: trim input, return early if empty, push `{id: makeId(), text, completed: false, createdAt: Date.now()}` onto `state.todos`, call `saveToStorage()`, call `render()`. Wire the form's `submit` event to call `addTodo(input.value)` then `input.value = ''` and `input.focus()`.
- [ ] **T011** [US1] In `app.js`, extend `render()` to rebuild `<ul class="todo-list">`: clear children, then for each todo in `state.todos` (oldest-first by `createdAt`) append an `<li class="todo-item" data-id="${id}">` whose only child for now is a `<span class="todo-item__text">` set via `textContent` (NOT `innerHTML`) per research.md D4.
- [ ] **T012** [US1] In `styles.css`, add minimal styles for `.todo-form` (flex row, input grows), `.todo-form__input` (padding 8px, border 1px solid #cbd5e1, border-radius 4px), `.todo-form__submit` (padding 8px 16px, background #2563eb, color white, border 0, border-radius 4px, cursor pointer, hover background #1d4ed8), `.todo-list` (list-style none, padding 0, margin-top 16px), `.todo-item` (padding 8px 0, border-bottom 1px solid #e2e8f0).

**Checkpoint US1**: A user can add todos and reload without losing them. MVP shipped.

---

## Phase 4: User Story 2 — Mark complete and remove (P1)

**Goal**: User can toggle a todo's completion (with strikethrough) and delete
a todo.

**Independent Test**: Per spec US2 acceptance scenarios in `quickstart.md`
steps 4, 11.

- [ ] **T013** [US2] In `app.js`, implement `toggleTodo(id)`: find by id, flip `completed`, save + render. Implement `deleteTodo(id)`: filter `state.todos` to drop the matching id, save + render.
- [ ] **T014** [US2] In `app.js`, extend the `<li class="todo-item">` template inside `render()` to also append: a `<input class="todo-item__checkbox" type="checkbox">` (with `checked` reflecting `todo.completed` and `aria-label` = todo text) BEFORE the text span, and a `<button class="todo-item__delete" aria-label="Delete: ${text}">×</button>` AFTER the text span. Apply class `todo-item__text--completed` to the text span when `todo.completed`.
- [ ] **T015** [US2] In `app.js`, attach a single delegated `click` listener on the `<ul class="todo-list">` (event delegation, set up once in IIFE init): inspect `event.target`. If `.todo-item__checkbox` → call `toggleTodo(li.dataset.id)`. If `.todo-item__delete` → call `deleteTodo(li.dataset.id)`. Use `event.target.closest('.todo-item')` to find the row.
- [ ] **T016** [US2] In `styles.css`, add `.todo-item` flex row (gap 8px, align-items center), `.todo-item__text` (flex 1), `.todo-item__text--completed` (`text-decoration: line-through; color: #94a3b8;`), `.todo-item__delete` (background transparent, border 0, color #94a3b8, font-size 20px, cursor pointer, padding 0 4px, hover color #ef4444).

**Checkpoint US2**: Full per-item lifecycle works. App is independently useful.

---

## Phase 5: User Story 3 — Filter and clear (P2)

**Goal**: Footer with item count, filter buttons, and clear-completed bulk action.

**Independent Test**: Per spec US3 acceptance scenarios in `quickstart.md`
steps 5–9.

- [ ] **T017** [US3] In `index.html`, add the footer after `<ul class="todo-list">`: `<footer class="todo-footer" hidden>` containing `<span class="todo-footer__count" aria-live="polite"></span>`, `<div class="todo-footer__filters" role="group" aria-label="Filter todos">` with three `<button class="todo-footer__filter" type="button" data-filter="all|active|completed">` buttons (labels: All / Active / Completed), and `<button class="todo-footer__clear" type="button" hidden>Clear completed</button>`.
- [ ] **T018** [US3] In `app.js`, implement `setFilter(name)`: validate name ∈ {all, active, completed}, fall back to 'all' otherwise, set `state.filter`, render. Implement `clearCompleted()`: drop completed todos from state, save, render.
- [ ] **T019** [US3] In `app.js`, extend `render()` to: (a) compute `visibleTodos` from `state.todos` filtered by `state.filter`; render only those into the `<ul>`. (b) toggle `<footer class="todo-footer">` `hidden` based on `state.todos.length === 0`. (c) set `.todo-footer__count` text to `${activeCount} item${activeCount === 1 ? '' : 's'} left`. (d) set `aria-pressed="true"` on the active filter button, `"false"` on the others. (e) toggle `.todo-footer__clear` `hidden` based on `hasCompleted`.
- [ ] **T020** [US3] In `app.js`, attach delegated `click` handler on `.todo-footer`: a `[data-filter]` button → `setFilter(button.dataset.filter)`; `.todo-footer__clear` → `clearCompleted()`.
- [ ] **T021** [US3] In `styles.css`, add `.todo-footer` (flex row, gap 8px, padding-top 12px, border-top 1px solid #e2e8f0, color #64748b, font-size 14px, align-items center), `.todo-footer__count` (margin-right auto), `.todo-footer__filter` (background transparent, border 1px solid transparent, padding 4px 8px, border-radius 4px, cursor pointer, hover border-color #cbd5e1), `.todo-footer__filter[aria-pressed="true"]` (border-color #2563eb, color #2563eb), `.todo-footer__clear` (background transparent, border 0, color #64748b, cursor pointer, hover color #ef4444).

**Checkpoint US3**: All FRs satisfied. Run quickstart smoke test end-to-end.

---

## Phase 6: Polish (Cross-cutting)

- [ ] **T022** Manual smoke test: open `demo-app/index.html` in Chrome, run `quickstart.md` steps 1–11. All must pass.
- [ ] **T023** Keyboard-only run-through per `quickstart.md` "Keyboard-only run-through" section. Validates FR-011 + FR-012.
- [ ] **T024** Verify `localStorage` payload shape matches `data-model.md` "Persistence shape" by inspecting DevTools → Application → Local Storage after adding two todos.

---

## Dependency graph

```text
T001 ──▶ T002
       ╲
        ▶ T003 ──▶ T004 ──▶ T005 ──▶ T006 ──▶ T007 ──▶ Foundation Checkpoint
                                                          │
                                  ┌───────────────────────┼───────────────────────┐
                                  ▼                       ▼                       ▼
                              US1 (T008-T012)        US2 (T013-T016)         US3 (T017-T021)
                                  ▼                       ▼                       ▼
                                                       Polish (T022-T024)
```

US1 / US2 / US3 are independent once foundation is done — they could be
implemented in parallel by separate agents. We will execute sequentially since
a single developer is doing the work.
